// Requires user controller
import UserController from './controller'

import { emptyBodyValidator } from '../../middlewares/emptyBodyValidator'

// Defines base route
export const BASE_ROUTE = '/users'
export const PASSWORD_RECOVERY_ROUTE = `${BASE_ROUTE}/password-recovery`

// Defines route METHODS
export const initialize = (server) => {
  server.get(`${BASE_ROUTE}`, UserController.getAllUsers)

  server.get(`${BASE_ROUTE}/:id`, UserController.getUser)

  server.post(`${BASE_ROUTE}`, emptyBodyValidator, UserController.createUser)

  server.post(`${BASE_ROUTE}/authentication`, emptyBodyValidator, UserController.authenticateUser)

  server.put(`${BASE_ROUTE}/:id`, emptyBodyValidator, UserController.updateUser)

  server.del(`${BASE_ROUTE}/:id`, UserController.deleteUser)

  server.post(`${PASSWORD_RECOVERY_ROUTE}`, UserController.recoverPassword)

  server.post(`${PASSWORD_RECOVERY_ROUTE}/change-password`, UserController.changePassword)
}

export default {
  BASE_ROUTE,
  PASSWORD_RECOVERY_ROUTE,
  initialize
}
