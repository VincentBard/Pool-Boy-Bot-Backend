import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);