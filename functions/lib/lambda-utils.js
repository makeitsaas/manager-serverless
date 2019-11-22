const parsers = require("./parsers");

module.exports = {
  parseBody: requestEvent => {
    return parsers.json(requestEvent.body) || {};
  }
};
