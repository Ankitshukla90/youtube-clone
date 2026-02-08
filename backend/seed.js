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
    // 1. CLEANUP
    await User.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});

    console.log("Creating Channels...");

    // 2. CREATE CHANNELS (Real-world archetypes)
    const channels = [
        { name: "Marques Brownlee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MKBHD" },
        { name: "Lofi Girl", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lofi" },
        { name: "MrBeast Gaming", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beast" },
        { name: "Gordon Ramsay", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gordon" },
        { name: "Veritasium", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Science" },
        { name: "FreeCodeCamp", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Code" },
        { name: "Dude Perfect", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sports" },
        { name: "Marvel Entertainment", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marvel" }
    ];

    const users = [];
    for (const ch of channels) {
        const newUser = new User({
            username: ch.name,
            email: `${ch.name.replace(/\s+/g, '').toLowerCase()}@gmail.com`,
            password: "hashedpassword123",
            avatar: ch.avatar,
            subscribers: Math.floor(Math.random() * 5000000) + 100000
        });
        const savedUser = await newUser.save();
        users.push(savedUser);
    }

    // 3. REAL VIDEO DATA MAP
    // We map specific categories to specific users for realism
    const videoData = [
        // TECHNOLOGY (Marques Brownlee - Index 0)
        { id: "0J2L4tJgXQc", title: "Samsung Galaxy S24 Ultra Review", cat: "Technology", u: 0 },
        { id: "uXP0fS_rDKQ", title: "MacBook Air M3 Review", cat: "Technology", u: 0 },
        { id: "788E_8xGLLo", title: "The Rabbit R1: Barely Reviewable", cat: "Technology", u: 0 },
        { id: "IX8j7mo-42Q", title: "Apple Vision Pro Review", cat: "Technology", u: 0 },
        { id: "s_P8z6d3hQc", title: "Google Pixel 9 Pro Review", cat: "Technology", u: 0 },
        
        // MUSIC (Lofi Girl - Index 1)
        { id: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax/study to", cat: "Music", u: 1 },
        { id: "5qap5aO4i9A", title: "lofi hip hop radio - beats to sleep/chill to", cat: "Music", u: 1 },
        { id: "mPZkdNFkNps", title: "Relaxing Rain Sounds for Sleep", cat: "Music", u: 1 },
        { id: "lTRiuFIWV54", title: "Jazz Music for Work and Concentration", cat: "Music", u: 1 },
        { id: "DWcJFNfaw9c", title: "Ambient Study Music To Concentrate", cat: "Music", u: 1 },

        // GAMING (MrBeast Gaming - Index 2)
        { id: "0e3GPea1Tyg", title: "$10,000 Every Day You Survive In A Grocery Store", cat: "Gaming", u: 2 },
        { id: "QdBZY2fkU-0", title: "Grand Theft Auto VI Trailer 1", cat: "Gaming", u: 2 },
        { id: "K_03kFqWfqs", title: "Elden Ring: Shadow of the Erdtree Trailer", cat: "Gaming", u: 2 },
        { id: "GC5H3s5_d1g", title: "Minecraft 1.21 Update Guide", cat: "Gaming", u: 2 },
        { id: "H4bn_Q5K0kU", title: "I Built A 100 Layer Wall In Minecraft!", cat: "Gaming", u: 2 },
        { id: "Calc_d6d8H0", title: "Valorant New Agent Gameplay", cat: "Gaming", u: 2 },

        // COOKING (Gordon Ramsay - Index 3)
        { id: "2sX4fCggtWs", title: "Gordon Ramsay's Ultimate Burger", cat: "Cooking", u: 3 },
        { id: "P2wP88a1e8Q", title: "The Perfect Steak", cat: "Cooking", u: 3 },
        { id: "1-SJGQ2HLp8", title: "How to Make Pasta from Scratch", cat: "Cooking", u: 3 },
        { id: "j6XjWzJ8W7Q", title: "5 Minute Breakfast Ideas", cat: "Cooking", u: 3 },
        { id: "F4s80e1yK7g", title: "Fluffy Japanese Pancakes", cat: "Cooking", u: 3 },

        // EDUCATION (Veritasium - Index 4)
        { id: "4b19wY94V-4", title: "The Simplest Math Problem No One Can Solve", cat: "Education", u: 4 },
        { id: "0jHsq36_NTU", title: "Why Are 96,000,000 Black Balls on This Reservoir?", cat: "Education", u: 4 },
        { id: "bMknfKXIFA8", title: "React Course - Beginner's Tutorial", cat: "Education", u: 5 }, // FreeCodeCamp
        { id: "PkZNo7MFNFg", title: "Learn JavaScript - Full Course", cat: "Education", u: 5 },
        { id: "G3e-cpL7ofc", title: "HTML & CSS Full Course", cat: "Education", u: 5 },

        // SPORTS (Dude Perfect - Index 6)
        { id: "h152X757b7k", title: "Real Life Trick Shots 3", cat: "Sports", u: 6 },
        { id: "6ZfuNTqbHE8", title: "Top 10 Sports Moments 2024", cat: "Sports", u: 6 },
        { id: "W4eKBSOnEmY", title: "10 Minute Full Body Workout", cat: "Sports", u: 6 },
        { id: "UItWltVZZmE", title: "Yoga For Complete Beginners", cat: "Sports", u: 6 },

        // ENTERTAINMENT (Marvel - Index 7)
        { id: "TcMBFSGVi1c", title: "Avengers: Endgame - Portals Scene", cat: "Entertainment", u: 7 },
        { id: "1pHDWnXmK7Y", title: "Deadpool & Wolverine | Official Trailer", cat: "Entertainment", u: 7 },
        { id: "d9MyW72ELq0", title: "Avatar: The Way of Water Trailer", cat: "Entertainment", u: 7 },
        { id: "8Qn_spdM5Zg", title: "Star Wars: The Acolyte Trailer", cat: "Entertainment", u: 7 }
    ];

    console.log("Seeding Videos...");

    for (const v of videoData) {
        const user = users[v.u];
        const views = Math.floor(Math.random() * 5000000) + 10000;
        
        const newVideo = new Video({
            user: user._id,
            channelName: user.username,
            channelAvatar: user.avatar,
            title: v.title,
            description: `Check out this amazing video: ${v.title}. \n\nDon't forget to subscribe to ${user.username}!`,
            thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hq720.jpg`, // High Quality Real Thumbnail
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            views: views,
            likes: Math.floor(views * 0.05),
            dislikes: Math.floor(views * 0.001),
            category: v.cat,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
        });
        const savedVideo = await newVideo.save();

        // Add 5 comments per video
        for(let j=0; j<5; j++) {
            const commenter = users[Math.floor(Math.random() * users.length)];
            await new Comment({
                videoId: savedVideo._id,
                userId: commenter._id,
                text: ["Amazing content!", "First!", "Love this channel", "Great quality", "Subbed"][j],
                userName: commenter.username,
                userAvatar: commenter.avatar
            }).save();
        }
    }

    console.log(`Database Seeded with ${videoData.length} Unique Videos!`);
    process.exit();
};

seedDB();