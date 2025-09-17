import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deviceName: { type: String },
  serialNumber: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date }
});

export default mongoose.model('Device', DeviceSchema);