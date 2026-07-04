const winston = require('winston');

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Format kustom untuk development (Console) yang mudah dibaca manusia
const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }), // Untuk menampilkan stack trace error
  printf(({ level, message, timestamp, stack }) => {
    if (stack) {
      return `[${timestamp}] ${level}: ${message}\n${stack}`;
    }
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Format JSON murni untuk production (Container/Kubernetes log aggregators)
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

// Inisialisasi Winston Logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  defaultMeta: { service: 'kumpulbareng-api' },
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
