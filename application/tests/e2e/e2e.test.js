/* globals describe beforeAll afterAll it expect */
import { connectDataBaseTest, disconnectTestDataBase } from '../../src/database'
import UserTest from './endpoint'
import { UserModel } from '../../src/modules/users'
import { encrypt } from '../../src/helpers/encryptPassword'

const usertest = new UserTest()

require('dotenv').config()

describe('users test', () => {
  beforeAll(async () => {
    await connectDataBaseTest()
    await UserModel.create({
      firstName: 'fernanda',
      lastName: 'samecima',
      email: 'samecima@yopmail.com',
      cpf: '231.758.980-84',
      password: encrypt('mamaco'),
      balance: 0,
      verified: true
    })
  })

  afterAll(async () => {
    await disconnectTestDataBase()
  })

  const defaultUser = {
    firstName: 'matheus',
    lastName: 'henrique',
    cpf: '47744346807',
    email: 'narval@yopmail.com',
    password: 'mamaco',
    balance: 0
  }

  it('should create a user', async () => {
    const newUser = defaultUser
    const { status } = await usertest.createUser(newUser)
    expect(status).toBe(200)
  })

  it('should verifie if  the email was provided', async () => {
    const { body } = await usertest.verifieUser({
      email: '',
      password: 'mamaco'
    })

    // expect(status).toBe(403)
    expect(body.message).toBe('email not provided.')
  })

  it('should verifie if  the password was provided', async () => {
    const { body } = await usertest.verifieUser({
      email: 'narval@yopmail.com',
      password: ''
    })

    // expect(status).toBe(403)
    expect(body.message).toBe('password not provided.')
  })

  it('should verifie if the user is not athenticated', async () => {
    const { status, body } = await usertest.verifieUser({
      email: 'narval@yopmail.com',
      password: 'mamaco'
    })

    expect(status).toBe(403)
    expect(body.message).toBe('user not verified')
  })

  it('should return 401', async () => {
    const { status, body } = await usertest.verifieUser({
      email: 'narva@yopmail.com',
      password: 'mamaco'
    })

    expect(status).toBe(401)
    expect(body.message).toBe('invalid credentials.')
  })

  it.only('should return 200', async () => {
    const { status } = await usertest.verifieUser({
      email: 'samecima@yopmail.com',
      password: 'mamaco'
    })

    expect(status).toBe(200)
  })
})
