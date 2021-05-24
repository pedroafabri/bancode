// Requires user controller
import UserController from './controller'

import { emptyBodyValidator } from '../../middlewares/emptyBodyValidator'

// Defines base route
export const BASE_ROUTE = '/users'

// Defines route METHODS
export const initialize = (server) => {
  server.get(`${BASE_ROUTE}`, UserController.getAllUsers)

  server.get(`${BASE_ROUTE}/:id`, UserController.getUser)

  server.post(`${BASE_ROUTE}`, emptyBodyValidator, UserController.createUser)

  server.post(`${BASE_ROUTE}/validate`, UserController.validateUser)

  server.post(`${BASE_ROUTE}/authentication`, emptyBodyValidator, UserController.authenticateUser)

  server.put(`${BASE_ROUTE}/:id`, emptyBodyValidator, UserController.updateUser)

  server.del(`${BASE_ROUTE}/:id`, UserController.deleteUser)
}

export default {
  BASE_ROUTE,
  initialize
}
