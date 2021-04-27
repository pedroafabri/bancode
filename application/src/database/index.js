import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const connect = (url = process.env.DB_URL) => new Promise((resolve, reject) => {
  console.log('Connecting to database...')

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const db = mongoose.connection

  db.on('open', () => {
    console.log('Database connected.')
    resolve()
  })

  db.on('error', (err) => {
    reject(err)
  })
})

let mongoServer

export const connectTestDatabase = async () => {
  mongoServer = new MongoMemoryServer()

  const uri = await mongoServer.getUri()
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}

export const disconnectTestDatabase = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}

export default {
  connect
}
