const config = require('./environment');

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = logLevels[config.logs.level] || logLevels.info;

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

const logger = {
  error: (message, meta) => {
    if (currentLevel >= logLevels.error) {
      console.error(formatMessage('error', message, meta));
    }
  },
  warn: (message, meta) => {
    if (currentLevel >= logLevels.warn) {
      console.warn(formatMessage('warn', message, meta));
    }
  },
  info: (message, meta) => {
    if (currentLevel >= logLevels.info) {
      console.log(formatMessage('info', message, meta));
    }
  },
  debug: (message, meta) => {
    if (currentLevel >= logLevels.debug) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};

module.exports = logger;