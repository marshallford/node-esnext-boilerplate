import 'babel-polyfill' // https://babeljs.io/docs/usage/polyfill/
import cluster from 'cluster'
import os from 'os'
import app from '~/app'
import logger from '~/logger'
import config from '~/config'

const startServer = (pid = 'N/A') => {
  app.server.listen(config.port, () => {
    logger.info(`starting server: http://localhost:${app.server.address().port} (${pid})`)
  })
}

if (cluster.isMaster) {
  if (config.disableClusterMode) {
    startServer()
  } else if (process.env.NODE_ENV === 'development') {
    cluster.fork()
  } else {
    os.cpus().forEach((cpu) => {
      cluster.fork()
    })
  }

  cluster.on('online', (worker) => {
    logger.info(`worker ${worker.process.pid} is up`)
  })

  cluster.on('exit', (worker) => {
    logger.error(`worker ${worker.process.pid} is down`)
    cluster.fork()
  })
} else {
  startServer(cluster.worker.process.pid)
}
