const { createLogger, transports, format } = require('winston');
require('winston-daily-rotate-file');
// import { createLogger, format, transports } from 'winston';
// import 'winston-daily-rotate-file';

const LAST_LOG = {
  timestamp: null,
  message: null,
  label: null
};

const getLogger = (fileName = 'painel-preco-front-server') => {

  const isSSR = typeof window === 'undefined';

  const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`);

  const ignoreEquals = format((info) => {
    if (info.timestamp == LAST_LOG.timestamp && JSON.stringify(info.message) == JSON.stringify(LAST_LOG.message) && info.label == LAST_LOG.label) {
      return false;
    }
    LAST_LOG.timestamp = info.timestamp;
    LAST_LOG.message =  info.message;
    LAST_LOG.label = info.label;
    return info;
  });

  const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
      format.label({ label: __filename }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      // Format the metadata object
      format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          logFormat
        )
      })
    ],
    exitOnError: false
  })

  if (isSSR) {
    console.log('isSSR')
    //const path = process.env.NODE_ENV === 'development' ? 'logs' : '/appserverlogs';
    const path = process.env.NODE_ENV === 'production' ? '/appserverlogs' : 'logs';
    // 
    logger.add(new transports.DailyRotateFile({
      filename: `${path}/${fileName}-%DATE%.log`,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      handleExceptions: true, /* set this option to true */
      handleRejections: true, /* set this option to true */
      format: format.combine(
        // Render in one line in your log file.
        // If you use prettyPrint() here it will be really
        // difficult to exploit your logs files afterwards.
        format.json(),
        ignoreEquals()
        // format.printf(
        //   (info) => {
        //     const { level, label = process.env.NODE_ENV, timestamp } = info;
        //     const res = level === 'error' ? `\n  Message: ${info.message};\n  Cause: ${info.cause}\n  Stack: ${info.stack}` : info.message;
        //     return `${timestamp} [${label}] ${level}: ${res}.`
        //   }
            
        // )
      )
    }));
  }

  return logger;
};

module.exports = getLogger;
// export default getLogger();