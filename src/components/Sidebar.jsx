import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, User, Flame, Music2, Gamepad2, Trophy, Library, Radio, Clapperboard, History, Lightbulb, Smartphone } from 'lucide-react';

const Sidebar = ({ isOpen, onNavigate }) => {
  
  const mainItems = [
    { icon: <Home size={22} />, label: "Home", id: "home" },
    { icon: <Radio size={22} />, label: "Shorts", id: "shorts" },
    { icon: <Clapperboard size={22} />, label: "Subscriptions", id: "subs" },
  ];

  const yourItems = [
    { icon: <User size={22} />, label: "Your Channel", id: "channel" },
    { icon: <History size={22} />, label: "History", id: "history" },
    { icon: <Library size={22} />, label: "Your Videos", id: "channel" },
    { icon: <Clock size={22} />, label: "Watch Later", id: "watch_later" },
    { icon: <ThumbsUp size={22} />, label: "Liked Videos", id: "liked" },
  ];

  const exploreItems = [
    { icon: <Flame size={22} />, label: "Trending", id: "trending" },
    { icon: <Music2 size={22} />, label: "Music", id: "music" },
    { icon: <Gamepad2 size={22} />, label: "Gaming", id: "gaming" },
    { icon: <Trophy size={22} />, label: "Sports", id: "sports" },
    { icon: <Smartphone size={22} />, label: "Technology", id: "technology" },
    { icon: <Lightbulb size={22} />, label: "Education", id: "education" },
  ];

  const baseClasses = "fixed left-0 top-14 h-[calc(100vh-56px)] bg-white overflow-y-auto transition-all duration-200 ease-in-out z-20 pb-4 border-r border-gray-100 md:border-none scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400";
  const widthClass = isOpen ? "w-60 px-3" : "w-[72px] px-1";
  const hiddenOnMobile = isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0";

  const renderSection = (items, title) => (
    <>
      {isOpen && title && <h3 className="px-3 py-2 text-base font-bold text-gray-900 mt-2">{title}</h3>}
      {items.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onNavigate(item.id)}
          className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-100 mb-1 group ${
            !isOpen ? "flex-col gap-1 justify-center py-4" : "gap-5"
          }`}
          title={!isOpen ? item.label : ""}
        >
          <div className="text-gray-900">{item.icon}</div>
          <span className={`text-sm text-gray-900 ${!isOpen ? "text-[10px] text-center" : "truncate"}`}>
            {item.label}
          </span>
        </button>
      ))}
      {isOpen && <hr className="my-3 border-gray-200 mx-2" />}
    </>
  );

  return (
    <aside className={`${baseClasses} ${widthClass} ${hiddenOnMobile}`}>
      <div className="pt-2">
        {renderSection(mainItems)}
        
        {isOpen ? renderSection(yourItems, "You") : (
           <button onClick={() => onNavigate('channel')} className="flex flex-col gap-1 justify-center items-center w-full py-4 rounded-lg hover:bg-gray-100">
              <Library size={22}/>
              <span className="text-[10px]">You</span>
           </button>
        )}

        {isOpen && renderSection(exploreItems, "Explore")}
        
        {isOpen && (
          <div className="px-4 py-4 text-[12px] text-gray-500 font-semibold">
            <p className="mb-2">About Press Copyright Contact us Creators Advertise Developers</p>
            <p className="mb-2">Terms Privacy Policy & Safety How YouTube works Test new features</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="font-normal text-gray-500">Made by <span className="font-bold text-gray-800">Ankit Shukla</span></p>
                <p className="font-normal text-gray-400 mt-1">© 2024 YouTube Clone</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;