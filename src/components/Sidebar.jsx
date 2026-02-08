import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const sidebarItems = [
    { icon: <Home size={22} />, label: "Home" },
    { icon: <Compass size={22} />, label: "Explore" },
    { icon: <PlaySquare size={22} />, label: "Subscriptions" },
    { icon: <Clock size={22} />, label: "History" },
    { icon: <ThumbsUp size={22} />, label: "Liked videos" },
  ];

  const baseClasses = "fixed left-0 top-14 h-[calc(100vh-56px)] bg-white overflow-y-auto transition-all duration-200 ease-in-out z-20 pb-4 border-r border-gray-100 md:border-none";
  const widthClass = isOpen ? "w-60" : "w-[72px]";
  const hiddenOnMobile = isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0";

  return (
    <aside className={`${baseClasses} ${widthClass} ${hiddenOnMobile}`}>
      <div className="p-2">
        {sidebarItems.map((item, idx) => (
          <button
            key={idx}
            className={`flex items-center w-full p-2.5 rounded-lg hover:bg-gray-100 mb-1 ${!isOpen ? "flex-col gap-1 justify-center px-1" : "gap-5"}`}
          >
            {item.icon}
            <span className={`text-sm ${!isOpen ? "text-[10px]" : ""}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};
export default Sidebar;
