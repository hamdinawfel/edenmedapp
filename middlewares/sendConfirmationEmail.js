const nodemailer = require('nodemailer');
const hbs = require("nodemailer-express-handlebars");
require('dotenv').config();

const sendConfirmationEmail = ({email, eventTitle, eventImageUrl, activationCode}) => {
  
  let transporter = nodemailer.createTransport({
    service: 'edenmed.tn',
    host: 'webmail.edenmed.tn',
    // service: 'gmail',
    // host: 'smtp.gmail.com',
    secureConnection: false, // TLS requires secureConnection to be false
    port: 465, // port for secure SMTP
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    from: process.env.NODEMAILER_EMAIL,
    tls: {
      rejectUnauthorized: false,
      // ciphers: 'SSLv3',
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: "./email",
      defaultLayout: false,
    },
    viewPath: "./email",
    extName: ".hbs",
  };
  transporter.use("compile", hbs(handlebarOptions));
  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL, // sender address
    to: email, // list of receivers
    subject: 'Confirmer votre participation', // Subject line
    text: 'Attente de confirmation de participation', // plain text body
    template: "participate", // html body
    attachments: [
      {
        filename: 'facebook-icon.png',
        path:'./email/assets/facebook-icon.png',
        cid: 'facebook-icon'
      },
      {
        filename: 'instagram-icon.png',
        path:'./email/assets/instagram-icon.png',
        cid: 'instagram-icon'
      },
      {
        filename: 'youtube-icon.png',
        path:'./email/assets/youtube-icon.png',
        cid: 'youtube-icon'
      }],
    context: {
              title: eventTitle,
              eventLink: `${process.env.CONFIRM_MAIL_HOST}#/confirmation/${activationCode}`,
              eventImageUrl : eventImageUrl,
          } 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};

module.exports = sendConfirmationEmail;
