import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'SehatSetu Wellness <noreply@sehatsetu.com>',
    to: options.email,
    subject: options.subject,
    html: options.message, 
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;