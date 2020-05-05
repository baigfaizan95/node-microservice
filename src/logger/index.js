import WINSTON from 'winston';

const consoleTransport = new WINSTON.transports.Console({
  format: WINSTON.format.combine(
    WINSTON.format.colorize({ all: true }),
    WINSTON.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    WINSTON.format.printf((info) => {
      const { timestamp, level, message, ...args } = info;
      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `[${ts}] [${level}]: ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
      }`;
    })
  ),
  handleExceptions: true,
  json: false,
  timestamp: true,
});

const logger = WINSTON.createLogger({
  format: WINSTON.format.json(),
  transports: [consoleTransport],
});

export default logger;
