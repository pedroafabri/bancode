/* globals describe it expect */

import EmailSender from '../../src/helpers/emailSender'

describe('EmailSender tests', () => {
  it('Should throw error when not passing user e-mail', async () => {
    await expect(EmailSender.sendWelcomeEmail())
      .rejects
      .toThrow("Cannot read property 'email' of undefined")
  })

  it('Should send user e-mail even without all info', async () => {
    const send = () => EmailSender.sendWelcomeEmail('lukbosquetti@gmail.com')
    expect(send).not.toThrow(Error)
  })

  it('Should send e-mail correctly', async () => {
    const send = () => EmailSender.sendWelcomeEmail('lukbosquetti@gmail.com', { firstName: 'Lucas', lastName: 'Bosquetti' })
    expect(send).not.toThrow(Error)
  })
})
