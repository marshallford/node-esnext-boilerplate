import 'babel-polyfill' // https://babeljs.io/docs/usage/polyfill/
import http from 'http' // HTTP Server
import express, { Router } from 'express' // HTTP improvements
import bodyParser from 'body-parser' // Parse JSON
import cors from 'cors' // Cross-origin resource sharing
import winston from 'winston' // Async logger

// example route
const exampleRoute = () => {
  let example = Router()
  example.get('/', (req, res) => {
    return res.json({ message: 'Hello World' })
  })
  return example
}

// define web server
const app = express()
app.server = http.createServer(app)
app.disable('x-powered-by') // https://github.com/helmetjs/hide-powered-by
app.use(bodyParser.json())
app.use(cors()) // https://github.com/expressjs/cors#simple-usage-enable-all-cors-requests
app.options('*', cors()) // https://github.com/expressjs/cors#enabling-cors-pre-flight

// logging middleware
if (process.env.LOG === 'true') {
  app.use((req, res, next) => {
    winston.info(`${new Date().toISOString()} ${req.method} ${req.path}`)
    next()
  })
}

// define routes here, before catch-all functions, after cors setup and logging middlware
app.use('/api/v1', exampleRoute())

// 404
app.use((req, res) => {
  res.status(404).json({ error: `cannot ${req.method} ${req.path}` })
})
// 500
app.use((err, req, res, next) => {
  winston.error(err.stack)
  res.status(500).json({ error: 'catch-all server error, check the logs' })
})

// start web server
app.server.listen(process.env.PORT || 8080)
winston.info(`Starting server: http://localhost:${app.server.address().port}`)
