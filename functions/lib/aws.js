const AWS = require("aws-sdk");
const { AWS_IAM_ID, AWS_IAM_SECRET } = process.env;

AWS.config.update({
  region: "eu-central-1",
  accessKeyId: AWS_IAM_ID,
  secretAccessKey: AWS_IAM_SECRET
});

module.exports = {
  getDynamoDBClient: () => {
    return new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  }
};
