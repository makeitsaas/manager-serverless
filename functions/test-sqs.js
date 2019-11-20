const AWS = require("aws-sdk");

exports.handler = function(event, context, callback) {
  const { user } = context.clientContext;
  const { AWS_IAM_ID, AWS_IAM_SECRET, AWS_SQS_QUEUE_URL } = process.env;

  console.log("testing log here");
  if (AWS) {
    console.log("aws sdk ok");
    const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
    const params = {
      DelaySeconds: 10,
      MessageAttributes: {
        // "Author": {
        //     DataType: "String",
        //     StringValue: "John Grisham"
        // },
        // "WeeksOn": {
        //     DataType: "Number",
        //     StringValue: "6"
        // }
      },
      MessageBody: "Some body from Netlify",
      // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
      // MessageId: "Group1",  // Required for FIFO queues
      QueueUrl: AWS_SQS_QUEUE_URL || ""
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log("error sending message", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
  }

  if (user) {
    if (AWS_IAM_ID && AWS_IAM_SECRET) {
      callback(null, {
        statusCode: 200,
        body: AWS_IAM_ID.slice(0, 4) + "*********"
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
