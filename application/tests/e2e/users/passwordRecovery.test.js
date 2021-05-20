/* globals describe beforeAll afterAll it expect */

import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'
import UserTest from './testRoutes'
import { UserModel } from '../../../src/modules/users'

const userTest = new UserTest()

let idealUser

describe('User recoveryPassword tests', () => {
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

  it('Must pass providing a valid email', async () => {
    const body = { email: idealUser.email }

    const response = await userTest.recoveryPassword(body)
    expect(response.status).toBe(200)
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
