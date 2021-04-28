import restify from 'restify'
import Routes from './routes'

const PORT = process.env.PORT || 3001

const create = () => {
  const server = restify.createServer()
  server.use(restify.plugins.jsonBodyParser())

  // Initialize every route
  for (const route of Routes) {
    route.initialize(server)
  }

  return server
}

const start = () => {
  const server = create()

  // Start server
  server.listen(PORT, () => console.log(`Server listening on port ${PORT}.`))
}

export default {
  PORT,
  create,
  start
}
