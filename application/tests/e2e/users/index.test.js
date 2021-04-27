/* globals describe beforeAll afterAll */

import { connectTestDatabase, disconnectTestDatabase } from '../../../src/database'

describe('users test', () => {
  beforeAll(async () => {
    await connectTestDatabase()
  })

  afterAll(async () => {
    await disconnectTestDatabase()
  })
})
