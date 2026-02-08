import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, User } from 'lucide-react';

const VideoPlayer = ({ video, comments, onAddComment, onDeleteComment, currentUser, relatedVideos, onVideoSelect }) => {
  const [newComment, setNewComment] = useState("");
  const currentComments = comments.filter(c => c.videoId === video.id);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(video.id, newComment);
    setNewComment("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto">
      <div className="flex-1">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-lg">
          <video src={video.videoUrl} poster={video.thumbnail} className="w-full h-full" controls autoPlay />
        </div>
        
        {/* Title & Channel Info */}
        <h1 className="text-xl font-bold mb-2">{video.title}</h1>
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <img src={video.channelAvatar} className="w-10 h-10 rounded-full"/>
                <div>
                    <h3 className="font-bold text-sm">{video.channelName}</h3>
                    <p className="text-xs text-gray-500">1.2M subscribers</p>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 ml-4">
                    Subscribe
                </button>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-full">
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-200 rounded-l-full border-r border-gray-300 text-sm font-bold"><ThumbsUp size={16}/> {video.likes}</button>
                    <button className="px-3 py-2 hover:bg-gray-200 rounded-r-full"><ThumbsDown size={16}/></button>
                </div>
                <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 text-sm font-bold"><Share2 size={16}/> Share</button>
            </div>
        </div>

        {/* Description */}
        <div className="bg-gray-100 rounded-xl p-3 text-sm mb-6">
            <div className="font-bold mb-1">{video.views} views • {video.postedAt}</div>
            <p className="whitespace-pre-wrap">{video.description}</p>
        </div>

        {/* Comments Section */}
        <div>
            <h3 className="font-bold text-xl mb-6">{currentComments.length} Comments</h3>
            
            {/* Add Comment */}
            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                    {currentUser ? currentUser.name[0] : <User size={20} />}
                </div>
                <div className="flex-1">
                    {currentUser ? (
                        <form onSubmit={handleCommentSubmit}>
                            <input 
                                className="w-full border-b border-gray-200 py-1 focus:border-black focus:outline-none" 
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setNewComment("")} className="px-4 py-2 hover:bg-gray-100 rounded-full text-sm">Cancel</button>
                                <button type="submit" disabled={!newComment.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm disabled:bg-gray-200 disabled:text-gray-500">Comment</button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-500 py-2">Please sign in to add a comment.</p>
                    )}
                </div>
            </div>

            {/* List Comments */}
            <div className="space-y-6">
                {currentComments.map(c => (
                    <div key={c.id} className="flex gap-4">
                        <img src={c.userAvatar} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">@{c.userName}</span>
                                <span className="text-xs text-gray-500">{c.timestamp}</span>
                            </div>
                            <p className="text-sm mb-2">{c.text}</p>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1 text-xs text-gray-600"><ThumbsUp size={14}/></button>
                                <button className="flex items-center gap-1 text-xs text-gray-600"><ThumbsDown size={14}/></button>
                                <button className="text-xs text-gray-600 font-medium">Reply</button>
                                {currentUser && currentUser.id === c.userId && (
                                    <button onClick={() => onDeleteComment(c.id)} className="text-xs text-red-600 font-medium ml-auto">Delete</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Sidebar Recommendations */}
      <div className="lg:w-[350px] shrink-0">
        <h3 className="font-bold mb-4 hidden lg:block">Up Next</h3>
        {relatedVideos.map(v => (
            <div key={v.id} className="flex gap-2 mb-3 cursor-pointer group" onClick={() => onVideoSelect(v)}>
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0">
                    <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">{v.duration}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-blue-600">{v.title}</h4>
                    <p className="text-xs text-gray-500">{v.channelName}</p>
                    <p className="text-xs text-gray-500">{v.views} views</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
export default VideoPlayer;
