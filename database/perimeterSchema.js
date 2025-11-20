import mongoose from "mongoose";

const PointSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const PerimeterSchema = new mongoose.Schema({
  device: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Device", 
    required: true, 
    unique: true
  },

  // NEW: Two perimeter polygons
  shallow: {
    type: [PointSchema],
    default: []
  },

  deep: {
    type: [PointSchema],
    default: []
  },

  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Perimeter", PerimeterSchema);
