const corsHeaders = require("./lib/cors-headers");
const corsRedirectMiddleware = require("./lib/cors-redirect-middleware");
const authenticationAdminMiddleware = require("./lib/authentication-admin-middleware");
const dynamoOrdersTable = require("./lib/dynamodb-orders");

const OrderContentSample = `
action: "update"
environment_id: "4"
description: "Simple Landing angular"
front:
    domains:
      - simple-landing-front.lab.makeitsaas.com
      - app.simplelanding.io
    services:
      - uuid: "11"
        path: /
        repository: 
          url: 'https://github.com/makeitsaas/simple-landing-front'
        type: angular
`;

const userUuid = "test-random-uuid-1234";
const order = OrderContentSample;

exports.handler = (event, context, callback) => {
  if (corsRedirectMiddleware(event, context, callback)) {
    return;
  }

  if (!authenticationAdminMiddleware(event, context, callback)) {
    return;
  }

  dynamoOrdersTable
    .create(userUuid, order)
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
