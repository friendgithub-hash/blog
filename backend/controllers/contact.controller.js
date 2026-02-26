import Contact from "../models/contact.model.js";
import { sendContactNotification } from "../services/email.service.js";

// Create new contact submission
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Extract user context
    const clerkUserId = req.auth?.userId || null;
    const ipAddress = req.ip || req.connection.remoteAddress || null;

    // Create contact document
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      clerkUserId,
      ipAddress,
    });

    // Save to database
    const savedContact = await contact.save();

    // Send email notification asynchronously (fire-and-forget)
    sendContactNotification(savedContact).catch((error) => {
      console.error("[Contact Controller] Email notification failed:", error);
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      contactId: savedContact._id,
    });
  } catch (error) {
    console.error("[Contact Controller] Error creating contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process your request. Please try again later.",
    });
  }
};
