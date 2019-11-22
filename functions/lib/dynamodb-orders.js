const parsers = require("./parsers");
const DYNAMO_DB_TABLE_NAME = "DEPLOYER_ORDERS";
const DYNAMO_DB_COLUMNS = [
  "UserUuid",
  "OrderUuid",
  "OrderContent",
  "OrderReport",
  "CreatedAt",
  "UpdatedAt"
];

module.exports = myAws => {
  const ddb = myAws.getDynamoDBClient();

  const scan = () => {
    const params = {
      ExpressionAttributeValues: {
        ":userUuid": { S: "test-random-uuid-1234" }
      },
      KeyConditionExpression: "UserUuid = :userUuid",
      ProjectionExpression: DYNAMO_DB_COLUMNS.join(", "),
      TableName: DYNAMO_DB_TABLE_NAME
    };

    return new Promise((resolve, reject) => {
      ddb.query(params, (err, data) => {
        if (err) {
          reject(data);
        } else {
          const elements = data.Items.map(parseElement);
          resolve(elements);
        }
      });
    });
  };

  const parseElement = rawElement => ({
    UserUuid: rawElement.UserUuid.S,
    OrderUuid: rawElement.OrderUuid.S,
    OrderContent: rawElement.OrderContent.S,
    OrderReport: parsers.json(rawElement.OrderReport.S),
    CreatedAt: parsers.date(rawElement.CreatedAt.S),
    UpdatedAt: parsers.date(rawElement.UpdatedAt.S)
  });

  return {
    scan
  };
};
