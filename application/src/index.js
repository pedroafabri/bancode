import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Server from './server'
import Database from './database'

const env = process.env.NODE_ENV

// If not production or staging, configure .env
if (env !== 'production' && env !== 'staging') {
  require('dotenv').config()
}

const run = async () => {
  try {
    await Database.connect()
    Server.start()
  } catch (error) {
    console.error('Server could not start due to error:')
    console.error(error)
  }
}

run()
