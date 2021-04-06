import mongoose from 'mongoose'

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

export default {
  connect
}
