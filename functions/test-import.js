import { corsHeaders } from "./lib/cors-headers";

exports.handler = function(event, context, callback) {
  // your server-side functionality
  callback(null, {
    statusCode: 200,
    headers: corsHeaders,
    body: "Hello, World"
  });
};
