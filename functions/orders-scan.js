const corsHeaders = require("./lib/cors-headers");
const corsRedirectMiddleware = require("./lib/cors-redirect-middleware");
const authenticationAdminMiddleware = require("./lib/authentication-admin-middleware");
const dynamoOrdersTable = require("./lib/dynamodb-orders");

exports.handler = (event, context, callback) => {
  if (corsRedirectMiddleware(event, context, callback)) {
    return;
  }

  if (!authenticationAdminMiddleware(event, context, callback)) {
    return;
  }

  dynamoOrdersTable
    .scan()
    .then(ordersList =>
      callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          orders: ordersList
        })
      })
    )
    .catch(err =>
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err)
      })
    );
};
