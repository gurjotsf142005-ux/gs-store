const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create a transporter configuration using your App Password credentials
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER || "your-gmail-username@gmail.com", // Your Gmail account address
      pass: process.env.EMAIL_PASS || "xxxx xxxx xxxx xxxx"          // Paste your 16-character App Password here
    }
  });

  // 2. Define the structural email layout parameters
  const mailOptions = {
    from: `"GS Store Security" <no-reply@gsstore.com>`,
    to: options.email,
    subject: options.subject,
    html: options.htmlMessage
  };

  // 3. Dispatch the message cargo down the wire
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;