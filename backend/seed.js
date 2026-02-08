import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js';
import User from './models/User.js';
import Comment from './models/Comment.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/youtube-clone')
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

const seedDB = async () => {
    await User.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});

    // 1. CREATE CHANNELS WITH BANNERS & SUBSCRIBERS
    const channels = [
        { name: "Tech Vision", banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200", subs: 1250000 },
        { name: "Gaming Hub", banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200", subs: 890000 },
        { name: "Tasty Treats", banner: "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1200", subs: 450000 },
        { name: "Wanderlust", banner: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200", subs: 320000 },
        { name: "Lofi Girl", banner: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=1200", subs: 5600000 },
        { name: "Code Master", banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200", subs: 120000 },
        { name: "FitLife Pro", banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200", subs: 85000 },
        { name: "Movie Recap", banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200", subs: 2100000 }
    ];

    const users = [];
    for (const ch of channels) {
        const newUser = new User({
            username: ch.name,
            email: `${ch.name.replace(/\s+/g, '').toLowerCase()}@youtube.com`,
            password: "hashedpassword123",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${ch.name}`,
            channelBanner: ch.banner, // Matches PDF
            subscribers: ch.subs      // Matches PDF
        });
        const savedUser = await newUser.save();
        users.push(savedUser);
    }

    // 2. CREATE VIDEOS (Same 50+ list as before)
    const rawVideos = [
        { id: "bMknfKXIFA8", title: "React Course - Beginner's Tutorial", cat: "Education", userIdx: 5 },
        { id: "xqyUdNxWazA", title: "iPhone 15 Pro Review: The Truth", cat: "Technology", userIdx: 0 },
        { id: "QdBZY2fkU-0", title: "Grand Theft Auto VI Trailer 1", cat: "Gaming", userIdx: 1 },
        { id: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax", cat: "Music", userIdx: 4 },
        { id: "kR5E_I64p2k", title: "Gordon Ramsay's Perfect Steak", cat: "Cooking", userIdx: 2 },
        { id: "Wq_0W5gN2s8", title: "Solo Travel to Japan | 4K", cat: "Lifestyle", userIdx: 3 },
        { id: "W4eKBSOnEmY", title: "10 Minute Full Body Workout", cat: "Fitness", userIdx: 6 },
        { id: "tc9Zba_F_t8", title: "Avengers: Secret Wars Trailer", cat: "Entertainment", userIdx: 7 },
        // ... (Repeating pattern to fill grid)
        { id: "nu_pCVPKzTk", title: "Full Stack Web Dev", cat: "Education", userIdx: 5 },
        { id: "0J2L4tJgXQc", title: "Samsung S24 Ultra", cat: "Technology", userIdx: 0 },
        { id: "K_03kFqWfqs", title: "Elden Ring DLC", cat: "Gaming", userIdx: 1 },
        { id: "mPZkdNFkNps", title: "Rain Sounds", cat: "Music", userIdx: 4 },
        { id: "1-SJGQ2HLp8", title: "Homemade Pasta", cat: "Cooking", userIdx: 2 }
    ];

    // Generate 45 videos
    for (let i = 0; i < 45; i++) {
        const template = rawVideos[i % rawVideos.length];
        const user = users[template.userIdx];
        
        const newVideo = new Video({
            user: user._id,
            channelName: user.username,
            channelAvatar: user.avatar,
            title: template.title,
            description: `Check out ${template.title}! Don't forget to subscribe to ${user.username}.`,
            thumbnailUrl: `https://i.ytimg.com/vi/${template.id}/hq720.jpg`,
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            views: Math.floor(Math.random() * 5000000) + 5000,
            likes: Math.floor(Math.random() * 50000),
            dislikes: Math.floor(Math.random() * 100),
            category: template.cat,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
        });
        const savedVideo = await newVideo.save();

        // Comments
        for(let j=0; j<4; j++) {
            const commenter = users[Math.floor(Math.random() * users.length)];
            await new Comment({
                videoId: savedVideo._id,
                userId: commenter._id,
                text: "Awesome content! Loved it.",
                userName: commenter.username,
                userAvatar: commenter.avatar
            }).save();
        }
    }

    console.log("Database Seeded with Banners & Subs!");
    process.exit();
};

seedDB();