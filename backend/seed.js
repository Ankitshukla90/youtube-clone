const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Video = require('./models/Video');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected for Seeding'))
  .catch(err => console.log(err));

const seedDB = async () => {
    // 1. Create a dummy user
    await User.deleteMany({});
    const user = new User({
        name: "Admin Channel",
        email: "admin@youtube.com",
        password: "hashedpassword123", // In real app use bcrypt
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
    });
    const savedUser = await user.save();

    // 2. Create Videos with HTTPS links (Fixes the playback issue)
    const videos = [
        {
            user: savedUser._id,
            title: "Big Buck Bunny - 4K Animation",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            channelName: "Blender Foundation",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Blender",
            views: 150000,
            likes: 4500,
            description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself.",
            category: "Animation"
        },
        {
            user: savedUser._id,
            title: "Elephants Dream",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/800px-Elephants_Dream_s5_both.jpg",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            channelName: "Open Movie Project",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Open",
            views: 89000,
            likes: 1200,
            description: "The world's first open movie, made entirely with open source graphics software.",
            category: "Technology"
        },
        {
            user: savedUser._id,
            title: "Sintel - Third Open Movie",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/800px-Sintel_poster.jpg",
            videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            channelName: "Blender Institute",
            channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sintel",
            views: 2300000,
            likes: 56000,
            description: "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales.",
            category: "Animation"
        }
    ];

    await Video.deleteMany({});
    await Video.insertMany(videos);
    console.log("Database Seeded Successfully!");
    process.exit();
};

seedDB();