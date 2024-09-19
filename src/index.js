"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const departures = require("./routes/departures");
const vehicles = require("./routes/vehicles");

// Express configuration
const EXPRESS_PORT = process.env.EXPRESS_PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("Raiteilla Backend");
});

app.use("/departures", departures);
app.use("/vehicles", vehicles);

app.listen(EXPRESS_PORT, () => {
  console.log("\nReady for GET requests on http://localhost:" + EXPRESS_PORT);
});
