"use strict";

require("dotenv").config();
const express = require("express");
const router = express.Router();
const feeds = require("../feeds");

router.get("/", async (req, res) => {
  const key = req.query.station.split(":"); // feed_id:short_code
  let data = {};

  switch (key[0]) {
    case "fi":
      data = await feeds.fi.getDepartures(key[1]);
      break;
    case "gb":
      break;
    case "ie":
      break;
    case "nl":
      break;
    case "no":
      data = await feeds.no.getDepartures(key[1]);
      break;
    case "se":
      break;
    default:
    // return empty data
  }

  res.json(data);
});

module.exports = router;
