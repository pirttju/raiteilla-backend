"use strict";

require("dotenv").config();
const express = require("express");
const router = express.Router();
const tile38 = require("../db/tile38");
const geojsonUtils = require("../utils/geojson");

// The common key in Tile38
const TILE38_KEY = process.env.TILE38_KEY || "vehicles";
// Max number of features to fetch
const TILE38_LIMIT = process.env.TILE38_LIMIT || 1000;

router.get("/", (req, res) => {
  let bbox, bounds;

  if (req.query.bbox) {
    bbox = req.query.bbox.split(",");
    bounds = [
      parseFloat(bbox[0], 10),
      parseFloat(bbox[1], 10),
      parseFloat(bbox[2], 10),
      parseFloat(bbox[3], 10),
    ];
    if (bounds?.includes(NaN)) {
      res.status(500).send("Error: Failed to parse bbox");
    } else {
      // Return only features within bounds
      let query = tile38.client
        .intersectsQuery(TILE38_KEY)
        .limit(TILE38_LIMIT)
        .bounds(...bounds);
      query
        .execute()
        .then((data) => {
          const fc = geojsonUtils.toFeatureCollection(data);
          res.json(fc);
        })
        .catch((err) => {
          res.status(500).send(`Error: ${err}`);
        });
    }
  } else {
    // Return all features
    let query = tile38.client.scanQuery(TILE38_KEY).limit(TILE38_LIMIT);
    query
      .execute()
      .then((data) => {
        const fc = geojsonUtils.toFeatureCollection(data);
        res.json(fc);
      })
      .catch((err) => {
        res.status(500).send(`Error: ${err}`);
      });
  }
});

module.exports = router;
