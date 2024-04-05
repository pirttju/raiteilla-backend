"use strict";

exports.toFeatureCollection = function (data) {
  const fc = {
    type: "FeatureCollection",
    features: [],
  };
  for (const itm of data.objects) {
    fc.features.push({
      type: "Feature",
      geometry: itm.object,
      properties: itm.fields[0],
    });
  }
  return fc;
};
