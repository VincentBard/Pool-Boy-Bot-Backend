import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    type: { type: String },
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);
export default Device;