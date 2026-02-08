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

    console.log("Creating Channels...");

    // 2. CREATE CHANNELS (Users)
    const channels = [
        { name: "Tech Vision", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech" },
        { name: "Gaming Hub", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Game" },
        { name: "Tasty Treats", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Food" },
        { name: "Wanderlust", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Travel" },
        { name: "Lofi Girl", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Music" },
        { name: "Code Master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Code" },
        { name: "FitLife Pro", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fit" },
        { name: "Movie Recap", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Movie" }
    ];

    const users = [];
    for (const ch of channels) {
        const newUser = new User({
            username: ch.name,
            email: `${ch.name.replace(/\s+/g, '').toLowerCase()}@youtube.com`,
            password: "hashedpassword123",
            avatar: ch.avatar,
        });
        const savedUser = await newUser.save();
        users.push(savedUser);
    }

    // 3. REAL YOUTUBE DATA (50 Unique Videos)
    // ID is the YouTube Video ID (e.g., dQw4w9WgXcQ)
    const rawVideos = [
        // --- CODING & EDUCATION (Code Master) ---
        { id: "bMknfKXIFA8", title: "React Course - Beginner's Tutorial", cat: "Education", userIdx: 5 },
        { id: "nu_pCVPKzTk", title: "Full Stack Web Development for Beginners", cat: "Education", userIdx: 5 },
        { id: "SqcY0GlETPk", title: "React Tutorial for Beginners", cat: "Education", userIdx: 5 },
        { id: "G3e-cpL7ofc", title: "HTML & CSS Full Course", cat: "Education", userIdx: 5 },
        { id: "zJsY85pMNjo", title: "How the Internet Works in 5 Minutes", cat: "Education", userIdx: 5 },
        { id: "PkZNo7MFNFg", title: "Learn JavaScript - Full Course for Beginners", cat: "Education", userIdx: 5 },
        
        // --- TECH (Tech Vision) ---
        { id: "xqyUdNxWazA", title: "iPhone 15 Pro Review: The Truth", cat: "Technology", userIdx: 0 },
        { id: "0J2L4tJgXQc", title: "Samsung Galaxy S24 Ultra Review", cat: "Technology", userIdx: 0 },
        { id: "uXP0fS_rDKQ", title: "MacBook Air M3 - Is it worth it?", cat: "Technology", userIdx: 0 },
        { id: "wG2dGk7s8c8", title: "Dream Desk Setup 2024", cat: "Technology", userIdx: 0 },
        { id: "788E_8xGLLo", title: "Rabbit R1 Review: The Future of AI?", cat: "Technology", userIdx: 0 },
        { id: "Kk1607J3d60", title: "Sony WH-1000XM5 Review", cat: "Technology", userIdx: 0 },

        // --- GAMING (Gaming Hub) ---
        { id: "QdBZY2fkU-0", title: "Grand Theft Auto VI Trailer 1", cat: "Gaming", userIdx: 1 },
        { id: "K_03kFqWfqs", title: "Elden Ring: Shadow of the Erdtree Trailer", cat: "Gaming", userIdx: 1 },
        { id: "GC5H3s5_d1g", title: "Minecraft 1.21 Update Guide", cat: "Gaming", userIdx: 1 },
        { id: "Calc_d6d8H0", title: "Valorant: New Agent Gameplay", cat: "Gaming", userIdx: 1 },
        { id: "1Fk6sE-C3S0", title: "PS5 Pro - Everything We Know", cat: "Gaming", userIdx: 1 },
        { id: "p26Y6t7hXm8", title: "Speedrun: Super Mario 64 in 20 Minutes", cat: "Gaming", userIdx: 1 },
        { id: "8X2kIfS6fb8", title: "Cyberpunk 2077: Phantom Liberty Review", cat: "Gaming", userIdx: 1 },

        // --- MUSIC (Lofi Girl) ---
        { id: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax/study to", cat: "Music", userIdx: 4 },
        { id: "mPZkdNFkNps", title: "Relaxing Rain Sounds for Sleep", cat: "Music", userIdx: 4 },
        { id: "5qap5aO4i9A", title: "lofi hip hop radio - beats to sleep/chill to", cat: "Music", userIdx: 4 },
        { id: "tgIqecROs5M", title: "Synthwave Radio - Beats to Hack/Code to", cat: "Music", userIdx: 4 },
        { id: "lTRiuFIWV54", title: "Jazz Music for Work and Concentration", cat: "Music", userIdx: 4 },
        
        // --- COOKING (Tasty Treats) ---
        { id: "kR5E_I64p2k", title: "Gordon Ramsay's Perfect Steak", cat: "Cooking", userIdx: 2 },
        { id: "1-SJGQ2HLp8", title: "How to Make Pasta from Scratch", cat: "Cooking", userIdx: 2 },
        { id: "P2wP88a1e8Q", title: "The Best Burger You'll Ever Eat", cat: "Cooking", userIdx: 2 },
        { id: "j6XjWzJ8W7Q", title: "5 Minute Breakfast Ideas", cat: "Cooking", userIdx: 2 },
        { id: "SQQo_c8W09w", title: "Making Pizza in a Home Oven", cat: "Cooking", userIdx: 2 },
        { id: "F4s80e1yK7g", title: "Japanese Fluffy Pancakes Recipe", cat: "Cooking", userIdx: 2 },

        // --- LIFESTYLE & VLOGS (Wanderlust) ---
        { id: "Wq_0W5gN2s8", title: "Solo Travel to Japan | 4K", cat: "Lifestyle", userIdx: 3 },
        { id: "ysz5S6PUM-U", title: "My Morning Routine 5:00 AM", cat: "Lifestyle", userIdx: 3 },
        { id: "Domt_222wM0", title: "Van Life: Living on the Road", cat: "Lifestyle", userIdx: 3 },
        { id: "ysz5S6PUM-U", title: "A Day in the Life of a Software Engineer", cat: "Lifestyle", userIdx: 3 },
        { id: "6J6X0g03g58", title: "Packing for a World Trip", cat: "Lifestyle", userIdx: 3 },

        // --- FITNESS (FitLife Pro) ---
        { id: "W4eKBSOnEmY", title: "10 Minute Full Body Workout", cat: "Fitness", userIdx: 6 },
        { id: "UItWltVZZmE", title: "30 Minute Yoga for Beginners", cat: "Fitness", userIdx: 6 },
        { id: "L_xrCn_kR4g", title: "How to Get Abs in 2 Weeks", cat: "Fitness", userIdx: 6 },
        { id: "Is8T8sC_aMs", title: "5 Minute Stretching Routine", cat: "Fitness", userIdx: 6 },

        // --- ENTERTAINMENT (Movie Recap) ---
        { id: "tc9Zba_F_t8", title: "Avengers: Secret Wars - Teaser Trailer", cat: "Entertainment", userIdx: 7 },
        { id: "6ZfuNTqbHE8", title: "Top 10 Movies of 2024", cat: "Entertainment", userIdx: 7 },
        { id: "d9MyW72ELq0", title: "Avatar 3: Everything We Know", cat: "Entertainment", userIdx: 7 },
        { id: "TcMBFSGVi1c", title: "Avengers: Endgame - Portals Scene", cat: "Entertainment", userIdx: 7 }
    ];

    console.log(`Generating ${rawVideos.length} Unique Videos...`);
    
    for (const v of rawVideos) {
        const user = users[v.userIdx];
        const views = Math.floor(Math.random() * 2000000) + 10000;
        
        // Use high-quality thumbnail (hq720 is standard 720p)
        const thumbnail = `https://i.ytimg.com/vi/${v.id}/hq720.jpg`;

        const newVideo = new Video({
            user: user._id,
            channelName: user.username,
            channelAvatar: user.avatar,
            title: v.title,
            description: `Watch ${v.title} on ${user.username}. \n\nDon't forget to like, comment, and subscribe! \n\nCheck out our merch link below.`,
            thumbnailUrl: thumbnail, 
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Safe dummy video for playback
            views: views,
            likes: Math.floor(views * 0.05),
            dislikes: Math.floor(views * 0.001),
            category: v.cat,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
        });
        const savedVideo = await newVideo.save();

        // Add 3-6 random comments per video
        const numComments = Math.floor(Math.random() * 4) + 3;
        for(let j=0; j<numComments; j++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const newComment = new Comment({
                videoId: savedVideo._id,
                userId: randomUser._id,
                text: getRandomComment(),
                userName: randomUser.username,
                userAvatar: randomUser.avatar
            });
            await newComment.save();
        }
    }

    console.log("Database Seeded with 40+ UNIQUE Videos!");
    process.exit();
};

const getRandomComment = () => {
    const comments = [
        "This is exactly what I was looking for!", "Great explanation.", "First!", 
        "Love the quality of this video.", "Subbed!", "Please make more videos like this.",
        "Underrated channel.", "The ending was the best part.", "Can you do a part 2?",
        "Watching this in 2024.", "Notification squad!", "Amazing content as always."
    ];
    return comments[Math.floor(Math.random() * comments.length)];
}

seedDB();