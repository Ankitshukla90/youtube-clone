const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected for Seeding'))
  .catch(err => console.log(err));

const seedDB = async () => {
    // 1. Create a dummy Admin User
    await User.deleteMany({});
    const user = new User({
        name: "YouTube Admin",
        email: "admin@youtube.com",
        password: "hashedpassword123", 
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
    });
    const savedUser = await user.save();

    // 2. Clear existing videos
    await Video.deleteMany({});

    // 3. The Big Data List (Matches PDF Requirements)
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
            category: "Education",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
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
            category: "Music",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
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
            category: "Lifestyle",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 1 week ago
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
            category: "Gaming",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        },
        {
            user: savedUser._id,
            title: "How to Cook the Perfect Steak",
            thumbnailUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            channelName: "Gordon's Kitchen",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chef",
            views: 5500000,
            likes: 34000,
            description: "Master the art of cooking steak at home.",
            category: "Cooking",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
        },
        {
            user: savedUser._id,
            title: "MacBook Pro M3 Review",
            thumbnailUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            channelName: "Tech Reviewer",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
            views: 230000,
            likes: 15000,
            description: "Is the new MacBook Pro worth the upgrade?",
            category: "Technology",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
        },
        {
            user: savedUser._id,
            title: "Funny Cat Compilation 2024",
            thumbnailUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            channelName: "MeowTube",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cat",
            views: 3000000,
            likes: 12000,
            description: "Try not to laugh challenge.",
            category: "Entertainment",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) // 10 days ago
        },
        {
            user: savedUser._id,
            title: "Rain Sounds for Sleep (10 Hours)",
            thumbnailUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            channelName: "Nature Sounds",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rain",
            views: 1200000,
            likes: 8000,
            description: "Relaxing rain sounds for sleep and focus.",
            category: "Music",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) // 1 month ago
        },
         {
            user: savedUser._id,
            title: "Advanced JavaScript Concepts",
            thumbnailUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            channelName: "JS Mastery",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JS",
            views: 45000,
            likes: 2100,
            description: "Closures, Promises, and Async/Await explained.",
            category: "Education",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
        },
        {
            user: savedUser._id,
            title: "SpaceX Starship Launch",
            thumbnailUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            channelName: "Space News",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Space",
            views: 5000000,
            likes: 340000,
            description: "Live coverage of the Starship launch.",
            category: "Technology",
            createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
        },
        {
            user: savedUser._id,
            title: "Minimalist Desk Setup Tour",
            thumbnailUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            channelName: "Tech Lifestyle",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Desk",
            views: 150000,
            likes: 6700,
            description: "My productivity setup for 2024.",
            category: "Lifestyle",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) // 2 weeks ago
        },
        {
            user: savedUser._id,
            title: "Minecraft Survival Ep. 1",
            thumbnailUrl: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            channelName: "Gamer Steve",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Steve",
            views: 890000,
            likes: 45000,
            description: "Starting a new survival world in Minecraft 1.21.",
            category: "Gaming",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6) // 6 days ago
        }
    ];

    await Video.insertMany(videos);
    console.log("Database Seeded Successfully with 12 Videos!");
    process.exit();
};

seedDB();