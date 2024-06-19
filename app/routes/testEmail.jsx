// const { sendEmail } = require('./emailService'); // Ajusta el path según tu estructura

import { sendEmail } from '../data/email.server'

const testEmail = () => {
  // Prueba el envío de un correo electrónico
  sendEmail({
    to: 'test@example.com', // Cambia esto por una dirección de correo válida para pruebas
    subject: 'Prueba de envío de correo',
    text: 'Este es un correo de prueba enviado desde Mailtrap.'
  })

  return <div className="mt-30">TESTING TESTING</div>
}

export default testEmail
