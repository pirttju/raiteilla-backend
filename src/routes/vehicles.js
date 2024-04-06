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
  let bbox,
    bounds,
    routeType = [];

  // --- Validate routeType if given ---
  if (req.query.routeType !== undefined) {
    if (!/^[0-9]+(,[0-9]+)*$/.test(req.query.routeType)) {
      res.status(500).send("Error: invalid input for routeType");
      return false;
    }
    routeType = req.query.routeType.split(",");
  }

  // --- Filter by bounding box ---
  if (req.query.bbox) {
    bbox = req.query.bbox.split(",");
    bounds = [
      parseFloat(bbox[0], 10),
      parseFloat(bbox[1], 10),
      parseFloat(bbox[2], 10),
      parseFloat(bbox[3], 10),
    ];
    if (bounds?.includes(NaN)) {
      res.status(500).send("Error: invalid input for bbox");
      return false;
    } else {
      //
      let query;
      if (routeType.length > 0) {
        query = tile38.client
          .intersectsQuery(TILE38_KEY)
          .limit(TILE38_LIMIT)
          .whereIn("properties.rt", ...routeType)
          .bounds(...bounds);
      } else {
        query = tile38.client
          .intersectsQuery(TILE38_KEY)
          .limit(TILE38_LIMIT)
          .bounds(...bounds);
      }
      // Execute query
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
  }
  // --- All features ---
  else {
    let query;
    if (routeType.length > 0) {
      query = tile38.client
        .scanQuery(TILE38_KEY)
        .limit(TILE38_LIMIT)
        .whereIn("properties.rt", ...routeType);
    } else {
      query = tile38.client.scanQuery(TILE38_KEY).limit(TILE38_LIMIT);
    }
    // Execute query
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
