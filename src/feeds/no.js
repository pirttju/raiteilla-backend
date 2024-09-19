const { transform } = require("camaro");

const baseUrl = "https://siri.banenor.no/jbv/sm/stop-monitoring.xml";
const template = [
  "/Siri/ServiceDelivery/StopMonitoringDelivery/MonitoredStopVisit/MonitoredVehicleJourney",
  {
    trainNumber: "VehicleRef",
    trainType: "ProductCategoryRef",
    commuterLineID: "LineRef",
    origin: "OriginName",
    destination: "DestinationName",
    departure: "MonitoredCall/AimedDepartureTime",
    expectedDeparture: "MonitoredCall/ExpectedDepartureTime",
    cancelled: 'boolean(MonitoredCall/DepartureStatus = "cancelled")',
    track: "MonitoredCall/DeparturePlatformName",
  },
];

async function getDepartures(shortCode) {
  try {
    const url = `${baseUrl}?MonitoringRef=${shortCode}&ServiceFeatureRef=passengerTrain&StopVisitTypes=departures&MaximumStopVisits=10`;
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
