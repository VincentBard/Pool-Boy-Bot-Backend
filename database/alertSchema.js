import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  alertType: { type: String }, 
  message: { type: String, required: true },
  severity: { type: String, enum: ["info", "warning", "critical"], default: "info" },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  
  clipUrl: {
      type: String,
      default: null, // URL for the final MP4 video clip
      trim: true
  },
  clipDurationSeconds: {
      type: Number,
      default: null
  },
  clipStartTs: {
      type: Number, // Unix timestamp (float) for the clip start
      default: null
  },
  snapshotUrl: {
      type: String,
      default: null, // URL for the JPG thumbnail image
      trim: true
  }
});

export default mongoose.model('Alert', AlertSchema);