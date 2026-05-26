
import axios from 'axios';

const sendEmail = async (options) => {
  // Convert your comma-separated string of emails into the array structure Brevo expects
  const emailArray = options.email.split(',').map(email => ({ email: email.trim() }));

  const data = {
    sender: { 
      name: "SehatSetu Wellness", 
      email: process.env.EMAIL_USER // This will be your rajatkumar797979@gmail.com
    },
    to: emailArray,
    subject: options.subject,
    htmlContent: options.message,
  };

  const config = {
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY, // Read directly from Render variables
      'content-type': 'application/json',
    },
  };

  // Fires over secure port 443, bypassing Render's infrastructure firewall completely!
  await axios.post('https://api.brevo.com/v3/smtp/email', data, config);
};

export default sendEmail;









// import nodemailer from 'nodemailer';

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // Must be false for port 587
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     // 👇 CRITICAL FOR CLOUD ENVIRONMENTS: Prevents infinite hanging
//     connectionTimeout: 10000, // Force fail if connection takes over 10 seconds
//     socketTimeout: 10000,     // Force fail if data transfer stalls for 10 seconds
//   });

//   const mailOptions = {
//     from: `"SehatSetu Wellness" <${process.env.EMAIL_USER}>`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message, 
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default sendEmail;






















// import nodemailer from 'nodemailer';

// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const mailOptions = {
//     from: 'SehatSetu Wellness <noreply@sehatsetu.com>',
//     to: options.email,
//     subject: options.subject,
//     html: options.message, 
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default sendEmail;