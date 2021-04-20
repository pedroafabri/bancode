import restify from 'restify'
import Routes from './routes'

const PORT = process.env.PORT || 3000

const start = () => {
  const server = restify.createServer()
  server.use(restify.plugins.jsonBodyParser())

  // Initialize every route
  for (const route of Routes) {
    route.initialize(server)
  }

  // Start server
  server.listen(PORT, () => console.log(`Server listening on port ${PORT}.`))
}

export default {
  PORT,
  start
}
