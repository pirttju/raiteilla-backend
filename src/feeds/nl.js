"use strict";

require("dotenv").config();

const baseUrl =
  "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures";
const authenticationkey = process.env.NSAPI_KEY;

async function getDepartures(shortCode) {
  try {
    const url = `${baseUrl}?station=${shortCode}&maxJourneys=10`;
    const response = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": authenticationkey,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const trains = [];
    for (const t of data.payload.departures) {
      const r = {
        trainNumber: t.product.number,
        trainType: t.product.categoryCode,
        origin: "",
        destination: t.direction,
        departure: t.plannedDateTime,
        expectedDeparture: t.actualDateTime,
        track: t.actualTrack,
      };
      trains.push(r);
    }
    return trains;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getDepartures };
