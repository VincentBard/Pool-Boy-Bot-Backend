import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  alertType: { type: String }, // e.g. "High Temp", "Low Chlorine"
  message: { type: String, required: true },
  severity: { type: String, enum: ["info", "warning", "critical"], default: "info" },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

export default mongoose.model('Alert', AlertSchema);