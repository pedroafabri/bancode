// Requires user controller
import UserController from './controller'

// Defines base route
export const BASE_ROUTE = '/users'

// Defines route METHODS
export const initialize = (server) => {
  server.get(`${BASE_ROUTE}`, UserController.getAllUsers)

  server.get(`${BASE_ROUTE}/:id`, UserController.getUser)

  server.post(`${BASE_ROUTE}`, UserController.createUser)

  server.put(`${BASE_ROUTE}/:id`, UserController.updateUser)

  server.del(`${BASE_ROUTE}/:id`, UserController.deleteUser)
}

export default {
  BASE_ROUTE,
  initialize
}
