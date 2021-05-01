import Server from '../../src/server'
import request from 'supertest'

export default class UserTest {
  constructor () {
    this._app = request(Server.create().server)
    this._endpoint = '/users'
  }

  createUser (user) {
    return this._app
      .post(`${this._endpoint}`)
      .send(user)
  }

  getAllUsers () {
    return this._api
      .get(`${this._endpoint}`)
  }

  getUserById (id) {
    return this._api
      .get(`${this._endpoint}/${id}`)
  }

  updateUser (id, update) {
    return this._api
      .put(`${this._endpoint}/${id}`)
      .send(update)
  }

  deleteUser (id) {
    return this._api
      .del(`${this._endpoint}/${id}`)
  }

  verifieUser (body) {
    return this._app
      .post(`${this._endpoint}/authentication`)
      .send(body)
  }
}
