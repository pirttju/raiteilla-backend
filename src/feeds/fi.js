const baseUrl = "https://rata.digitraffic.fi/api/v2/graphql/graphql";

async function getDepartures(shortCode) {
  try {
    const query = `{trainsByStationAndQuantity( station: "${shortCode}" arrivedTrains: 0 arrivingTrains: 0 departedTrains: 0 departingTrains: 10) { trainNumber departureDate trainType { name } commuterLineid cancelled timeTableRows(orderBy: { scheduledTime: ASCENDING }) { station { name shortCode } type commercialTrack scheduledTime liveEstimateTime actualTime differenceInMinutes cancelled}}}`;
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip",
      },
      body: JSON.stringify({ query: query }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    trains = [];
    for (const t of data.data.trainsByStationAndQuantity) {
      const r = {
        trainNumber: t.trainNumber,
        trainType: t.trainType.name,
        commuterLineID: t.commuterLineid,
        origin: t.timeTableRows[0].station.name,
        destination: t.timeTableRows[t.timeTableRows.length - 1].station.name,
      };
      for (const i of t.timeTableRows) {
        if (i.station.shortCode === shortCode && i.type === "ARRIVAL") {
          r.arrival = i.scheduledTime;
          r.expectedArrival = i.liveEstimateTime;
        }
        if (i.station.shortCode === shortCode && i.type === "DEPARTURE") {
          r.departure = i.scheduledTime;
          r.expectedDeparture = i.liveEstimateTime;
          r.timeForSorting = i.liveEstimateTime || i.scheduledTime;
          r.cancelled = i.cancelled;
          trains.push(r);
        }
      }
    }
    result = trains.sort((a, b) => {
      return a.timeForSorting < b.timeForSorting
        ? -1
        : a.timeForSorting > b.timeForSorting
        ? 1
        : 0;
    });
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getDepartures };
