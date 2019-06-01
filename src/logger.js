import winston, { format } from 'winston'
import config from '~/config'

const logger = winston.createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
  ],
})

export default logger
