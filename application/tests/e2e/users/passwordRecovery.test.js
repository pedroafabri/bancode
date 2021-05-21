/* globals describe beforeAll afterAll it expect */

import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'
import UserTest from './testRoutes'
import { UserModel } from '../../../src/modules/users'

require('dotenv').config()

const userTest = new UserTest()

let idealUser

describe('User recoveryPassword tests', () => {
  beforeAll(async () => {
    await connectTestDatabase()

    idealUser = await UserModel.create({
      firstName: 'usuario',
      lastName: 'teste',
      email: 'idealuser@yopmail.com',
      cpf: '531.214.290-51',
      password: 'senhateste',
      verified: true
    })
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('Must pass providing a valid email', async () => {
    const { status, body } = await userTest.recoveryPassword({ email: idealUser.email })
    expect(status).toBe(200)
    expect(body).toBe('Email sent!')
  })

  it('Must pass with "Email field is empty." error', async () => {
    const { status, body } = await userTest.recoveryPassword({})
    expect(status).toBe(400)
    expect(body.code).toBe('BadRequest')
    expect(body.message).toBe('Email field is empty.')
  })

  it('Must pass with "Email not registered." error', async () => {
    const { status, body } = await userTest.recoveryPassword({ email: 'invalid@teste.com' })
    expect(status).toBe(404)
    expect(body.code).toBe('NotFound')
    expect(body.message).toBe('Email not registered.')
  })
})

describe('User changePassword tests', () => {
  beforeAll(async () => {
    await connectTestDatabase()

    idealUser = await UserModel.create({
      firstName: 'usuario',
      lastName: 'teste',
      email: 'ideal@teste.com',
      cpf: '531.214.290-51',
      password: 'senhateste',
      verified: true
    })
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('Should pass', () => {})
})
