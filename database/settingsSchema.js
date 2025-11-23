import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  // Detection features
  detectPeople: Boolean,
  detectPets: Boolean,
  detectToddler: Boolean,             // <-- NEW
  detectPerimeterBreach: Boolean,
  detectDeepWaterBreach: Boolean,
  detectForeignAnimals: Boolean,
  detectMotion: Boolean,
  detectDrowningRisk: Boolean,
  detectForeignObjects: Boolean,
  detectSplashing: Boolean,

  // Water quality
  waterTempMin: Number,
  waterTempMax: Number,
  phMin: Number,
  phMax: Number,
  tdsMin: Number,
  tdsMax: Number,

  // Battery
  batteryLowAlert: Boolean,
  batteryLowThreshold: Number,

  // Cleaning schedule
  cleaningScheduleEnabled: Boolean,
  cleaningDate: Date,
  cleaningTime: String,

  // Alert preferences
  alertsPush: Boolean,
  alertsEmail: Boolean,
  alertsCriticalOnly: Boolean,

  // Robot automation
  autoEngageInflatable: Boolean,
  autoStopRobotOnAlert: Boolean,
  autoRecordOnAlert: Boolean,
  autoRoamOn: Boolean, 



  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserSettings", UserSettingsSchema);
