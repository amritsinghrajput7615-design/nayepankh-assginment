
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async ({ to, subject, html }) => {  // destructure object
    try {
        const info = await transporter.sendMail({
            from: `"NayePankh Foundation" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;  // re-throw so controller catches it and returns 500
    }
};

module.exports = { sendEmail };














