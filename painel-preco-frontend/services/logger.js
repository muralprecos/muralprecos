import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const LAST_LOG = {
  timestamp: null,
  message: null,
  label: null
};

const getLogger = (fileName = 'painel-preco-front-server') => {

  const isSSR = typeof window === 'undefined';

  const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`);

  const ignoreEquals = format((info) => {
    info.message = typeof info.message === 'object' ? JSON.stringify(info.message) : info.message;
    if (info.timestamp == LAST_LOG.timestamp && info.message == LAST_LOG.message && info.label == LAST_LOG.label) {
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
      ignoreEquals(),
      format.label({ label: __filename }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
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
    //const path = process.env.NODE_ENV === 'development' ? 'logs' : '/appserverlogs';
    const path = process.env.NODE_ENV === 'production' ? '/appserverlogs' : 'logs';
    logger.add(new transports.DailyRotateFile({
      filename: `${path}/${fileName}-%DATE%.log`,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      handleExceptions: true, /* set this option to true */
      handleRejections: true, /* set this option to true */
      format: format.combine(
        // format.json(),
        logFormat
      )
    }));
  }

  return logger;
};

export default getLogger();