/* globals jest describe it expect beforeAll beforeEach afterAll */

import { jwtAuthenticator } from '../../../src/middlewares/jwtAuthenticator'
import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'
import { UserService, UserModel } from '../../../src/modules/users'
import { sign, verify } from '../../../src/helpers/token'
import { UnauthorizedError } from 'restify-errors'

require('dotenv').config()

let req

const res = {}

const next = jest.fn(error => error)

let idealUser

describe('jwtAuthenticator tests', () => {
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

  beforeEach(() => {
    req = {
      headers: {
      }
    }
  })

  it('Must pass without errors', async () => {
    const testToken = sign({ id: idealUser._id })
    req.headers.authorization = testToken

    await jwtAuthenticator(req, res, next)

    expect(req.decodedToken).toMatchObject(verify(testToken))
    expect(next.mock.calls.length).toBe(1)
  })

  it('Must pass with "Unverified user." error', async () => {
    const unverifiedUser = await UserService.createUser({
      firstName: 'usuario',
      lastName: 'teste',
      email: 'unverified@teste.com',
      cpf: '528.830.000-34',
      password: 'senhateste'
    })

    req.headers.authorization = sign({ id: unverifiedUser._id })

    const result = await jwtAuthenticator(req, res, next)

    expect(result.message).toBe('Unverified user.')
    expect(result).toBeInstanceOf(UnauthorizedError)
  })

  it('Must pass with "Inactive user." error', async () => {
    const inactiveUser = await UserService.createUser({
      firstName: 'usuario',
      lastName: 'teste',
      email: 'inactive@teste.com',
      cpf: '401.350.320-40',
      password: 'senhateste'
    })

    req.headers.authorization = sign({ id: inactiveUser._id })

    await UserService.deleteUser(inactiveUser._id)

    const result = await jwtAuthenticator(req, res, next)

    expect(result.message).toBe('Inactive user.')
    expect(result).toBeInstanceOf(UnauthorizedError)
  })

  it('Must pass with "Invalid token." error do not providing a token', async () => {
    const result = await jwtAuthenticator(req, res, next)

    expect(result.message).toBe('Invalid token.')
    expect(result).toBeInstanceOf(UnauthorizedError)
  })

  it('Must pass with "Invalid token." error using an expired token', async () => {
    req.headers.authorization = sign({ id: idealUser._id, expiresIn: 0 })

    const result = await jwtAuthenticator(req, res, next)

    expect(result.message).toBe('Invalid token.')
    expect(result).toBeInstanceOf(UnauthorizedError)
  })

  it('Must pass with "Invalid token." error using an invalid token', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.j8WqMThKG418s5xSX0xWsIGePYurlmOCylpyBrKmMq0'
    req.headers.authorization = invalidToken

    const result = await jwtAuthenticator(req, res, next)

    expect(result.message).toBe('Invalid token.')
    expect(result).toBeInstanceOf(UnauthorizedError)
  })
})
