/* globals beforeAll afterAll describe it expect */

import { UserModel } from '../../../src/modules/users'
import UserTest from './testRoutes'
import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'
import { encrypt } from '../../../src/helpers/encryptPassword'
import { sign } from '../../../src/helpers/token'

require('dotenv').config()

const usertest = new UserTest()

let defaultUser
let expiredUser

describe('userAuthentication tests', () => {
  beforeAll(async () => {
    await connectTestDatabase()
    defaultUser = await UserModel.create({
      firstName: 'Lucas',
      lastName: 'Melo',
      email: 'lukjedi@yopmail.com',
      cpf: '50320469816',
      password: encrypt('invincible'),
      balance: 0
    })
    expiredUser = await UserModel.create({
      firstName: 'João',
      lastName: 'Bosquetti',
      cpf: '05567384890',
      email: 'jcbosquetti@yopmail.com',
      password: encrypt('robalo'),
      balance: 0
    })
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('Should throw error when not passing user e-mail', async () => {
    const { body } = await usertest.validateUser({
      email: 'matheus@email.com'
    })

    expect(body.message).toBe('invalid email')
  })

  it('Should throw error when not passing token', async () => {
    const { body } = await usertest.validateUser({
      email: 'jcbosquetti@yopmail.com'
    })

    expect(body.message).toBe('invalid token')
  })

  it('Should throw error when token is expired', async () => {
    const token = sign({ id: expiredUser._id, expiresIn: 0 })
    const { body } = await usertest.validateUser({
      email: 'jcbosquetti@yopmail.com',
      token
    })

    expect(body.message).toBe('invalid token')
  })

  it('Should validate user when email and token are correct', async () => {
    const token = sign({ id: defaultUser._id })
    const { body } = await usertest.validateUser({
      email: 'lukjedi@yopmail.com',
      token
    })
    expect(body).toBe('Email verified!')
  })
})
