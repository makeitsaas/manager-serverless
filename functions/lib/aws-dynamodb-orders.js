const myAws = require("./aws");
const parsers = require("./parsers");

const DYNAMODB_TABLE_NAME = "DEPLOYER_ORDERS";
const DYNAMO_DB_COLUMNS = [
  "UserUuid",
  "OrderUuid",
  "OrderContent",
  "OrderReport",
  "CreatedAt",
  "UpdatedAt"
];

const dynamoClient = myAws.getDynamoDBClient();

const scan = () => {
  const params = {
    ExpressionAttributeValues: {
      ":userUuid": { S: "test-random-uuid-1234" }
    },
    KeyConditionExpression: "UserUuid = :userUuid",
    ProjectionExpression: DYNAMO_DB_COLUMNS.join(", "),
    TableName: DYNAMODB_TABLE_NAME
  };

  return new Promise((resolve, reject) => {
    dynamoClient.query(params, (err, data) => {
      if (err) {
        reject(data);
      } else {
        const elements = data.Items.map(parseElement);
        resolve(elements);
      }
    });
  });
};

const create = (orderUuid, userUuid, order) => {
  const item = orderItem(orderUuid, userUuid, order);

  const dynamoParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Item: item
  };

  return new Promise((resolve, reject) => {
    dynamoClient.putItem(dynamoParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const orderItem = (orderUuid, userUuid, order) => {
  return {
    UserUuid: { S: userUuid },
    OrderUuid: { S: orderUuid },
    OrderContent: { S: order },
    OrderReport: { S: `{}` },
    CreatedAt: { S: NOW() },
    UpdatedAt: { S: NOW() }
  };
};

const NOW = () => {
  return `${new Date()}`;
};

const parseElement = rawElement => ({
  UserUuid: rawElement.UserUuid && rawElement.UserUuid.S,
  OrderUuid: rawElement.OrderUuid && rawElement.OrderUuid.S,
  OrderContent: rawElement.OrderContent && rawElement.OrderContent.S,
  OrderReport: rawElement.OrderReport && parsers.json(rawElement.OrderReport.S),
  CreatedAt: rawElement.CreatedAt && parsers.date(rawElement.CreatedAt.S),
  UpdatedAt: rawElement.UpdatedAt && parsers.date(rawElement.UpdatedAt.S)
});

module.exports = {
  scan,
  create
};
