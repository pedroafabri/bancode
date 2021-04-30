import restify from 'restify'
import Routes from './routes'

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
  const PORT = process.env.PORT || 3000
  const server = create()

  // Start server
  server.listen(PORT, () => console.log(`Server listening on port ${PORT}.`))
}

export default {
  create,
  start
}