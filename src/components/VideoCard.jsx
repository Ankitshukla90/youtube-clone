import React from 'react';

const VideoCard = ({ video, onClick }) => {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + " years ago";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + " months ago";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + " days ago";
    return "Just now";
  };

  const formatViews = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="cursor-pointer group flex flex-col gap-2" onClick={() => onClick(video)}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" onError={(e) => { e.target.src = "https://via.placeholder.com/640x360?text=Video"; }} />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">12:45</div>
      </div>
      <div className="flex gap-3 px-0.5">
        <img src={video.channelAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"} alt={video.channelName} className="w-9 h-9 rounded-full mt-0.5 flex-shrink-0 bg-gray-100" />
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 mb-1 group-hover:text-blue-900">{video.title}</h3>
          <p className="text-sm text-gray-500 hover:text-gray-800 transition-colors">{video.channelName}</p>
          <div className="text-sm text-gray-500"><span>{formatViews(video.views)} views</span><span className="mx-1">•</span><span>{formatTimeAgo(video.createdAt)}</span></div>
        </div>
      </div>
    </div>
  );
};
export default VideoCard;