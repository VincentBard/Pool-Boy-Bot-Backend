import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },

  // Existing
  fullName: { type: String },
  createdAt: { type: Date, default: Date.now },
  passwordHash: { type: String }, // optional

  // New profile fields
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  jobTitle: { type: String, required: false },
  phone: { type: String, required: false },
});

export default mongoose.model('User', UserSchema);
