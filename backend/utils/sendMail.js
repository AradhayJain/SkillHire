import nodemailer from 'nodemailer';

/**
 * @desc Utility function to send emails using nodemailer
 * @param {object} options - Options for the email (email, subject, message)
 */
const sendEmail = async (options) => {
  // 1. Create a transporter object using SMTP transport.
  //    You need to set up your email provider's credentials in your environment variables.
  //    For development, you can use a service like Mailtrap.io.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER, // Your SMTP username
      pass: process.env.SMTP_PASS, // Your SMTP password
    },
  });

  // 2. Define the email options.
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // Sender's name and email
    to: options.email,       // Recipient's email
    subject: options.subject,  // Subject line
    text: options.message,     // Plain text body
    // html: '<b>Hello world?</b>' // You can also send HTML content
  };

  // 3. Send the email.
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;

/*
------------------------------------------------------------------
SETUP INSTRUCTIONS for your .env file:
------------------------------------------------------------------

# Add these variables to your .env file at the root of your project.
# Replace the values with your actual SMTP provider's details.
# Example using Mailtrap for development:

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
FROM_EMAIL=noreply@skillhire.com
FROM_NAME=SkillHire Support

*/
