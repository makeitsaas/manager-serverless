const { AWS_SQS_QUEUE_URL } = process.env;

const myAws = require("./aws");
const sqsClient = myAws.getSqsClient();

const push = (orderUuid, userUuid, orderContent) => {
  const parsedBody = {
    UserUuid: userUuid,
    OrderUuid: orderUuid,
    OrderContent: orderContent
  };

  const params = {
    DelaySeconds: 10,
    MessageAttributes: {},
    MessageBody: JSON.stringify(parsedBody),
    QueueUrl: AWS_SQS_QUEUE_URL
  };

  return new Promise((resolve, reject) => {
    sqsClient.sendMessage(params, (err, data) => {
      if (err) {
        console.log("********** error sending message");
        console.log(err);
        console.log("********** end error");
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = {
  push
};
