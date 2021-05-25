import sgMail from '@sendgrid/mail'

// get the new user req.body and sent the welcome email
export const sendWelcomeEmail = async ({ email, firstName, lastName }, token) => {
  // conect with the sendgrid api
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  // sender template
  const message = {
    to: email,
    from: process.env.EMAIL_SENDER,
    subject: 'confirmation email',
    template_id: 'd-4fb97b0cd4eb49dda25862a581c781d7',
    dynamic_template_data: {
      firstname: firstName,
      lastname: lastName,
      token: token
    }
  }

  // try delivering the message, in case it goes wrong throw the  error
  await sgMail.send(message)
  console.log('Email sent')
}

export const sendPasswordRecoveryEmail = async ({ email, firstName, lastName }, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const message = {
    to: email,
    from: process.env.EMAIL_SENDER,
    subject: 'password recovery email',
    template_id: 'd-63d39b3ef4044aaa9bf8834b52d1c7fa',
    dynamic_template_data: {
      firstname: firstName,
      lastname: lastName,
      token: token
    }
  }

  await sgMail.send(message)
  console.log('Email sent')
}

export default {
  sendWelcomeEmail,
  sendPasswordRecoveryEmail
}
