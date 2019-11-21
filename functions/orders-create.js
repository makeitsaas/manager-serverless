const AWS = require("aws-sdk");
const { AWS_IAM_ID, AWS_IAM_SECRET, ADMIN_EMAIL } = process.env;

const DYNAMODB_TABLE_NAME = "DEPLOYER_ORDERS";

AWS.config.update({
  region: "eu-central-1",
  accessKeyId: AWS_IAM_ID,
  secretAccessKey: AWS_IAM_SECRET
});

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const createOrder = (userUuid, order) => {
  const item = orderItem(order, userUuid);

  const dynamoParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Item: item
  };

  return new Promise((resolve, reject) => {
    ddb.putItem(dynamoParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const orderItem = (order, userUuid) => {
  return {
    UserUuid: { S: userUuid },
    OrderUuid: { S: uuid() },
    OrderContent: { S: order },
    OrderReport: { S: `{}` },
    CreatedAt: { S: NOW() },
    UpdatedAt: { S: NOW() }
  };
};

const OrderContent = `
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

const uuid = () => {
  return `${Math.floor(Math.random() * 1000000000)}`;
};

const NOW = () => {
  return `${new Date()}`;
};

const userUuid = "test-random-uuid-1234";
const order = OrderContent;

exports.handler = (event, context, callback) => {
  const { user } = context.clientContext;

  if (user && user.email === ADMIN_EMAIL) {
    createOrder(userUuid, order)
      .then(orderData =>
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(orderData)
        })
      )
      .catch(err =>
        callback(null, {
          statusCode: 500,
          body: JSON.stringify(err)
        })
      );
  } else {
    callback(null, {
      statusCode: 403,
      body: "Forbidden"
    });
  }
};
