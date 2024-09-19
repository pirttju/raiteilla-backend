"use strict";

require("dotenv").config();

const baseUrl = "https://api.trafikinfo.trafikverket.se/v2/data.json";
const authenticationkey = process.env.TRAFIKVERKET_KEY;

async function getDepartures(shortCode) {
  try {
    const xmlRequest =
      "<REQUEST>" +
      `<LOGIN authenticationkey='${process.env.TRAFIKVERKET_KEY}' />` +
      "<QUERY objecttype='TrainAnnouncement' orderby='AdvertisedTimeAtLocation' schemaversion='1.9' limit='10'>" +
      "<FILTER>" +
      "<AND>" +
      "<OR>" +
      "<AND>" +
      "<GT name='AdvertisedTimeAtLocation' " +
      "value='$dateadd(-00:15:00)' />" +
      "<LT name='AdvertisedTimeAtLocation' " +
      "value='$dateadd(14:00:00)' />" +
      "</AND>" +
      "<GT name='EstimatedTimeAtLocation' value='$now' />" +
      "</OR>" +
      `<EQ name='LocationSignature' value='${shortCode}' />` +
      "<EQ name='ActivityType' value='Avgang' />" +
      "</AND>" +
      "</FILTER>" +
      // Just include wanted fields to reduce response size.
      "<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>" +
      "<INCLUDE>AdvertisedTrainIdent</INCLUDE>" +
      "<INCLUDE>Canceled</INCLUDE>" +
      "<INCLUDE>EstimatedTimeAtLocation</INCLUDE>" +
      "<INCLUDE>FromLocation</INCLUDE>" +
      "<INCLUDE>ToLocation</INCLUDE>" +
      "<INCLUDE>TrackAtLocation</INCLUDE>" +
      "</QUERY>" +
      "</REQUEST>";
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml",
        "Accept-Encoding": "gzip",
      },
      body: xmlRequest,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const trains = [];
    if (data.RESPONSE?.RESULT?.length > 0) {
      for (const t of data.RESPONSE.RESULT[0].TrainAnnouncement) {
        const r = {
          trainType: "",
          trainNumber: t.AdvertisedTrainIdent,
          departure: t.AdvertisedTimeAtLocation,
          expectedDeparture: t.EstimatedTimeAtLocation,
          track: t.TrackAtLocation,
          departureCancelled: t.Canceled,
        };

        if (t.FromLocation?.length > 0) {
          r.origin = t.FromLocation[0].LocationName;
        }
        if (t.ToLocation?.length > 0) {
          r.destination = t.ToLocation[0].LocationName;
        }

        trains.push(r);
      }
    }
    return trains;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { getDepartures };
