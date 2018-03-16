const config = {
  base: {
    port: process.env.APP_PORT || 8080,
  },
}

export default Object.assign(config.base, config[process.env.APP_ENV ? process.env.APP_ENV : 'development'])
