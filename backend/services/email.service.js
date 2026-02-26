import nodemailer from "nodemailer";

// Create OAuth2 transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.ADMIN_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
};

// Send contact form notification email
export const sendContactNotification = async (contactData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${contactData.name} &lt;${contactData.email}&gt;</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Submitted:</strong> ${new Date(contactData.createdAt).toLocaleString()}</p>
        <hr>
        <h3>Message:</h3>
        <p>${contactData.message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>Submission ID: ${contactData._id}</small></p>
        <p><small>User ID: ${contactData.clerkUserId || "Anonymous"}</small></p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      "[Email Service] Notification sent successfully:",
      info.messageId,
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // Log error but don't throw - fire-and-forget pattern
    console.error(
      "[Email Service] Failed to send notification:",
      error.message,
    );
    return { success: false, error: error.message };
  }
};
