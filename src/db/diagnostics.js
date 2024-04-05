const { EOL } = require("os");
const { appendFileSync } = require("fs");
const monitor = require("pg-monitor");

monitor.setTheme("matrix");

const $DEV = process.env.NODE_ENV === "development";
const logFile = "./db/errors.log";

monitor.setLog((msg, info) => {
  if (info.event === "error") {
    let logText = EOL + msg;
    if (info.time) {
      logText = EOL + logText;
    }
    appendFileSync(logFile, logText);
  }

  if (!$DEV) {
    info.display = false;
  }
});

class Diagnostics {
  static init(options) {
    if ($DEV) {
      monitor.attach(options);
    } else {
      monitor.attach(options, ["error"]);
    }
  }
}

module.exports = { Diagnostics };
