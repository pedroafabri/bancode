import sgMail from '@sendgrid/mail'

require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const msg = {
  to: 'lucas.zet@hotmail.com',
  from: 'soares.henrique@aluno.ufabc.edu.br',
  subject: 'sending a email test',
  text: 'test message',
  html: '<strong>seja bem vindo ao bancode, estamos honrados em recebe-lo</strong>'
}

export const emailSend = () => {
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

export default {
  emailSend,
  msg
}
