import React from 'react';
import { Menu, Search, Mic, Video, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar, searchQuery, setSearchQuery, currentUser, onLoginClick, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center justify-between px-4 z-50 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-full">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="text-red-600">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tighter hidden sm:block font-sans">YouTube</span>
        </div>
      </div>

      <div className="hidden sm:flex flex-1 max-w-2xl mx-4 items-center gap-4">
        <div className="flex flex-1 items-center">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full h-10 px-4 border border-gray-300 rounded-l-full focus:border-blue-500 focus:outline-none focus:shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="h-10 px-6 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200">
            <Search size={20} className="text-gray-600" />
          </button>
        </div>
        <button className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200">
          <Mic size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full hidden sm:block"><Video size={22} /></button>
        <button className="p-2 hover:bg-gray-100 rounded-full hidden sm:block"><Bell size={22} /></button>
        
        {currentUser ? (
          <img 
            src={currentUser.avatar} 
            alt="User" 
            className="w-8 h-8 rounded-full cursor-pointer" 
            onClick={onLogout}
            title="Logout"
          />
        ) : (
          <button 
            onClick={onLoginClick}
            className="flex items-center gap-2 text-blue-600 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:border-blue-200 text-sm font-medium"
          >
            <div className="border border-blue-600 rounded-full p-0.5"><User size={16} fill="currentColor" /></div>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};
export default Navbar;
