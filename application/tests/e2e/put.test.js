/* globals describe beforeAll afterAll it expect */
import { connectDataBaseTest, disconnectTestDataBase } from '../../src/database'
import UserTest from './endpoint'
import { UserModel } from '../../src/modules/users'
import { encrypt } from '../../src/helpers/encryptPassword'
import CPF from 'cpf-check'

const usertest = new UserTest()

require('dotenv').config()

describe('put route tests', () => {
  beforeAll(async () => {
    await connectDataBaseTest()
    await UserModel.create({
      firstName: 'matheus',
      lastName: 'henrique',
      cpf: CPF.format('47744346807'),
      email: 'narval@yopmail.com',
      password: encrypt('mamaco')
    })
  })

  afterAll(async () => {
    await disconnectTestDataBase()
  })
  it('shoul give an error because the first name was not provided', async () => {
    const { body } = await usertest.createUser({
      firstName: '',
      lastName: 'henrique',
      cpf: '99855470800',
      email: 'narva@yopmail.com',
      password: 'mamaco'
    })
    expect(body.message).toBe('ValidationError: firstName: Path `firstName` is required.')
  })

  it('shoul give an error because the last name was not provided', async () => {
    const { body } = await usertest.createUser({
      firstName: 'matheus',
      lastName: '',
      cpf: '99855470800',
      email: 'narva@yopmail.com',
      password: 'mamaco'
    })
    expect(body.message).toBe('ValidationError: lastName: Path `lastName` is required.')
  })

  it('shoul give an error because the cpf is invalid', async () => {
    const { body } = await usertest.createUser({
      firstName: 'matheus',
      lastName: 'henrique',
      cpf: '',
      email: 'narva@yopmail.com',
      password: 'mamaco'
    })
    expect(body.message).toBe('Invalid CPF.')
  })

  it('shoul give an error because the email is invalid', async () => {
    const { body } = await usertest.createUser({
      firstName: 'matheus',
      lastName: 'henrique',
      cpf: '99855470800',
      email: 'jdnsksakasn',
      password: 'mamaco'
    })
    expect(body.message).toBe('Invalid email.')
  })

  it('shoul give an error because the password is invalid', async () => {
    const { body } = await usertest.createUser({
      firstName: 'matheus',
      lastName: 'henrique',
      cpf: '99855470800',
      email: 'narva@yopmail.com',
      password: ''
    })
    expect(body.message).toBe('Invalid password.')
  })

  it('shoul give an error because the cpf is already in use', async () => {
    const { body } = await usertest.createUser({
      firstName: 'matheus',
      lastName: 'henrique',
      cpf: '47744346807',
      email: 'narva@yopmail.com',
      password: 'mamaco'
    })
    expect(body.message).toBe('MongoError: E11000 duplicate key error dup key: { : "477.443.468-07" }')
  })
})
