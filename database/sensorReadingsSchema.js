import mongoose from "mongoose";

const readingSchema = new mongoose.Schema(
  {
    device: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
    temperature: Number,
    pH: Number,
    chlorine: Number,
    recordedBy: { type: String }, // "machine" or user email
  },
  { timestamps: true }
);

const Reading = mongoose.model("Reading", readingSchema);
export default Reading;