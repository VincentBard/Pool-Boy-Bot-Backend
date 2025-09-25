import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },

  // Existing
  fullName: { type: String },
  createdAt: { type: Date, default: Date.now },
  passwordHash: { type: String }, // optional

  // New profile fields
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  phone: { type: String, required: true },
});

export default mongoose.model('User', UserSchema);
