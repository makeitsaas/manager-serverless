const AWS = require("aws-sdk");
const {
  AWS_IAM_ID,
  AWS_IAM_SECRET,
  AWS_SQS_QUEUE_URL,
  ADMIN_EMAIL
} = process.env;

AWS.config.update({
  region: "eu-central-1",
  accessKeyId: AWS_IAM_ID,
  secretAccessKey: AWS_IAM_SECRET
});

exports.handler = function(event, context, callback) {
  const { user } = context.clientContext;

  if (user && user.email === ADMIN_EMAIL) {
    if (AWS_IAM_ID && AWS_IAM_SECRET && AWS_SQS_QUEUE_URL) {
      const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
      const params = {
        DelaySeconds: 10,
        MessageAttributes: {},
        MessageBody: "Some body from Netlify",
        QueueUrl: AWS_SQS_QUEUE_URL
      };

      sqs.sendMessage(params, (err, data) => {
        if (err) {
          console.log("********** error sending message");
          console.log(err);
          console.log("********** end error");
          callback(null, {
            statusCode: 500,
            body: JSON.stringify(err)
          });
        } else {
          callback(null, {
            statusCode: 200,
            body: "Message: " + data.MessageId
          });
        }
      });
    } else {
      callback(null, {
        statusCode: 500,
        body: "Missing environment variables"
      });
    }
  } else {
    callback(null, {
      statusCode: 403,
      body: "Forbidden"
    });
  }
};
