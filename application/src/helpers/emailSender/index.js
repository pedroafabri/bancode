import sgMail from '@sendgrid/mail'

// get the new user req.body and sent the welcome email
export const sendWelcomeEmail = async (email, userInfo) => {
  // conect with the sendgrid api
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  // throw a err in case the function dont receive a email
  if (!email) throw new Error('email field not filled')

  // sender template
  const message = {
    to: email,
    from: process.env.EMAIL_SENDER,
    subject: 'sending a email test',
    text: 'test message',
    html: `<strong>seja bem vindo ${userInfo.firstName} ${userInfo.lastName} ao bancode, estamos honrados em recebe-lo</strong>`
  }

  // try delivering the message, in case it goes wrong throw the  error
  try {
    await sgMail.send(message)
    console.log('Email sent')
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default {
  sendWelcomeEmail
}
