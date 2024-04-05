const pgPromise = require("pg-promise");
const dbConfig = require("../../db-config.json");
const { Diagnostics } = require("./diagnostics");
const { Train } = require("./repos");

const initOptions = {
  extend(obj, dc) {
    obj.train = new Train(obj, pgp);
  },
};

const pgp = pgPromise(initOptions);
const db = pgp(dbConfig);
Diagnostics.init(initOptions);

module.exports = { db, pgp };
