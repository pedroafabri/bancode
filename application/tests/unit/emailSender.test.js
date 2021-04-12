import EmailSender from '../../src/helpers/emailSender'

describe('EmailSender tests', () => {
  it('Should throw error when not passing user e-mail', async () => {
    await expect(EmailSender.sendWelcomeEmail())
    .rejects
    .toThrow('email field not filled');
  })

  it('Should send user e-mail even without all info', async () => {
    const send = () => EmailSender.sendWelcomeEmail('pedroafabri@gmail.com')
    expect(send).not.toThrow(Error)
  })

  it('Should send e-mail correctly', async () => {
    const send = () => EmailSender.sendWelcomeEmail('pedroafabri@gmail.com', {firstName: 'Pedro', lastName: 'Fabri'})
    expect(send).not.toThrow(Error)
  })
})