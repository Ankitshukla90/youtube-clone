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
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Sidebar on Login Page
  const showSidebar = location.pathname !== '/login';

  const handleLogin = (user) => {
    setCurrentUser(user);
    navigate('/');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-900 font-sans">
      {location.pathname !== '/login' && (
        <Navbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onLoginClick={() => navigate('/login')}
          onLogout={handleLogout}
          onLogoClick={() => navigate('/')}
        />
      )}

      <div className="flex">
        {showSidebar && (
            <Sidebar 
                isOpen={isSidebarOpen} 
                onNavigate={(path) => {
                    if (path === 'channel') {
                        if(!currentUser) navigate('/login');
                        else navigate(`/channel/${currentUser._id}`);
                    } else if (path === 'home') {
                        navigate('/');
                    } else {
                        navigate('/');
                    }
                }} 
            />
        )}

        <main className={`flex-1 ${showSidebar ? (isSidebarOpen ? 'md:ml-60' : 'md:ml-[72px]') : ''} pt-14 transition-all duration-200`}>
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
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