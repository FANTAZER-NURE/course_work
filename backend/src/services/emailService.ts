import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'titanoleg071102@gmail.com',
    pass: 'rnsf alas fhum kfhw',
  },
})

export function send({email, subject, html}: any) {
  return transporter.sendMail({
    to: email, // list of receivers
    subject: subject, // Subject line
    html: html, // html body
  })
}

function sendActivationEmail(email: any, token: any) {
  const href = `http://localhost:3000/activate/${token}`

  const html = `
    <h1>Активуйте аккаунт</h1>
    <a href="${href}">Активувати</a>
  `
  return send({email, html, subject: 'Activation email'})
}

export const emailService = {sendActivationEmail, send}
