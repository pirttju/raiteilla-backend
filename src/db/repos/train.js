//const { users: sql } = require("../sql");

const cs = {};

class TrainRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
    createColumnsets(pgp);
  }

  findById(id) {
    return this.db.oneOrNone("SELECT * FROM train WHERE id = $1", +id);
  }
}

function createColumnsets(pgp) {
  if (!cs.insert) {
    const table = new pgp.helpers.TableName({
      table: "train",
      schema: "public",
    });

    cs.insert = new pgp.helpers.ColumnSet(["name"], { table });
    cs.update = cs.insert.extend(["?id"]);
  }
  return cs;
}

module.exports = TrainRepository;
