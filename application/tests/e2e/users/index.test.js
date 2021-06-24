/* globals describe beforeAll afterAll it expect */

import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'
import UserTest from './testRoutes'

require('dotenv').config()

const userTest = new UserTest()

describe('users test', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })

  it('Should get all users', async () => {
    const response = await userTest.getAllUsers()
    expect(response.status).toBe(200)
  })
})
