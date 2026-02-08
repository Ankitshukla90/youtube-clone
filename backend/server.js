import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import commentRoutes from './routes/comment.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/youtube-clone')
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));