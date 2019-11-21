const { ADMIN_EMAIL } = process.env;
const corsHeaders = require("./lib/cors-headers");
const myAws = require("./lib/aws");

const DYNAMODB_TABLE_NAME = "DEPLOYER_ORDERS";
const DYNAMO_DB_COLUMNS = [
  "UserUuid",
  "OrderUuid",
  "OrderContent",
  "OrderReport",
  "CreatedAt",
  "UpdatedAt"
];

const ddb = myAws.getDynamoDBClient();

const params = {
  ExpressionAttributeValues: {
    ":userUuid": { S: "test-random-uuid-1234" }
  },
  KeyConditionExpression: "UserUuid = :userUuid",
  ProjectionExpression: DYNAMO_DB_COLUMNS.join(", "),
  TableName: DYNAMODB_TABLE_NAME
};

const scanOrders = () => {
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
  OrderReport: parseReport(rawElement.OrderReport.S),
  CreatedAt: parseDate(rawElement.CreatedAt.S),
  UpdatedAt: parseDate(rawElement.UpdatedAt.S)
});

const parseDate = stringDate => {
  try {
    return new Date(stringDate);
    /*
    Finally, it is better to return the date, even if it is invalid.
    That will be checked anyway in automatic processes and it is better for debugging purposes to bring this everywhere
    if(!isNaN(parsed.getTime())) {
      return parsed;
    } else {
      return null;
    }
    */
  } catch (e) {
    return null;
  }
};

const parseReport = stringReport => {
  try {
    return JSON.parse(stringReport);
  } catch (e) {
    return null;
  }
};

exports.handler = (event, context, callback) => {
  if (optionRedirect(event, context, callback)) {
    return;
  }

  const { user } = context.clientContext;

  if (user && user.email === ADMIN_EMAIL) {
    scanOrders()
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
  } else {
    callback(null, {
      statusCode: 403,
      body: "Forbidden"
    });
  }
};

const optionRedirect = (event, context, callback) => {
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
