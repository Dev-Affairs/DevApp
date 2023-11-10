// sendMail.js
const mailConfig = require("../config/mailer.config.json") 
const nodemailer = require('nodemailer');

// Send email
const sendMail = async(otp,recipient) =>{
    // Create a transporter using SMTP
const transporter = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailConfig.mail,
        pass: mailConfig.app_password
    }
});

    // Email content
const mailOptions = {
    from: mailConfig.mail ,
    to: recipient,
    subject: 'Account Verification',
    text: `${otp} is your OTP for your account verification it will expire in 3 minutes . Thank you`
};

  await  transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error:', error);
        }
        console.log('Email sent:', info.response);
    });
}

module.exports = {sendMail}

