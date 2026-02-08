import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import Channel from './pages/Channel'; 

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All"); // Shared State
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSidebarNavigate = (id) => {
    // 1. Handle Categories (Explore)
    const categories = ["trending", "music", "gaming", "sports", "technology", "education"];
    if (categories.includes(id)) {
        // Capitalize first letter (e.g., "gaming" -> "Gaming")
        const catName = id.charAt(0).toUpperCase() + id.slice(1);
        setActiveCategory(catName);
        navigate('/');
        return;
    }

    // 2. Handle Specific Pages
    switch(id) {
        case 'home':
            setActiveCategory("All");
            navigate('/');
            break;
        case 'shorts':
            // Just reset to All for now (Simulated)
            setActiveCategory("All");
            navigate('/');
            break;
        case 'channel':
        case 'library':
            if(!currentUser) navigate('/login');
            else navigate(`/channel/${currentUser._id}`);
            break;
        case 'history':
        case 'liked':
        case 'watch_later':
        case 'subs':
            // Check auth, then redirect home nicely
            if(!currentUser) navigate('/login');
            else {
                setActiveCategory("All"); 
                navigate('/'); 
            }
            break;
        default:
            navigate('/');
    }
    
    // Close sidebar on mobile after click
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    navigate('/');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const showSidebar = location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-900 font-sans">
      {showSidebar && (
        <Navbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onLoginClick={() => navigate('/login')}
          onLogout={handleLogout}
          onLogoClick={() => { setActiveCategory("All"); navigate('/'); }}
        />
      )}

      <div className="flex">
        {showSidebar && (
            <Sidebar 
                isOpen={isSidebarOpen} 
                onNavigate={handleSidebarNavigate} 
            />
        )}

        <main className={`flex-1 ${showSidebar ? (isSidebarOpen ? 'md:ml-60' : 'md:ml-[72px]') : ''} pt-14 transition-all duration-200`}>
          <Routes>
            <Route path="/" element={
                <Home 
                    searchQuery={searchQuery} 
                    activeCategory={activeCategory} 
                    setActiveCategory={setActiveCategory}
                />
            } />
            <Route path="/login" element={<Login onLogin={handleLogin} onCancel={() => navigate('/')} />} />
            <Route path="/video/:id" element={<VideoPlayer currentUser={currentUser} />} />
            <Route path="/channel/:userId" element={<Channel currentUser={currentUser} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;