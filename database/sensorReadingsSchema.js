import mongoose from 'mongoose';

const SensorReadingSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  temperature: { type: Number },      // °C
  chlorineLevel: { type: Number },    // ppm
  turbidity: { type: Number },        // NTU
  recordedAt: { type: Date, default: Date.now }
});

export default mongoose.model('SensorReading', SensorReadingSchema);