import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
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
    fetch('http://localhost:5000/api/videos').then(res => res.json()).then(data => setVideos(data)).catch(err => console.error(err));
  }, [view]);

  const filteredVideos = videos.filter(v => {
    const matchesCategory = activeCategory === "All" || v.category === activeCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLogin = (user) => { setCurrentUser(user); setView("home"); };
  const handleNavClick = (page) => { if (page === "channel" && !currentUser) { setView("login"); return; } setView(page); setActiveVideo(null); };

  if (view === "login") { return <Login onLogin={handleLogin} />; }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} currentUser={currentUser} onLoginClick={() => setView("login")} onLogout={() => { setCurrentUser(null); setView("home"); }} onLogoClick={() => { setView("home"); setActiveVideo(null); }} />
      <div className={`pt-14 transition-all duration-200 ${view === "watch" ? "" : isSidebarOpen ? "md:pl-60" : "md:pl-[72px]"}`}>
        {view === "home" && (<> <Sidebar isOpen={isSidebarOpen} onNavigate={handleNavClick} /> <Home videos={filteredVideos} onVideoClick={(v) => { setActiveVideo(v); setView("watch"); }} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/> </>)}
        {view === "watch" && activeVideo && (<VideoPlayer video={activeVideo} currentUser={currentUser} onVideoSelect={(v) => { setActiveVideo(v); window.scrollTo(0,0); }} relatedVideos={videos.filter(v => v._id !== activeVideo._id)} />)}
        {view === "channel" && (<> <Sidebar isOpen={isSidebarOpen} onNavigate={handleNavClick} /> <Channel currentUser={currentUser} /> </>)}
      </div>
    </div>
  );
}
export default App;