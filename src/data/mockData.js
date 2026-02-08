export const SAMPLE_USER = {
  id: "user_001",
  name: "Demo User",
  email: "demo@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
};

// We are using HTTPS links here. HTTP links will fail in modern browsers.
export const SAMPLE_VIDEOS = [
  {
    id: "v1",
    title: "Big Buck Bunny - Animated Short",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    channelName: "Blender Foundation",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Blender",
    views: "1.5M",
    postedAt: "2 years ago",
    duration: "10:34",
    category: "Education",
    description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself.",
    likes: 15000,
    dislikes: 200
  },
  {
    id: "v2",
    title: "Elephants Dream",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/800px-Elephants_Dream_s5_both.jpg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    channelName: "Open Movie Project",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Open",
    views: "800K",
    postedAt: "5 years ago",
    duration: "10:53",
    category: "Gaming",
    description: "The world's first open movie, made entirely with open source graphics software such as Blender.",
    likes: 8500,
    dislikes: 120
  },
  {
    id: "v3",
    title: "For Bigger Blazes",
    thumbnail: "https://picsum.photos/id/1018/800/450", 
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    channelName: "Tech Insider",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
    views: "450K",
    postedAt: "3 months ago",
    duration: "0:15",
    category: "Technology",
    description: "A demonstration of high contrast video playback.",
    likes: 4500,
    dislikes: 23
  },
  {
    id: "v4",
    title: "Nature: Sintel",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sintel_poster.jpg/800px-Sintel_poster.jpg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    channelName: "Nature Channel",
    channelAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nature",
    views: "2.1M",
    postedAt: "1 year ago",
    duration: "14:48",
    category: "Lifestyle",
    description: "A lonely young woman, Sintel, helps and befriends a dragon.",
    likes: 56000,
    dislikes: 400
  }
];

export const SAMPLE_COMMENTS = [
  { 
    id: "c1", 
    userId: "u2", 
    userName: "Alice Dev", 
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", 
    text: "The animation quality is insane for an open source project!", 
    timestamp: "2 hours ago", 
    videoId: "v1" 
  },
];