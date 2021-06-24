/* globals describe it expect */

import { sendWelcomeEmail, sendPasswordRecoveryEmail } from '../../src/helpers/emailSender'

const user = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testemail@mail.com'
}

describe('sendWelcomeEmail tests', () => {
  it('Must send the email without errors', async () => {
    await expect(sendWelcomeEmail(user, 'someToken')).resolves.not.toThrow()
  })

  it('Must throw error not providing parameters', async () => {
    await expect(sendWelcomeEmail())
      .rejects.toThrow('Invalid parameters provided.')
  })

  it('Must throw error not providing a token', async () => {
    await expect(sendWelcomeEmail(user))
      .rejects.toThrow('Invalid parameters provided.')
  })

  it('Must throw error not providing a user', async () => {
    await expect(sendWelcomeEmail('someToken'))
      .rejects.toThrow('Invalid parameters provided.')
  })

  it('Must throw error providing invalid user info', async () => {
    await expect(sendWelcomeEmail({ firstName: 'name' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendWelcomeEmail({ lastName: 'name' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendWelcomeEmail({ email: 'email@mail.com' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendWelcomeEmail({ firstName: 'name', lastName: 'name' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendWelcomeEmail({ firstName: 'name', email: 'email@mail.com' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendWelcomeEmail({ lastName: 'name', email: 'email@mail.com' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')
  })
})

describe('sendPasswordRecoveryEmail tests', () => {
  it('Must send the email without errors', async () => {
    await expect(sendPasswordRecoveryEmail(user, 'someToken')).resolves.not.toThrow()
  })

  it('Must throw error not providing parameters', async () => {
    await expect(sendPasswordRecoveryEmail())
      .rejects.toThrow('Invalid parameters provided.')
  })

  it('Must throw error not providing a token', async () => {
    await expect(sendPasswordRecoveryEmail(user))
      .rejects.toThrow('Invalid parameters provided.')
  })

  it('Must throw error not providing a user', async () => {
    await expect(sendPasswordRecoveryEmail('someToken'))
      .rejects.toThrow('Invalid parameters provided.')
  })

  it('Must throw error providing invalid user info', async () => {
    await expect(sendPasswordRecoveryEmail({ firstName: 'name' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendPasswordRecoveryEmail({ lastName: 'name' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendPasswordRecoveryEmail({ email: 'email@mail.com' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendPasswordRecoveryEmail({ firstName: 'name', lastName: 'name' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendPasswordRecoveryEmail({ firstName: 'name', email: 'email@mail.com' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')

    await expect(sendPasswordRecoveryEmail({ lastName: 'name', email: 'email@mail.com' }, 'someToken'))
      .rejects.toThrow('Invalid parameters provided.')
  })
})
