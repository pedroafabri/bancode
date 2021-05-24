/* globals describe beforeAll afterAll it expect */

import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'
import UserTest from './testRoutes'
import { UserModel, UserService } from '../../../src/modules/users'
import { sign } from '../../../src/helpers/token'
import { encrypt } from '../../../src/helpers/encryptPassword'

require('dotenv').config()

const userTest = new UserTest()

let idealUser, token

describe('User recoverPassword tests', () => {
  beforeAll(async () => {
    await connectTestDatabase()

    idealUser = await UserModel.create({
      firstName: 'usuario',
      lastName: 'teste',
      email: 'idealuser@yopmail.com',
      cpf: '531.214.290-51',
      password: encrypt('senhateste'),
      verified: true
    })
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('Must pass providing a valid email', async () => {
    const { status, body } = await userTest.recoverPassword({ email: idealUser.email })

    expect(status).toBe(200)
    expect(body).toBe('Email sent!')
  })

  it('Must pass with "Invalid email." error do not providing a email', async () => {
    const { status, body } = await userTest.recoverPassword({})

    expect(status).toBe(400)
    expect(body.code).toBe('BadRequest')
    expect(body.message).toBe('Invalid email.')
  })

  it('Must pass with "Invalid email." error providing a empty string', async () => {
    const { status, body } = await userTest.recoverPassword({ email: '' })

    expect(status).toBe(400)
    expect(body.code).toBe('BadRequest')
    expect(body.message).toBe('Invalid email.')
  })

  it('Must pass with "Invalid email" error providing a invalid email', async () => {
    const { status, body } = await userTest.recoverPassword({ email: 'notEmail' })

    expect(status).toBe(400)
    expect(body.code).toBe('BadRequest')
    expect(body.message).toBe('Invalid email.')
  })

  it('Must pass with "Email not registered." error', async () => {
    const { status, body } = await userTest.recoverPassword({ email: 'invalid@teste.com' })

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
      password: encrypt('senhateste'),
      verified: true
    })

    token = sign({ id: idealUser._id })
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('Must pass providing a valid password', async () => {
    const { status, body } = await userTest.changePassword(token, { password: 'validPassword' })

    const updatedUser = await UserService.getUserById(idealUser._id)

    expect(status).toBe(200)
    expect(body).toBe('Password changed!')
    expect(updatedUser.password).toBe(encrypt('validPassword'))
  })

  it('Must pass with "Invalid password." error providing a empty string', async () => {
    const { status, body } = await userTest.changePassword(token, { password: '' })

    const updatedUser = await UserService.getUserById(idealUser._id)

    expect(status).toBe(400)
    expect(body.code).toBe('BadRequest')
    expect(body.message).toBe('Invalid password.')
    expect(updatedUser.password).toBe(encrypt('validPassword'))
  })

  it('Must pass with "Invalid password." error do not providing a password', async () => {
    const { status, body } = await userTest.changePassword(token, {})

    const updatedUser = await UserService.getUserById(idealUser._id)

    expect(status).toBe(400)
    expect(body.code).toBe('BadRequest')
    expect(body.message).toBe('Invalid password.')
    expect(updatedUser.password).toBe(encrypt('validPassword'))
  })

  it('Must pass with "Invalid token." error', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsIn5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2Mj5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQsw5c'
    const { status, body } = await userTest.changePassword(invalidToken, { password: 'validPass2' })

    const updatedUser = await UserService.getUserById(idealUser._id)

    expect(status).toBe(500)
    expect(body.code).toBe('Internal')
    expect(body.message).toMatch('invalid token')
    expect(updatedUser.password).toBe(encrypt('validPassword'))
  })
})
