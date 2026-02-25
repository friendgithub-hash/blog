import { Webhook } from "svix";
import User from "../models/user.model.js";

export const clerkWebhook = async (req, res) => {
  try {
    // Get webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      console.error("[webhook] CLERK_WEBHOOK_SECRET not configured");
      return res
        .status(500)
        .json({ message: "Webhook secret not configured on server" });
    }

    // Debug logging to help troubleshoot webhook issues
    console.log("[webhook] Received webhook request");
    console.log("[webhook] Body type:", typeof req.body);
    console.log("[webhook] Body is Buffer:", Buffer.isBuffer(req.body));

    // FIXED: Convert Buffer to string for Svix verification
    // bodyParser.raw() gives us a Buffer, but Svix.verify() needs a string
    let payload;
    if (Buffer.isBuffer(req.body)) {
      payload = req.body.toString();
    } else if (typeof req.body === "string") {
      payload = req.body;
    } else {
      console.error("[webhook] Unexpected body type:", typeof req.body);
      return res.status(400).json({ message: "Invalid payload format" });
    }

    const headers = req.headers;
    console.log("[webhook] Headers svix-id:", headers["svix-id"]);
    console.log("[webhook] Headers svix-timestamp:", headers["svix-timestamp"]);
    console.log("[webhook] Headers svix-signature:", headers["svix-signature"]);

    // Initialize Svix webhook verifier
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
      // Verify webhook signature to ensure it's from Clerk
      // This requires raw body as string for proper signature verification
      evt = wh.verify(payload, headers);
      console.log(
        "[webhook] Webhook verified successfully, event type:",
        evt.type,
      );
    } catch (err) {
      console.error("[webhook] Failed to verify webhook:", err.message);
      console.error("[webhook] Full error:", err);
      return res.status(400).json({ message: "Webhook verification failed!" });
    }

    // Handle user.created event - sync new Clerk user to MongoDB
    if (evt.type === "user.created") {
      console.log("[webhook] Creating new user in MongoDB:", evt.data.id);

      try {
        const newUser = new User({
          clerkUserId: evt.data.id,
          username:
            evt.data.username || evt.data.email_addresses[0].email_address,
          email: evt.data.email_addresses[0].email_address,
          img: evt.data.image_url,
        });
        await newUser.save();
        console.log("[webhook] User created successfully in MongoDB");
      } catch (err) {
        console.error("[webhook] Failed to create user in MongoDB:", err);
        // Still return 200 to Clerk so it doesn't retry
        return res
          .status(200)
          .json({ message: "User creation failed but acknowledged" });
      }
    }

    // Send success response so Clerk knows we handled the event
    console.log("[webhook] Sending success response");
    return res.status(200).json({ message: "Webhook received and verified!" });
  } catch (error) {
    // FIXED: Catch any unhandled errors to prevent 502
    console.error("[webhook] Unhandled error in webhook handler:", error);
    console.error("[webhook] Error stack:", error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};
