import nodemailer from "nodemailer";

export const support = async (req, res) => {
  const { name, email, message,subject } = req.body;

  if (!name || !email || !message || !subject) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SUPPORT_EMAIL,         // Your Gmail address
        pass: process.env.SUPPORT_EMAIL_PASSWORD // App-specific password
      },
    });

    // Optional: extract subject from message if included like "Subject: XYZ\n\n..."
    const subjectMatch = message.match(/^Subject:\s*(.*)\n/i);
    const extractedSubject = subjectMatch ? subjectMatch[1] : `New Support Message from ${name}`;
    const cleanMessage = subjectMatch ? message.replace(/^Subject:.*\n/i, "").trim() : message;

    const mailOptions = {
      from: `"${name}" <${process.env.SUPPORT_EMAIL}>`,
      to: process.env.SUPPORT_EMAIL,
      subject: extractedSubject,
      text: `
Support Message Received
Subject: ${subject}

From: ${name} <${email}>

${cleanMessage}
      `.trim(),
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
};