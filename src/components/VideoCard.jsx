import React from 'react';

const VideoCard = ({ video, onClick }) => {
  return (
    <div className="cursor-pointer group" onClick={() => onClick(video)}>
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      <div className="flex gap-3 px-1">
        <img src={video.channelAvatar} alt={video.channelName} className="w-9 h-9 rounded-full mt-1 flex-shrink-0"/>
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 mb-1 group-hover:text-blue-900">
            {video.title}
          </h3>
          <p className="text-sm text-gray-500 hover:text-gray-800">{video.channelName}</p>
          <div className="text-sm text-gray-500">
            <span>{video.views} views</span>
            <span className="mx-1">•</span>
            <span>{video.postedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoCard;
