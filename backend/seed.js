import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/youtube-clone')
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

const seedDB = async () => {
    await User.deleteMany({});
    await Video.deleteMany({});

    const user = new User({
        username: "YouTube Admin",
        email: "admin@youtube.com",
        password: "hashedpassword123",
    });
    const savedUser = await user.save();

    const videos = [
        {
            user: savedUser._id,
            title: "Building a YouTube Clone with MERN Stack",
            thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            channelName: "Code Master",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Code",
            views: 125000,
            likes: 5400,
            description: "Learn how to build a full-stack application using MongoDB, Express, React, and Node.js.",
            category: "Education"
        },
        {
            user: savedUser._id,
            title: "Lofi Hip Hop - Beats to Relax/Study to",
            thumbnailUrl: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            channelName: "Lofi Girl",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lofi",
            views: 4500000,
            likes: 120000,
            description: "Join the study session with these relaxing beats.",
            category: "Music"
        },
        {
            user: savedUser._id,
            title: "Top 10 Travel Destinations 2024",
            thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            channelName: "Wanderlust",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Travel",
            views: 89000,
            likes: 2300,
            description: "Planning a trip? Here are the best places to visit this year.",
            category: "Lifestyle"
        },
        {
            user: savedUser._id,
            title: "Elden Ring: Shadow of the Erdtree Trailer",
            thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            channelName: "Bandai Namco",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Game",
            views: 8200000,
            likes: 450000,
            description: "The new expansion for Elden Ring is finally here.",
            category: "Gaming"
        }
    ];

    await Video.insertMany(videos);
    console.log("Database Seeded!");
    process.exit();
};

seedDB();