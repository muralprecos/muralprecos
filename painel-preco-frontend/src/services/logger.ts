const isServer = typeof window === "undefined";

const logger = isServer
  ? require("./logger.server").default
  : require("./logger.client").default;

export default logger;
