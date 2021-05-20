import request from 'supertest'
import Server from '../../../src/server'
import { UserRoutes } from '../../../src/modules/users'

const BASE_ROUTE = UserRoutes.BASE_ROUTE
const PASSWORD_RECOVERY_ROUTE = UserRoutes.PASSWORD_RECOVERY_ROUTE

export default class UserTest {
  constructor () {
    this._api = request(Server.create().server)
  }

  getAllUsers () {
    return this._api.get(`${BASE_ROUTE}`)
  }

  getUserById (id) {
    return this._api.get(`${BASE_ROUTE}/${id}`)
  }

  createUser (user) {
    return this._api.post(`${BASE_ROUTE}`).send(user)
  }

  updateUser (id, update) {
    return this._api.put(`${BASE_ROUTE}/${id}`).send(update)
  }

  deleteUser (id) {
    return this._api.del(`${BASE_ROUTE}/${id}`)
  }

  recoveryPassword (email) {
    return this._api.post(`${PASSWORD_RECOVERY_ROUTE}`).send(email)
  }

  changePassword (token, newPassword) {
    return this._api.post(`${PASSWORD_RECOVERY_ROUTE}/${token}`).send(newPassword)
  }
}
