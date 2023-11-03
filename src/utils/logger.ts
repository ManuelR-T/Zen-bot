import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize({ level: true }),
    format.errors({ stack: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      (info) =>
        `[${info.level}] ${info.message}` +
        (info.stack ? `\n${info.stack}` : ''),
    ),
  ),
  transports: [new transports.Console()],
})
