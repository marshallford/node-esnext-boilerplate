import 'babel-polyfill' // https://babeljs.io/docs/usage/polyfill/
import http from 'http' // HTTP Server
import express from 'express' // HTTP improvements
import bodyParser from 'body-parser' // Parse JSON
import cors from 'cors' // Cross-origin resource sharing

// define web server
const app = express()
app.server = http.createServer(app)
app.disable('x-powered-by') // https://github.com/helmetjs/hide-powered-by
app.use(bodyParser.json())
app.use(cors()) // https://github.com/expressjs/cors#simple-usage-enable-all-cors-requests
app.options('*', cors()) // https://github.com/expressjs/cors#enabling-cors-pre-flight
// define routes here, before catch-all functions, after cors setup
// app.use('/api/v1', api())
app.use((req, res) => {
  res.status(404).json({ error: `cannot ${req.method} ${req.path}` })
})
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'catch-all server error, check the logs' })
})

// start web server
app.server.listen(process.env.PORT || 8080)
console.log(`Starting server: http://localhost:${app.server.address().port}`)
