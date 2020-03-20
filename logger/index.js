const WINSTON = require('winston');

let consoleTransport = new WINSTON.transports.Console({
  format: WINSTON.format.combine(
    WINSTON.format.colorize({ all: true }),
    WINSTON.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    WINSTON.format.printf(info => {
      const { timestamp, level, message, ...args } = info;
      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `[${ts}] [${level}]: ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
      }`;
    })
  ),
  handleExceptions: true,
  json: false,
  timestamp: true
});

let logger = WINSTON.createLogger({
  format: WINSTON.format.json(),
  transports: [consoleTransport]
});

module.exports = logger;
