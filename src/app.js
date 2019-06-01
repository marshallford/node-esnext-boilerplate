import http, { STATUS_CODES as HttpStatuses } from 'http' // HTTP Server
import express, { Router } from 'express' // HTTP improvements
import bodyParser from 'body-parser' // Parse JSON
import cors from 'cors' // Cross-origin resource sharing
import logger from '~/logger'

// setup express
const app = express()
app.server = http.createServer(app)
app.disable('x-powered-by') // https://github.com/helmetjs/hide-powered-by
app.use(bodyParser.json())
app.use(cors()) // https://github.com/expressjs/cors#simple-usage-enable-all-cors-requests
app.options('*', cors()) // https://github.com/expressjs/cors#enabling-cors-pre-flight

// logging middleware
app.use((req, res, next) => {
  logger.verbose(`${req.method} ${req.path}`)
  next()
})

// bodyParser error middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
    res.status(400).json({
      error: HttpStatuses[400],
      message: 'invalid json',
    })
  } else {
    next(err)
  }
})

// NOTE: order is important, place routes before catch-all middleware

// example routes
const usersRoute = () => {
  const r = Router()
  r.get('/', (req, res) => {
    return res.json([{
      firstName: 'Marshall',
      lastName: 'Ford',
    }])
  })
  return r
}

const echoRoute = () => {
  const r = Router()
  r.post('/', (req, res) => {
    return res.json(req.body)
  })
  return r
}

const apiV1Route = () => {
  const r = Router()
  r.use('/users', usersRoute())
  r.use('/echo', echoRoute())
  return r
}

app.use('/api/v1', apiV1Route())

// HTTP 404 middleware
app.use((req, res) => {
  res.status(404).json({
    error: HttpStatuses[404],
    message: `${req.method} ${req.path}` })
})

// HTTP 500 middleware
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(500).json({
    error: HttpStatuses[500],
    message: 'check the logs!',
  })
})

export default app
