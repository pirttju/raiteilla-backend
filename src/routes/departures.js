"use strict";

require("dotenv").config();
const express = require("express");
const router = express.Router();
const feeds = require("../feeds");

router.get("/", async (req, res) => {
  if (!req.query.station) {
    res.status(400).send(`Missing parameter station`);
    return;
  }

  const key = req.query.station.split(":"); // feed_id:short_code

  if (key.length != 2) {
    res.status(400).send(`Improperly formatted parameter station`);
    return;
  }

  let data = {};

  switch (key[0]) {
    case "fi":
      data = await feeds.fi.getDepartures(key[1]);
      break;
    case "gb":
      break;
    case "ie":
      data = await feeds.ie.getDepartures(key[1]);
      break;
    case "nl":
      data = await feeds.nl.getDepartures(key[1]);
      break;
    case "no":
      data = await feeds.no.getDepartures(key[1]);
      break;
    case "se":
      data = await feeds.se.getDepartures(key[1]);
      break;
    default:
    // return empty data
  }

  res.json(data);
});

module.exports = router;
