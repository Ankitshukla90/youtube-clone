import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import GoogleLogin from './components/GoogleLogin';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Channel from './pages/Channel'; 

function App() {
  const [view, setView] = useState("home"); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/videos');
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, [view]); 

  const filteredVideos = videos.filter(v => {
    const matchesCategory = activeCategory === "All" || v.category === activeCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    setView("home"); 
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("home");
  };

  const handleVideoClick = (video) => {
    setActiveVideo(video);
    setView("watch");
    window.scrollTo(0, 0);
  };

  const handleNavClick = (page) => {
    if (page === "channel" && !currentUser) {
        setView("login");
        return;
    }
    
    // Simple routing logic
    if (page === "home") {
        setView("home");
        setActiveVideo(null);
    } else if (page === "channel") {
        setView("channel");
        setActiveVideo(null);
    } else {
        // For other placeholder sidebar items
        alert(`${page} page not implemented in this prototype`);
    }
    
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  };

  // NEW: Handle Logo Click
  const handleLogoClick = () => {
      setView("home");
      setActiveVideo(null);
      setActiveCategory("All");
      setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onLoginClick={() => setView("login")}
        onLogout={handleLogout}
        onLogoClick={handleLogoClick} // <--- Passed here
      />

      {view === "login" && <GoogleLogin onLogin={handleLogin} onCancel={() => setView("home")} />}

      <div className={`pt-14 transition-all duration-200 ${view === "watch" ? "" : isSidebarOpen ? "md:pl-60" : "md:pl-[72px]"}`}>
        
        {view === "home" && (
          <>
            <Sidebar isOpen={isSidebarOpen} onNavigate={handleNavClick} />
            <Home 
                videos={filteredVideos} 
                onVideoClick={handleVideoClick} 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory}
            />
          </>
        )}

        {view === "watch" && activeVideo && (
          <VideoPlayer 
            video={activeVideo} 
            currentUser={currentUser}
            onVideoSelect={handleVideoClick}
            relatedVideos={videos.filter(v => v._id !== activeVideo._id)}
          />
        )}

        {view === "channel" && (
            <>
                <Sidebar isOpen={isSidebarOpen} onNavigate={handleNavClick} />
                <Channel currentUser={currentUser} />
            </>
        )}
      </div>
    </div>
  );
}

export default App;