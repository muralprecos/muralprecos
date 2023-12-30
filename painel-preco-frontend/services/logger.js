import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const getLogger = (fileName = 'painel-preco-front-server') => {

  const isSSR = typeof window === 'undefined';
  
  const consoleTransport = new transports.Console({
    level: process.env.LOG_LEVEL,
    json: true,
    colorize: true
  });

  const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(
        (info) => {
          const { level, label = process.env.NODE_ENV, timestamp } = info;
          const res = `\n  Message: ${info.message};\n  Cause: ${info.cause}\n  Stack: ${info.stack}`
          return `${timestamp} [${label}] ${level}: ${res}.`
        }
          
      )
    ),
    transports: [consoleTransport]
  });

  if (isSSR) {
    logger.add(new transports.DailyRotateFile({
      filename: `logs/${fileName}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      handleExceptions: true, /* set this option to true */
      handleRejections: true, /* set this option to true */
    }));
  }

  return logger;
};

export default getLogger();