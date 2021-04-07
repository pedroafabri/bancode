import sgMail from '@sendgrid/mail'

require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const creatMsg = (email, name) => { 
  const msg = {
  to: `${email}`,
  from: 'soares.henrique@aluno.ufabc.edu.br',
  subject: 'sending a email test',
  text: 'test message',
  html: `<strong>seja bem vindo ${name} ao bancode,estamos honrados em recebe-lo</strong>`
  }

  const emailSend = () => {
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  }
  
  emailSend()
}

export default {
  creatMsg
}
