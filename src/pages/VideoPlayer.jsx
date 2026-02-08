import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share2, User, Edit2, Trash2, Save, X } from 'lucide-react';

const VideoPlayer = ({ video, currentUser, relatedVideos, onVideoSelect }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [likes, setLikes] = useState(video.likes);

  useEffect(() => {
    fetch(`http://localhost:5000/api/comments/${video._id}`).then(res => res.json()).then(data => setComments(data));
    setLikes(video.likes);
  }, [video._id]);

  const handleLike = async () => {
    const res = await fetch(`http://localhost:5000/api/videos/like/${video._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'like' }) });
    const updatedVideo = await res.json();
    setLikes(updatedVideo.likes);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    const res = await fetch('http://localhost:5000/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ videoId: video._id, userId: currentUser._id, userName: currentUser.username || currentUser.name, userAvatar: currentUser.avatar, text: newComment }) });
    const saved = await res.json();
    setComments([saved, ...comments]);
    setNewComment("");
  };

  const handleDelete = async (id) => { await fetch(`http://localhost:5000/api/comments/${id}`, { method: 'DELETE' }); setComments(comments.filter(c => c._id !== id)); };
  const startEdit = (c) => { setEditingCommentId(c._id); setEditText(c.text); };
  const saveEdit = async (id) => { const res = await fetch(`http://localhost:5000/api/comments/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: editText }) }); const updated = await res.json(); setComments(comments.map(c => c._id === id ? updated : c)); setEditingCommentId(null); };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-[1600px] mx-auto">
      <div className="flex-1">
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-lg"><video src={video.videoUrl} poster={video.thumbnailUrl} className="w-full h-full" controls autoPlay /></div>
        <h1 className="text-xl font-bold mb-2">{video.title}</h1>
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3"><img src={video.channelAvatar} className="w-10 h-10 rounded-full"/><div><h3 className="font-bold text-sm">{video.channelName}</h3><p className="text-xs text-gray-500">{video.views} views</p></div></div>
            <div className="flex gap-2"><button onClick={handleLike} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm font-bold"><ThumbsUp size={16}/> {likes}</button></div>
        </div>
        <div className="bg-gray-100 rounded-xl p-3 text-sm mb-6"><p>{video.description}</p></div>
        <div>
            <h3 className="font-bold text-xl mb-6">{comments.length} Comments</h3>
            <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">{currentUser ? currentUser.username?.[0] : <User size={20} />}</div>
                <form onSubmit={handleCommentSubmit} className="flex-1"><input className="w-full border-b border-gray-200 py-1" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)}/><button type="submit" disabled={!currentUser} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">Comment</button></form>
            </div>
            <div className="space-y-6">
                {comments.map(c => (
                    <div key={c._id} className="flex gap-4">
                        <img src={c.userAvatar} className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1"><span className="font-semibold text-sm">@{c.userName}</span><span className="text-xs text-gray-500">Just now</span></div>
                            {editingCommentId === c._id ? (<div className="flex gap-2"><input value={editText} onChange={e => setEditText(e.target.value)} className="border-b w-full"/><button onClick={() => saveEdit(c._id)}><Save size={16}/></button></div>) : (<p className="text-sm mb-2">{c.text}</p>)}
                            {currentUser && (currentUser._id === c.userId) && (<div className="flex gap-3 mt-1"><button onClick={() => startEdit(c)} className="text-xs font-semibold text-gray-500">Edit</button><button onClick={() => handleDelete(c._id)} className="text-xs font-semibold text-red-600">Delete</button></div>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      <div className="lg:w-[350px] shrink-0">{relatedVideos.map(v => (<div key={v._id} className="flex gap-2 mb-3 cursor-pointer" onClick={() => onVideoSelect(v)}><img src={v.thumbnailUrl} className="w-40 rounded-lg aspect-video object-cover"/><div><h4 className="font-semibold text-sm line-clamp-2">{v.title}</h4><p className="text-xs text-gray-500">{v.channelName}</p></div></div>))}</div>
    </div>
  );
};
export default VideoPlayer;