import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const LAST_LOG = {
  date: null,
  message: null,
  stack: null
};

const getLogger = (fileName = 'painel-preco-front-server') => {

  const isSSR = typeof window === 'undefined';
  
  const consoleTransport = new transports.Console({
    level: process.env.LOG_LEVEL,
    // json: true,
    // colorize: true
  });

  const ignoreEquals = format((info) => {
    if (info.timestamp == LAST_LOG.date && info.message == LAST_LOG.message && info.stack == LAST_LOG.stack) {
      return false;
    }
    LAST_LOG.date = info.timestamp;
    LAST_LOG.message =  info.message;
    LAST_LOG.stack = info.stack;
    return info;
  });

  const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      ignoreEquals(),
      format.printf(
        (info) => {
          const { level, label = process.env.NODE_ENV, timestamp } = info;
          const res = level === 'error' ? `\n  Message: ${info.message};\n  Cause: ${info.cause}\n  Stack: ${info.stack}` : info.message;
          return `${timestamp} [${label}] ${level}: ${res}.`
        }
          
      )
    ),
    transports: [consoleTransport]
  });

  if (isSSR) {
    //const path = process.env.NODE_ENV === 'development' ? 'logs' : '/appserverlogs';
    const path = process.env.NODE_ENV === 'development' ? 'logs' : '/Users/matheuscampanha/Pessoal/Trabalho/Projetos/Licitacoes/workspace/appserverlogs';
    // 
    logger.add(new transports.DailyRotateFile({
      filename: `${path}/${fileName}-%DATE%.log`,
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