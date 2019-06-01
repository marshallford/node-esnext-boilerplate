import 'babel-polyfill' // https://babeljs.io/docs/usage/polyfill/
import cluster from 'cluster'
import app from '~/app'
import logger from '~/logger'
import config from '~/config'

const startApp = () => {
  app.server.listen(config.port, () => {
    logger.info(`starting server: http://localhost:${app.server.address().port}`)
  })
}

if (cluster.isMaster) {
  cluster.fork()

  cluster.on('online', (worker) => {
    logger.info(`cluster worker ${worker.process.pid} is up`)
  })

  cluster.on('exit', (worker) => {
    logger.error(`cluster worker ${worker.process.pid} is down`)
    cluster.fork()
  })
} else {
  startApp()
}
