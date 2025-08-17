const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER || "laptoptest7788@gmail.com",
    pass: process.env.EMAIL_PASS || "uqfiabjkiqudrgdw",
  },
});

async function sendOTPEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER || "laptoptest7788@gmail.com",
    to,
    subject: 'Your Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail }; 