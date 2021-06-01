import request from 'supertest'
import Server from '../../../src/server'

export default class UserTest {
  constructor () {
    this._api = request(Server.create().server)
  }

  getAllUsers () {
    return this._api.get('/users')
  }

  getUserById (id) {
    return this._api.get(`/users/${id}`)
  }

  createUser (user) {
    return this._api.post('/users').send(user)
  }

  validateUser (email, update) {
    return this._api.post('/users/validate').send(email, update)
  }

  updateUser (id, update) {
    return this._api.put(`/users/${id}`).send(update)
  }

  deleteUser (id) {
    return this._api.del(`/users/${id}`)
  }
}
