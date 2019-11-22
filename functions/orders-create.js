const corsHeaders = require("./lib/cors-headers");
const corsRedirectMiddleware = require("./lib/cors-redirect-middleware");
const authenticationAdminMiddleware = require("./lib/authentication-admin-middleware");
const dynamoOrdersTable = require("./lib/dynamodb-orders");
const lambdaUtils = require("./lib/lambda-utils");

exports.handler = (event, context, callback) => {
  if (corsRedirectMiddleware(event, context, callback)) {
    return;
  }

  if (!authenticationAdminMiddleware(event, context, callback)) {
    return;
  }

  const userUuid = "test-random-uuid-1234";
  const body = lambdaUtils.parseBody(event);

  console.log("body", body);

  if (!body || !body.order) {
    callback(null, {
      statusCode: 400,
      headers: corsHeaders,
      body: "Order is missing"
    });
    return;
  }

  dynamoOrdersTable
    .create(userUuid, body.order)
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
