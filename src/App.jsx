import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GoogleLogin from './components/GoogleLogin';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import { SAMPLE_VIDEOS, SAMPLE_COMMENTS } from './data/mockData';

function App() {
  const [view, setView] = useState("home"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  
  // Simulated Database State
  const [videos, setVideos] = useState(SAMPLE_VIDEOS);
  const [comments, setComments] = useState(SAMPLE_COMMENTS);

  // Filter Logic
  useEffect(() => {
    let filtered = SAMPLE_VIDEOS;
    if (activeCategory !== "All") {
        filtered = filtered.filter(v => v.category === activeCategory);
    }
    if (searchQuery) {
        filtered = filtered.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setVideos(filtered);
  }, [activeCategory, searchQuery]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setView("home");
  };

  const handleVideoClick = (video) => {
    setActiveVideo(video);
    setView("watch");
    window.scrollTo(0, 0);
  };

  // CRUD for Comments
  const addComment = (videoId, text) => {
    const newComm = {
      id: "c" + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: text,
      timestamp: "Just now",
      videoId: videoId
    };
    setComments([newComm, ...comments]);
  };

  const deleteComment = (commentId) => {
    setComments(comments.filter(c => c.id !== commentId));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onLoginClick={() => setView("login")}
        onLogout={() => setCurrentUser(null)}
      />

      {view === "login" && <GoogleLogin onLogin={handleLogin} onCancel={() => setView("home")} />}

      <div className={`pt-14 transition-all duration-200 ${view === "watch" ? "" : isSidebarOpen ? "md:pl-60" : "md:pl-[72px]"}`}>
        
        {view === "home" && (
          <>
            <Sidebar isOpen={isSidebarOpen} />
            <Home 
                videos={videos} 
                onVideoClick={handleVideoClick} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory}
            />
          </>
        )}

        {view === "watch" && activeVideo && (
          <VideoPlayer 
            video={activeVideo} 
            comments={comments}
            currentUser={currentUser}
            onAddComment={addComment}
            onDeleteComment={deleteComment}
            relatedVideos={videos.filter(v => v.id !== activeVideo.id)}
            onVideoSelect={handleVideoClick}
          />
        )}
      </div>
    </div>
  );
}

export default App;