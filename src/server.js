import 'babel-polyfill' // https://babeljs.io/docs/usage/polyfill/
import winston from 'winston'
import cluster from 'cluster'
import os from 'os'
import app from '~/app'

if (cluster.isMaster) {
  os.cpus().forEach((cpu) => {
    cluster.fork()
  })

  cluster.on('online', (worker) => {
    winston.info(`worker ${worker.process.pid} is up`)
  })

  cluster.on('exit', (worker) => {
    winston.error(`worker ${worker.process.pid} is down`)
    cluster.fork()
  })
} else {
  // start web server
  app.server.listen(process.env.PORT || 8080, () => {
    winston.info(`starting server: http://localhost:${app.server.address().port} (${cluster.worker.process.pid})`)
  })
}
