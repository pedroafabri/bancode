/* globals describe beforeAll afterAll it expect */
import { connectDataBaseTest, disconnectTestDataBase } from '../../src/database'
import UserTest from './endpoint'

const usertest = new UserTest()

describe('users test', () => {
  beforeAll(async () => {
    await connectDataBaseTest()
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
    const { body } = await usertest.verifie({
      email: '',
      password: 'mamaco'
    })

    // expect(status).toBe(403)
    expect(body.message).toBe('email not provided.')
  })

  it('should verifie if  the password was provided', async () => {
    const { body } = await usertest.verifie({
      email: 'narval@yopmail.com',
      password: ''
    })

    // expect(status).toBe(403)
    expect(body.message).toBe('password not provided.')
  })

  it('should verifie if the user is not athenticated', async () => {
    const { status, body } = await usertest.verifie({
      email: 'narval@yopmail.com',
      password: 'mamaco'
    })

    expect(status).toBe(403)
    expect(body.message).toBe('user not verified')
  })

  it('should return 401', async () => {
    const { status, body } = await usertest.verifie({
      email: 'narva@yopmail.com',
      password: 'mamaco'
    })

    expect(status).toBe(401)
    expect(body.message).toBe('invalid credentials.')
  })
})
