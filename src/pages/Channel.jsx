import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Edit, X } from 'lucide-react';

const Channel = ({ currentUser }) => {
  const [myVideos, setMyVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: 'Education' });

  useEffect(() => {
    if(!currentUser) return;
    fetch('http://localhost:5000/api/videos').then(res => res.json()).then(data => { const userVideos = data.filter(v => v.user === currentUser._id); setMyVideos(userVideos); });
  }, [currentUser]);

  const resetForm = () => { setFormData({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: 'Education' }); setEditingVideo(null); setShowUpload(false); }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingVideo ? `http://localhost:5000/api/videos/${editingVideo._id}` : 'http://localhost:5000/api/videos';
    const method = editingVideo ? 'PUT' : 'POST';
    const res = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, userId: currentUser._id, channelName: currentUser.username || currentUser.name, channelAvatar: currentUser.avatar }) });
    const savedVideo = await res.json();
    if (editingVideo) { setMyVideos(myVideos.map(v => v._id === savedVideo._id ? savedVideo : v)); } else { setMyVideos([savedVideo, ...myVideos]); }
    resetForm();
  };

  const handleEditClick = (video) => { setEditingVideo(video); setFormData(video); setShowUpload(true); };
  const handleDelete = async (id) => { if(!window.confirm("Delete?")) return; await fetch(`http://localhost:5000/api/videos/${id}`, { method: 'DELETE' }); setMyVideos(myVideos.filter(v => v._id !== id)); };

  if (!currentUser) return <div>Please Sign In</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <img src={currentUser.avatar} className="w-24 h-24 rounded-full" />
        <div className="flex-1"><h1 className="text-3xl font-bold">{currentUser.username || currentUser.name}</h1><p className="text-gray-500">@{currentUser.email.split('@')[0]} • {myVideos.length} videos</p></div>
        <button onClick={() => setShowUpload(!showUpload)} className="bg-black text-white px-6 py-2 rounded-full flex gap-2">{showUpload ? <X/> : <Upload/>} {showUpload ? "Cancel" : "Upload Video"}</button>
      </div>

      {showUpload && (
        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">{editingVideo ? "Edit Video" : "Upload New Video"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="p-2 border rounded w-full" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <textarea className="w-full p-2 border rounded" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4"><input className="p-2 border rounded" placeholder="Thumbnail URL" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} /><input className="p-2 border rounded" placeholder="Video URL" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} /></div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium">{editingVideo ? "Update" : "Publish"}</button>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {myVideos.map(video => (
            <div key={video._id} className="border rounded-lg overflow-hidden shadow-sm">
                <img src={video.thumbnailUrl} className="w-full h-40 object-cover" />
                <div className="p-3"><h3 className="font-bold truncate">{video.title}</h3><div className="flex justify-end gap-2 mt-2"><button onClick={() => handleEditClick(video)} className="text-blue-600"><Edit size={18}/></button><button onClick={() => handleDelete(video._id)} className="text-red-600"><Trash2 size={18}/></button></div></div>
            </div>
        ))}
      </div>
    </div>
  );
};
export default Channel;