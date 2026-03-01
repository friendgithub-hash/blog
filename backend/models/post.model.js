import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    img: { type: String },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String },
    category: { type: String, default: "application" },
    content: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    visits: { type: Number, default: 0 },
    translations: {
      type: Map,
      of: {
        title: { type: String },
        desc: { type: String },
        content: { type: String },
      },
      default: {},
    },
  },
  { timestamps: true },
);
export default mongoose.model("Post", postSchema);
