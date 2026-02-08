import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  category: { type: String, default: 'All' },
  channelName: { type: String, required: true },
  channelAvatar: { type: String }
}, { timestamps: true });

export default mongoose.model('Video', VideoSchema);