exports.handler = function(event, context, callback) {
  const { user } = context.clientContext;
  const { AWS_IAM_ID, AWS_IAM_SECRET } = process.env;

  console.log("testing log here");

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
