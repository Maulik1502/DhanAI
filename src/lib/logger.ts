import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = process.env.LOG_DIR || 'logs';
const isProduction = process.env.NODE_ENV === 'production';

fs.mkdirSync(logDir, { recursive: true });

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'dhanai' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const details = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} ${level}: ${message}${details}`;
        })
      ),
    }),
    ...(isProduction
      ? [
          new winston.transports.File({ filename: path.join(logDir, 'combined.log'), level: 'info' }),
          new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        ]
      : []),
  ],
});

export default logger;