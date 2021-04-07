import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendWelcomeEmail = (userInformations) => {
  const message = {
    to: userInformations.email,
    from: process.env.EMAIL_SENDER,
    subject: 'sending a email test',
    text: 'test message',
    html: `<strong>seja bem vindo ${userInformations.name} ao bancode, estamos honrados em recebe-lo</strong>`
  }

  const emailSender = async () => {
    await sgMail
      .send(message)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  emailSender()
}

export default {
  sendWelcomeEmail
}
