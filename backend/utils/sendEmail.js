import sgMail from '@sendgrid/mail';

/**
 * @desc Utility function to send emails using SendGrid
 * @param {object} options - Options for the email (email, subject, message)
 */
const sendEmail = async (options) => {
  // 1. Set the API Key for SendGrid.
  //    This is retrieved from your environment variables.
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // 2. Define the email options.
  //    The 'from' email MUST be a verified sender in your SendGrid account.
  const msg = {
    to: options.email,                             // Recipient
    from: process.env.SENDGRID_FROM_EMAIL,         // Your verified sender email
    subject: options.subject,                      // Subject line
    text: options.message,                         // Plain text body
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>', // You can also send HTML
  };

  // 3. Send the email using the SendGrid library.
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid');
  } catch (error) {
    console.error('Error sending email via SendGrid:', error);

    // If there are specific SendGrid errors, they can be logged here
    if (error.response) {
      console.error(error.response.body);
    }
    // Re-throw the error so the calling function knows it failed
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
