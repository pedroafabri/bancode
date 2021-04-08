import EmailSender from '../../src/helpers/emailSender'

describe('EmailSender tests', () => {
  it('Should throw error when not passing user e-mail', () => {
    const send = () => EmailSender.sendWelcomeEmail()
    expect(send).toThrow(Error)
  })

  it('Should send user e-mail even without all info', () => {
    const send = () => EmailSender.sendWelcomeEmail('pedroafabri@gmail.com')
    expect(send).not.toThrow(Error)
  })

  it('Should send e-mail correctly', () => {
    const send = () => EmailSender.sendWelcomeEmail('pedroafabri@gmail.com', {firstName: 'Pedro', lastName: 'Fabri'})
    expect(send).not.toThrow(Error)
  })
})