import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Default" },
  channels: [{ type: String }] 
}, { timestamps: true });

export default mongoose.model('User', UserSchema);