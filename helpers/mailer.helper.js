const nodemailer = require('nodemailer');

async function sendEmail(receiver, subject, html_email){
  try{
    const transporter = nodemailer.createTransport({
      host: JSON.parse(process.env.EMAIL_CREDS).host,
      secure: true,
      port: 465,
      auth: {
        user: JSON.parse(process.env.EMAIL_CREDS).user,
        pass: JSON.parse(process.env.EMAIL_CREDS).pass
      },
      tls:{
          ciphers:'SSLv3'
      },
      ignoreTLS:false,
    });
    const mailOptions = {
        from: JSON.parse(process.env.EMAIL_CREDS).email, // sender address
        to: receiver,
        subject: subject, // Subject line
        html: html_email, // plain text body`
    };
    await transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        } else {
          
        }
    });
  } catch (e){
    console.log(e);
  }
}
module.exports = { sendEmail };