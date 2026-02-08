import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Default" },
  // ADDED TO MATCH PDF REQUIREMENTS:
  channelBanner: { type: String, default: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80" },
  subscribers: { type: Number, default: 0 },
  channels: [{ type: String }] 
}, { timestamps: true });

export default mongoose.model('User', UserSchema);