import mongoose from "mongoose";

const readingSchema = new mongoose.Schema(
  {
    device: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },

    // Sensor readings
    temperature: Number,          // in °C
    pH: Number,                   // unitless
   
    tds: Number,                  // ppm (Total Dissolved Solids)
    
    // Battery information
    batteryVoltage: Number,       // raw voltage reading
    batteryPercentage: Number,    // normalized percentage (0–100)

    recordedBy: { type: String }, // "machine" or user email
  },
  { timestamps: true }
);

const Reading = mongoose.model("Reading", readingSchema);
export default Reading;