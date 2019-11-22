const corsHeaders = require("./cors-headers");

/**
 * Returns true and sends the appropriate response if request shall be ignored because it is an CORS related one
 * Returns false and do nothing otherwise
 *
 * @param event
 * @param context
 * @param callback
 * @returns {boolean}
 */
module.exports = (event, context, callback) => {
  if (process.env.ENABLE_CORS && event.httpMethod === "OPTIONS") {
    const response = {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "You can use CORS" })
    };
    callback(null, response);
    return true;
  }
  return false;
};
