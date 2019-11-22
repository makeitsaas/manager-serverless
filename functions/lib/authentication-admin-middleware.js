const { ADMIN_EMAIL } = process.env;

/**
 * Returns the user if it is an admin
 * Returns nothing and an error response otherwise
 *
 * @param event
 * @param context
 * @param callback
 */
module.exports = (event, context, callback) => {
  const { user } = context.clientContext;
  if (!user) {
    callback(null, {
      statusCode: 401,
      body: "Authorization required"
    });
  } else if (user.email !== ADMIN_EMAIL) {
    callback(null, {
      statusCode: 403,
      body: "Forbidden (admin restricted)"
    });
  } else {
    return user;
  }
};
