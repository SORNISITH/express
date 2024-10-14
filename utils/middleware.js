const unknownEndpoint = (error, req, res, next) => {
  res.status(404).json({
    code: "-1",
    error: "unknown Endpoint",
    description: "Resource not found",
  });
};

const autoHandleError = (error, req, res, next) => {
  const errorMappings = [
    ["ReferenceError", 500, "Server error due to undefined variables."],
    ["TypeError", 500, "Server error due to unexpected types."],
    ["SyntaxError", 400, "Client error for malformed syntax (e.g., JSON)."],
    ["ValidationError", 400, "Client error for validation issues in requests."],
    ["CastError", 400, "Client error for invalid object IDs in MongoDB."],
    ["MongoServerError", 500, "Server error from MongoDB operations."],
    ["JsonWebTokenError", 401, "Unauthorized access due to invalid token."],
    ["UnauthorizedError", 401, "Unauthorized access (general case)."],
    ["NotFoundError", 404, "Resource not found (e.g., user, note)."],
    [
      "ConflictError",
      409,
      "Conflict with the current state (e.g., duplicate entries).",
    ],
    ["NetworkError", 503, "Service unavailable due to network issues."],
    ["RangeError", 400, "Client error for invalid range of values."],
    ["InternalServerError", 500, "Generic server error."],
    ["RequestTimeoutError", 408, "Client error for timeout in the request."],
    [
      "SequelizeValidationError",
      400,
      "Client error for Sequelize model validation.",
    ],
    [
      "SequelizeUniqueConstraintError",
      409,
      "Conflict due to unique constraint violation.",
    ],
    ["DatabaseError", 500, "Generic database error."],
    ["HttpError", 400, "Generic HTTP error, could vary."],
    ["TimeoutError", 504, "Gateway timeout from upstream services."],
    ["AuthenticationError", 401, "Unauthorized due to failed authentication."],
    ["PermissionError", 403, "Forbidden access due to lack of permissions."],
    ["FileNotFoundError", 404, "Resource not found, typically for files."],
    ["UserNotFoundError", 404, "User not found during lookup."],
    ["ApiError", 400, "Generic API error, could vary."],
    [
      "BusinessLogicError",
      400,
      "Client error due to business logic violations.",
    ],
  ];

  for (let i = 0; i < errorMappings.length; i++) {
    let e = errorMappings;
    if (error.name == e[i][0]) {
      return res.status(e[i][1]).send({
        error_code: i,
        error: e[i][0],
        description: e[i][2],
      });
    }
  }
  next(error);
};
const errorhandle = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({
      error: " Maliormatted id",
    });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res.status(404).json({ error: "Sorry this Username Exists" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else if (error.name === "ReferenceError") {
    return res.status(401).json({ error: "ReferenceError" });
  }

  next();
};

module.exports = {
  unknownEndpoint,
  autoHandleError,
};
