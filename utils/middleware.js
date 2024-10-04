const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown Endpoint",
  });
};
const errorhandle = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({
      error: " Maliormatted id",
    });
  }
  next(error);
};

module.exports = {
  unknownEndpoint,
  errorhandle,
};
