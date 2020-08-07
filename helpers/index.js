const nodeMailer = require('nodemailer');
const defaultEmailData = { from : "noreply@node-react.com"};

exports.sendmail = emailData => {
     const transporter = nodeMailer.createTransport({
         host: "smtp.gmail.com",
         port: 587,
         secure: false,
         requireTLS: true,
         auth: {
             user : "saikrishana9@gmail.com",
             pass: "viicvinjhivnuzev"
         }
     })
     return (
         transporter.sendMail(emailData)
                    .then(info => console.log(`Message sent: ${info.response}`))
                    .catch(err => console.log(`Problem sending email: ${err.message}`))
     )
}