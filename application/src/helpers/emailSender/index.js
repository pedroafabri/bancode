import sgMail from '@sendgrid/mail'

// get the new user req.body and sent the welcome email
export const sendWelcomeEmail = async ({ email, firstName, lastName }, token) => {
  // conect with the sendgrid api
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  // throw a err in case the function dont receive a email
  if (!email) throw new Error('email field not filled')

  // sender template
  const message = {
    from: {
      email: process.env.EMAIL_SENDER
    },
    subject: 'confirmation e-mail',
    personalizations: [
      {
        to: [
          {
            email: email
          }
        ],
        dynamic_template_data: {
          firstname: firstName,
          lastname: lastName,
          token: token
        }
      }
    ],
    template_id: 'd-4fb97b0cd4eb49dda25862a581c781d7'
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
