import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share2, User, Edit2, Trash2, Save, X, Bell, MoreHorizontal } from 'lucide-react';

const VideoPlayer = ({ video, currentUser, relatedVideos, onVideoSelect }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [likes, setLikes] = useState(video.likes);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 1. FETCH COMMENTS & RESET STATE WHEN VIDEO CHANGES
  useEffect(() => {
    // Fetch comments for this specific video
    fetch(`http://localhost:5000/api/comments/${video._id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Error fetching comments:", err));

    setLikes(video.likes);
    setIsSubscribed(false); // Reset subscription state for new video
    window.scrollTo(0, 0);
  }, [video._id]);

  // 2. HANDLE LIKE BUTTON
  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/videos/like/${video._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'like' })
      });
      const updatedVideo = await res.json();
      setLikes(updatedVideo.likes);
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  // 3. HANDLE SUBSCRIBE TOGGLE
  const toggleSubscribe = () => {
    if (!currentUser) {
        alert("Please sign in to subscribe.");
        return;
    }
    setIsSubscribed(!isSubscribed);
  };

  // 4. ADD NEW COMMENT (CREATE)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      const res = await fetch('http://localhost:5000/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: video._id,
          userId: currentUser._id,
          userName: currentUser.username || currentUser.name,
          userAvatar: currentUser.avatar,
          text: newComment
        })
      });
      const savedComment = await res.json();
      setComments([savedComment, ...comments]); // Add new comment to top
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // 5. DELETE COMMENT (DELETE)
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this comment?")) return;
    try {
      await fetch(`http://localhost:5000/api/comments/${id}`, { method: 'DELETE' });
      setComments(comments.filter(c => c._id !== id));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // 6. EDIT COMMENT (UPDATE)
  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: editText })
      });
      const updatedComment = await res.json();
      
      // Update the specific comment in the list
      setComments(comments.map(c => c._id === id ? updatedComment : c));
      setEditingCommentId(null);
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto bg-[#f9f9f9]">
      {/* LEFT SIDE: PLAYER & COMMENTS */}
      <div className="flex-1">
        
        {/* VIDEO PLAYER */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-lg">
          <video 
            src={video.videoUrl} 
            poster={video.thumbnailUrl} 
            className="w-full h-full" 
            controls 
            autoPlay
          >
            Your browser does not support video playback.
          </video>
        </div>
        
        {/* VIDEO TITLE */}
        <h1 className="text-xl font-bold mb-2 text-gray-900">{video.title}</h1>
        
        {/* CHANNEL INFO & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
                <img src={video.channelAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"} className="w-10 h-10 rounded-full cursor-pointer bg-gray-200"/>
                <div className="mr-4">
                    <h3 className="font-bold text-base cursor-pointer hover:text-gray-700">{video.channelName}</h3>
                    <p className="text-xs text-gray-500">{Math.floor(video.views / 50)} subscribers</p>
                </div>
                
                <button 
                    onClick={toggleSubscribe}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                        isSubscribed 
                        ? "bg-gray-100 text-black hover:bg-gray-200 border border-gray-200" 
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                >
                    {isSubscribed ? <><Bell size={16}/> Subscribed</> : "Subscribe"}
                </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                 <div className="flex items-center bg-gray-100 rounded-full h-9 border border-gray-200">
                    <button onClick={handleLike} className="flex items-center gap-2 px-3 h-full hover:bg-gray-200 rounded-l-full text-sm font-medium border-r border-gray-300">
                        <ThumbsUp size={16}/> {likes}
                    </button>
                    <button className="px-3 h-full hover:bg-gray-200 rounded-r-full">
                        <ThumbsDown size={16}/>
                    </button>
                 </div>
                 <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-200 h-9 border border-gray-200">
                    <Share2 size={16}/> Share
                 </button>
            </div>
        </div>

        {/* DESCRIPTION BOX */}
        <div className="bg-gray-100 rounded-xl p-3 text-sm mb-6 hover:bg-gray-200 cursor-pointer transition-colors">
            <div className="font-bold mb-1">{video.views.toLocaleString()} views • 2 weeks ago</div>
            <p className="whitespace-pre-wrap text-gray-800">{video.description}</p>
        </div>

        {/* COMMENTS SECTION */}
        <div>
            <h3 className="font-bold text-xl mb-6">{comments.length} Comments</h3>
            
            {/* ADD COMMENT INPUT */}
            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                    {currentUser ? (currentUser.username?.[0] || currentUser.name?.[0]) : <User size={20} />}
                </div>
                <form onSubmit={handleCommentSubmit} className="flex-1">
                    <input 
                        className="w-full border-b border-gray-200 py-1 focus:border-black focus:outline-none transition-colors bg-transparent" 
                        placeholder="Add a comment..." 
                        value={newComment} 
                        onChange={e => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                        <button 
                            type="submit" 
                            disabled={!currentUser || !newComment.trim()} 
                            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500"
                        >
                            Comment
                        </button>
                    </div>
                </form>
            </div>

            {/* COMMENTS LIST */}
            <div className="space-y-6">
                {comments.map(c => (
                    <div key={c._id} className="flex gap-4 group">
                        <img src={c.userAvatar} className="w-10 h-10 rounded-full bg-gray-200" alt="User" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">@{c.userName}</span>
                                <span className="text-xs text-gray-500">Just now</span>
                            </div>
                            
                            {/* Edit Mode vs View Mode */}
                            {editingCommentId === c._id ? (
                                <div className="flex gap-2 items-center mb-2">
                                    <input 
                                        value={editText} 
                                        onChange={e => setEditText(e.target.value)} 
                                        className="border-b border-black w-full py-1 focus:outline-none bg-transparent"
                                        autoFocus
                                    />
                                    <button onClick={() => saveEdit(c._id)} className="p-2 hover:bg-gray-200 rounded-full text-blue-600"><Save size={16}/></button>
                                    <button onClick={() => setEditingCommentId(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-600"><X size={16}/></button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-900 mb-1">{c.text}</p>
                            )}
                            
                            {/* Comment Actions (Like/Reply/Edit/Delete) */}
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-black"><ThumbsUp size={14}/></button>
                                <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-black"><ThumbsDown size={14}/></button>
                                <button className="text-xs font-medium text-gray-500 hover:text-black">Reply</button>
                                
                                {/* Only show Edit/Delete if Current User owns the comment */}
                                {currentUser && (currentUser._id === c.userId) && (
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
                                        <button onClick={() => startEdit(c)} className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1">
                                            <Edit2 size={12}/> Edit
                                        </button>
                                        <button onClick={() => handleDelete(c._id)} className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1">
                                            <Trash2 size={12}/> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* RIGHT SIDE: RECOMMENDED VIDEOS */}
      <div className="lg:w-[400px] shrink-0">
        {relatedVideos.map(v => (
            <div key={v._id} className="flex gap-2 mb-3 cursor-pointer group" onClick={() => onVideoSelect(v)}>
                <div className="relative w-44 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-200">
                    <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Thumbnail"/>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">8:45</span>
                </div>
                <div className="flex flex-col gap-1 pr-2">
                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-blue-600 text-gray-900">{v.title}</h4>
                    <p className="text-xs text-gray-500 hover:text-gray-700">{v.channelName}</p>
                    <p className="text-xs text-gray-500">{Math.floor(v.views / 1000)}K views • 2 weeks ago</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;