exports.handler = function(event, context, callback) {
  const { user } = context.clientContext;
  // your server-side functionality
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: "This is an authentication test",
      user
    })
  });
};
