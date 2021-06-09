// Requires user controller
import UserController from './controller'

import { emptyBodyValidator, checkBodyInformation } from '../../middlewares/bodyValidator'

// Defines base route
export const BASE_ROUTE = '/users'

const checkUserBody = checkBodyInformation(['firstName', 'lastName', 'email', 'cpf', 'password'])

// Defines route METHODS
export const initialize = (server) => {
  server.get(`${BASE_ROUTE}`, UserController.getAllUsers)

  server.get(`${BASE_ROUTE}/:id`, UserController.getUser)

  server.post(`${BASE_ROUTE}`, emptyBodyValidator, checkUserBody, UserController.createUser)

  server.post(`${BASE_ROUTE}/validate`, UserController.validateUser)

  server.post(`${BASE_ROUTE}/authentication`, emptyBodyValidator, UserController.authenticateUser)

  server.put(`${BASE_ROUTE}/:id`, emptyBodyValidator, checkUserBody, UserController.updateUser)

  server.del(`${BASE_ROUTE}/:id`, UserController.deleteUser)
}

export default {
  BASE_ROUTE,
  initialize
}
