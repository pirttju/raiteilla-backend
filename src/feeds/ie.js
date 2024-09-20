const { transform } = require("camaro");

const baseUrl =
  "http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML";
const template = [
  "/ArrayOfObjStationData/objStationData",
  {
    trainNumber: "Traincode",
    trainType: "Traintype",
    origin: "Origin",
    destination: "Destination",
    departure: "Schdepart",
    expectedDeparture: "Expdepart",
  },
];

async function getDepartures(shortCode) {
  try {
    const url = `${baseUrl}?StationCode=${shortCode}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xml = await response.text();
    const result = await transform(xml, template);
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getDepartures };
