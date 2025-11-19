import mongoose from "mongoose";

const PerimeterSchema = new mongoose.Schema({
  device: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Device", 
    required: true, 
    unique: true // ensure only one perimeter per device
  },

  // Array of points: [{ x: Number, y: Number }]
  points: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    }
  ],

  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Perimeter", PerimeterSchema);