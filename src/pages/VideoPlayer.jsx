import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share2, User } from 'lucide-react';

const VideoPlayer = ({ video, currentUser, relatedVideos, onVideoSelect }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 1. FETCH COMMENTS WHEN VIDEO LOADS
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comments/${video._id}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };
    fetchComments();
  }, [video._id]);

  // 2. ADD COMMENT TO BACKEND
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    const commentData = {
      videoId: video._id,
      userId: currentUser._id || currentUser.id, // Handle both formats
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: newComment
    };

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      });
      const savedComment = await res.json();
      setComments([savedComment, ...comments]); // Update UI instantly
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // 3. DELETE COMMENT FROM BACKEND
  const handleDeleteComment = async (commentId) => {
    try {
      await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE'
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto">
      <div className="flex-1">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-lg">
          <video src={video.videoUrl} poster={video.thumbnailUrl} className="w-full h-full" controls autoPlay />
        </div>
        
        <h1 className="text-xl font-bold mb-2">{video.title}</h1>
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                <img src={video.channelAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Channel"} className="w-10 h-10 rounded-full"/>
                <div>
                    <h3 className="font-bold text-sm">{video.channelName}</h3>
                    <p className="text-xs text-gray-500">{video.views} views</p>
                </div>
            </div>
            <div className="flex gap-2">
                 <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm font-bold"><ThumbsUp size={16}/> {video.likes}</button>
                 <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm font-bold"><Share2 size={16}/> Share</button>
            </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-3 text-sm mb-6">
            <p className="whitespace-pre-wrap">{video.description}</p>
        </div>

        {/* COMMENTS SECTION */}
        <div>
            <h3 className="font-bold text-xl mb-6">{comments.length} Comments</h3>
            
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
                                <button type="submit" disabled={!newComment.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm disabled:bg-gray-200">Comment</button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-500 py-2">Please sign in to add a comment.</p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {comments.map(c => (
                    <div key={c._id} className="flex gap-4">
                        <img src={c.userAvatar} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">@{c.userName}</span>
                                <span className="text-xs text-gray-500">Just now</span>
                            </div>
                            <p className="text-sm mb-2">{c.text}</p>
                            
                            {/* Only show Delete if Current User owns the comment */}
                            {currentUser && (currentUser._id === c.userId || currentUser.id === c.userId) && (
                                <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-red-600 font-medium">Delete</button>
                            )}
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
            <div key={v._id} className="flex gap-2 mb-3 cursor-pointer group" onClick={() => onVideoSelect(v)}>
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0">
                    <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">{v.duration || "10:00"}</span>
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