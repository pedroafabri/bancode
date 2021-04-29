/* globals describe it expect beforeAll afterAll */

import { jwtAuthenticator } from '../../src/middlewares/jwtAuthenticator'
import { connectTestDatabase, disconnectTestDatabase } from '../../src/database'
import { UserService } from '../../src/modules/users'

const req = {
  headers: {
    authorization: 'token'
  }
}

let idealUser

describe('jwtAuthenticator tests', () => {
  beforeAll(async () => {
    await connectTestDatabase()

    idealUser = await UserService.createUser({
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

  it('Must pass without errors', () => {
    req.headers.authorization = 'criar token'

    expect(async () => await jwtAuthenticator(req)).not.toThrow()
  })

  it('Must pass with \'Unverified user.\' error', async () => {
    const unverifiedUser = await UserService.createUser({
      firstName: 'usuario',
      lastName: 'teste',
      email: 'unverified@teste.com',
      cpf: '528.830.000-34',
      password: 'senhateste'
    })

    req.headers.authorization = 'criar token'

    const res = await jwtAuthenticator(req)
    expect(res.status).toBe(401)
    expect(async () => await jwtAuthenticator(req)).toThrow('Unverified user.')
  })

  it('Must pass with \'Inactive user.\' error', async () => {
    const inactiveUser = await UserService.createUser({
      firstName: 'usuario',
      lastName: 'teste',
      email: 'inactive@teste.com',
      cpf: '401.350.320-40',
      password: 'senhateste'
    })

    req.headers.authorization = 'criar token'

    await UserService.deleteUser(inactiveUser._id)

    const res = await jwtAuthenticator(req)
    expect(res.status).toBe(401)
    expect(async () => await jwtAuthenticator(req)).toThrow('Inactive user.')
  })

  it('Must pass with \'Invalid token.\' error using an expired token', async () => {
    const expiredToken = 'criar token expirado'
    req.headers.authorization = expiredToken

    const res = await jwtAuthenticator(req)
    expect(res.status).toBe(401)
    expect(async () => await jwtAuthenticator(req)).toThrow('Invalid token.')
  })

  it('Must pass with \'Invalid token.\' error using an invalid token', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.j8WqMThKG418s5xSX0xWsIGePYurlmOCylpyBrKmMq0'
    req.headers.authorization = invalidToken

    const res = await jwtAuthenticator(req)
    expect(res.status).toBe(401)
    expect(async () => await jwtAuthenticator(req)).toThrow('Invalid token.')
  })
})
