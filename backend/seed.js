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
    // 1. CLEAN SLATE
    await User.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});

    // 2. CREATE REALISTIC CHANNELS
    const channelData = [
        { name: "Tech Vision", cat: "Technology", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech" },
        { name: "Gaming Hub", cat: "Gaming", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Game" },
        { name: "Tasty Treats", cat: "Cooking", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Food" },
        { name: "Travel Diaries", cat: "Lifestyle", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Travel" },
        { name: "Lofi Beats", cat: "Music", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Music" },
        { name: "Code Academy", cat: "Education", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Code" },
        { name: "Fitness Pro", cat: "Fitness", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fit" }
    ];

    const users = [];
    console.log("Creating Channels...");
    for (const data of channelData) {
        const newUser = new User({
            username: data.name,
            email: `${data.name.replace(/\s+/g, '').toLowerCase()}@youtube.com`,
            password: "hashedpassword123",
            avatar: data.avatar,
        });
        const savedUser = await newUser.save();
        users.push(savedUser);
    }

    // 3. CREATE VIDEOS WITH REAL YOUTUBE THUMBNAILS
    // We use real YouTube IDs to get high-quality thumbnails
    const videoTemplates = [
        { title: "Building a YouTube Clone with MERN Stack", id: "7CqJlxBYj4M", cat: "Education" },
        { title: "lofi hip hop radio - beats to relax/study to", id: "jfKfPfyJRdk", cat: "Music" },
        { title: "Elden Ring: Shadow of the Erdtree Trailer", id: "K_03kFqWfqs", cat: "Gaming" },
        { title: "Gordon Ramsay's Perfect Steak", id: "kR5E_I64p2k", cat: "Cooking" },
        { title: "iPhone 15 Pro Review: The Truth", id: "xqyUdNxWazA", cat: "Technology" },
        { title: "10 Minute Full Body Workout", id: "W4eKBSOnEmY", cat: "Fitness" },
        { title: "Solo Travel to Japan | 4K", id: "Wq_0W5gN2s8", cat: "Lifestyle" },
        { title: "Minecraft 1.21 Update Guide", id: "GC5H3s5_d1g", cat: "Gaming" },
        { title: "Top 10 Movies of 2024", id: "6ZfuNTqbHE8", cat: "Entertainment" },
        { title: "Learn React In 30 Minutes", id: "hQAHSlTtcmY", cat: "Education" },
        { title: "SpaceX Starship Launch", id: "-Oox2w5sMcA", cat: "Technology" },
        { title: "Relaxing Rain Sounds for Sleep", id: "mPZkdNFkNps", cat: "Music" },
        { title: "How to Make Pasta from Scratch", id: "1-SJGQ2HLp8", cat: "Cooking" },
        { title: "GTA 6 - Official Trailer", id: "QdBZY2fkU-0", cat: "Gaming" },
        { title: "My Desk Setup Tour 2024", id: "wG2dGk7s8c8", cat: "Technology" },
    ];

    console.log("Generating Videos...");
    
    // Generate 40-50 videos by looping through templates
    for (let i = 0; i < 45; i++) {
        const template = videoTemplates[i % videoTemplates.length];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const views = Math.floor(Math.random() * 5000000) + 10000;
        
        // Use standard YouTube max-res thumbnail URL
        const realThumbnail = `https://i.ytimg.com/vi/${template.id}/hq720.jpg`;

        const newVideo = new Video({
            user: randomUser._id,
            channelName: randomUser.username,
            channelAvatar: randomUser.avatar,
            title: i > 14 ? `${template.title} (Part ${Math.floor(i/14) + 1})` : template.title,
            description: `Welcome to ${template.title}. In this video, we dive deep into the details. \n\nDon't forget to like and subscribe to ${randomUser.username}!`,
            thumbnailUrl: realThumbnail, 
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Safe dummy video for playback
            views: views,
            likes: Math.floor(views * 0.05),
            dislikes: Math.floor(views * 0.001),
            category: template.cat,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
        });
        await newVideo.save();
    }

    console.log("Database Seeded with REAL Thumbnails!");
    process.exit();
};

seedDB();