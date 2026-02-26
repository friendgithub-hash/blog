import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["unread", "read", "responded"],
      default: "unread",
    },
    clerkUserId: {
      type: String,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

// Create indexes for efficient querying
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ clerkUserId: 1 });

export default mongoose.model("Contact", contactSchema);
