const app = require("./app.js");
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`express --- server runing ${config.PORT}`);
});
