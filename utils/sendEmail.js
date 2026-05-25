
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Must be false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // 👇 CRITICAL FOR CLOUD ENVIRONMENTS: Prevents infinite hanging
    connectionTimeout: 10000, // Force fail if connection takes over 10 seconds
    socketTimeout: 10000,     // Force fail if data transfer stalls for 10 seconds
  });

  const mailOptions = {
    from: `"SehatSetu Wellness" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, 
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;






















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