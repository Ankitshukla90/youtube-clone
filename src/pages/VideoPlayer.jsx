import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, User, Edit2, Trash2, Save, X, Bell, MoreHorizontal } from 'lucide-react';

const VideoPlayer = ({ currentUser }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // State
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Edit Comment State
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  // 1. FETCH DATA
  useEffect(() => {
    // Fetch Video Details
    fetch(`http://localhost:5000/api/videos/find/${id}`)
      .then(res => res.json())
      .then(data => {
          setVideo(data);
          setLikes(data.likes || 0);
      })
      .catch(err => console.error("Error loading video:", err));

    // Fetch Comments
    fetch(`http://localhost:5000/api/comments/${id}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Error loading comments:", err));

    // Fetch Related Videos
    fetch(`http://localhost:5000/api/videos`)
      .then(res => res.json())
      .then(data => setRelatedVideos(data.filter(v => v._id !== id)))
      .catch(err => console.error("Error loading related:", err));
      
    // Reset states
    setIsSubscribed(false);
    window.scrollTo(0, 0);
  }, [id]);

  // 2. HANDLERS

  const handleLike = async () => {
    try {
        const res = await fetch(`http://localhost:5000/api/videos/like/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'like' })
        });
        const updatedVideo = await res.json();
        setLikes(updatedVideo.likes);
    } catch (err) {
        console.error("Like failed", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    try {
        const res = await fetch('http://localhost:5000/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                videoId: id,
                userId: currentUser._id,
                userName: currentUser.username || currentUser.name,
                userAvatar: currentUser.avatar,
                text: newComment
            })
        });
        const saved = await res.json();
        setComments([saved, ...comments]);
        setNewComment("");
    } catch (err) {
        console.error("Comment failed", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
      if(!window.confirm("Delete this comment?")) return;
      try {
          await fetch(`http://localhost:5000/api/comments/${commentId}`, { method: 'DELETE' });
          setComments(comments.filter(c => c._id !== commentId));
      } catch (err) { console.error(err); }
  };

  const startEdit = (comment) => {
      setEditingCommentId(comment._id);
      setEditText(comment.text);
  };

  const saveEdit = async (commentId) => {
      try {
          const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: editText })
          });
          const updated = await res.json();
          setComments(comments.map(c => c._id === commentId ? updated : c));
          setEditingCommentId(null);
      } catch (err) { console.error(err); }
  };

  const toggleSubscribe = () => {
      if (!currentUser) {
          alert("Please sign in to subscribe.");
          return;
      }
      setIsSubscribed(!isSubscribed);
  };

  if (!video) return <div className="p-20 text-center">Loading video...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto bg-[#f9f9f9]">
      {/* LEFT COLUMN */}
      <div className="flex-1">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-lg">
          <video src={video.videoUrl} poster={video.thumbnailUrl} className="w-full h-full" controls autoPlay />
        </div>
        
        {/* Title */}
        <h1 className="text-xl font-bold mb-2 text-gray-900">{video.title}</h1>
        
        {/* Channel & Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
                <Link to={`/channel/${video.user}`}>
                    <img src={video.channelAvatar} className="w-10 h-10 rounded-full cursor-pointer bg-gray-200" alt="Channel"/>
                </Link>
                <div>
                    <Link to={`/channel/${video.user}`}>
                        <h3 className="font-bold text-base hover:text-gray-700 cursor-pointer">{video.channelName}</h3>
                    </Link>
                    <p className="text-xs text-gray-500">{Math.floor(video.views/50)} subscribers</p>
                </div>
                
                <button 
                    onClick={toggleSubscribe}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ml-4 ${
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
                    <button onClick={handleLike} className="flex items-center gap-2 px-3 h-full hover:bg-gray-200 rounded-l-full text-sm font-bold border-r border-gray-300">
                        <ThumbsUp size={16}/> {likes}
                    </button>
                    <button className="px-3 h-full hover:bg-gray-200 rounded-r-full">
                        <ThumbsDown size={16}/>
                    </button>
                 </div>
                 <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm font-bold hover:bg-gray-200 h-9 border border-gray-200">
                    <Share2 size={16}/> Share
                 </button>
                 <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 h-9 w-9 flex items-center justify-center border border-gray-200">
                    <MoreHorizontal size={16} />
                 </button>
            </div>
        </div>
        
        {/* Description */}
        <div className="bg-gray-100 p-3 rounded-xl text-sm mb-6 hover:bg-gray-200 transition-colors cursor-pointer">
            <div className="font-bold mb-1">{video.views} views • 2 weeks ago</div>
            <p className="whitespace-pre-wrap">{video.description}</p>
        </div>
        
        {/* Comments Section */}
        <div>
            <h3 className="font-bold text-xl mb-6">{comments.length} Comments</h3>
            
            {/* Add Comment */}
            <div className="flex gap-4 mb-8">
                 <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                    {currentUser?.username?.[0] || <User size={20}/>}
                 </div>
                 <form onSubmit={handleCommentSubmit} className="flex-1">
                    <input 
                        className="w-full border-b border-gray-300 py-1 bg-transparent focus:outline-none focus:border-black transition-colors" 
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
            
            {/* Comment List */}
            <div className="space-y-6">
                {comments.map(c => (
                    <div key={c._id} className="flex gap-4 group">
                        <img src={c.userAvatar} className="w-10 h-10 rounded-full bg-gray-200" alt="user"/>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">@{c.userName}</span> 
                                <span className="text-xs font-normal text-gray-500">Just now</span>
                            </div>
                            
                            {/* Edit Mode */}
                            {editingCommentId === c._id ? (
                                <div className="flex gap-2 items-center mb-2">
                                    <input 
                                        value={editText} 
                                        onChange={e => setEditText(e.target.value)} 
                                        className="border-b border-black w-full py-1 bg-transparent focus:outline-none"
                                        autoFocus
                                    />
                                    <button onClick={() => saveEdit(c._id)} className="p-2 hover:bg-gray-200 rounded-full text-blue-600"><Save size={16}/></button>
                                    <button onClick={() => setEditingCommentId(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-600"><X size={16}/></button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-900 mb-1">{c.text}</p>
                            )}
                            
                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-black"><ThumbsUp size={14}/></button>
                                <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-black"><ThumbsDown size={14}/></button>
                                <button className="text-xs font-medium text-gray-500 hover:text-black">Reply</button>
                                
                                {currentUser && (currentUser._id === c.userId) && (
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
                                        <button onClick={() => startEdit(c)} className="text-xs font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1">
                                            <Edit2 size={12}/> Edit
                                        </button>
                                        <button onClick={() => handleDeleteComment(c._id)} className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1">
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

      {/* RIGHT COLUMN: RELATED VIDEOS */}
      <div className="lg:w-[400px] shrink-0">
        {relatedVideos.map(v => (
            <div key={v._id} className="flex gap-2 mb-3 cursor-pointer group" onClick={() => navigate(`/video/${v._id}`)}>
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-200">
                    <img src={v.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="thumb"/>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">8:45</span>
                </div>
                <div className="flex flex-col gap-1 pr-1">
                    <h4 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-blue-600 text-gray-900">{v.title}</h4>
                    <p className="text-xs text-gray-500 hover:text-gray-700">{v.channelName}</p>
                    <p className="text-xs text-gray-500">{Math.floor(v.views/1000)}K views • 2 weeks ago</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
export default VideoPlayer;