import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Edit } from 'lucide-react';

const Channel = ({ currentUser }) => {
  const [myVideos, setMyVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    category: 'Education'
  });

  // 1. FETCH MY VIDEOS
  useEffect(() => {
    if(!currentUser) return;
    // In a real app, you'd filter by userId on the backend. 
    // For this prototype, we fetch all and filter locally to save time.
    fetch('http://localhost:5000/api/videos')
      .then(res => res.json())
      .then(data => {
         // Filter videos where the uploader is the current user
         const userVideos = data.filter(v => v.user === currentUser._id || v.user === currentUser.id);
         setMyVideos(userVideos);
      });
  }, [currentUser]);

  // 2. CREATE VIDEO (Upload)
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('http://localhost:5000/api/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                userId: currentUser._id || currentUser.id,
                channelName: currentUser.name,
                channelAvatar: currentUser.avatar
            })
        });
        const newVideo = await res.json();
        setMyVideos([newVideo, ...myVideos]);
        setShowUpload(false);
        alert("Video Uploaded Successfully!");
    } catch(err) {
        alert("Upload Failed");
    }
  };

  // 3. DELETE VIDEO
  const handleDelete = async (videoId) => {
    if(!window.confirm("Are you sure you want to delete this video?")) return;
    try {
        await fetch(`http://localhost:5000/api/videos/${videoId}`, { method: 'DELETE' });
        setMyVideos(myVideos.filter(v => v._id !== videoId));
    } catch(err) {
        console.error(err);
    }
  };

  if (!currentUser) return <div className="p-10 text-center">Please Sign In to view your channel.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Channel Header */}
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <img src={currentUser.avatar} className="w-24 h-24 rounded-full" alt="Channel" />
        <div className="flex-1">
            <h1 className="text-3xl font-bold">{currentUser.name}</h1>
            <p className="text-gray-500">@{currentUser.email.split('@')[0]} • {myVideos.length} videos</p>
        </div>
        <button 
            onClick={() => setShowUpload(!showUpload)}
            className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800"
        >
            <Upload size={18} /> {showUpload ? "Close Upload" : "Upload Video"}
        </button>
      </div>

      {/* Upload Form */}
      {showUpload && (
        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Upload New Video</h2>
            <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="p-2 border rounded" placeholder="Video Title" required 
                        onChange={e => setFormData({...formData, title: e.target.value})} />
                    <select className="p-2 border rounded" 
                        onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option>Education</option>
                        <option>Gaming</option>
                        <option>Music</option>
                        <option>Tech</option>
                    </select>
                </div>
                <textarea className="w-full p-2 border rounded" placeholder="Description" required 
                     onChange={e => setFormData({...formData, description: e.target.value})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="p-2 border rounded" placeholder="Thumbnail URL (https://...)" required 
                        onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} />
                    <input className="p-2 border rounded" placeholder="Video URL (https://...)" required 
                        onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium">Publish Video</button>
            </form>
        </div>
      )}

      {/* Video List (CRUD Display) */}
      <h2 className="text-xl font-bold mb-4">Your Videos</h2>
      {myVideos.length === 0 ? (
          <p className="text-gray-500">No videos uploaded yet.</p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myVideos.map(video => (
                <div key={video._id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                    <img src={video.thumbnailUrl} className="w-full h-40 object-cover" />
                    <div className="p-3">
                        <h3 className="font-bold line-clamp-1">{video.title}</h3>
                        <p className="text-xs text-gray-500 mb-2">{new Date(video.createdAt).toLocaleDateString()}</p>
                        <div className="flex justify-end gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                            <button 
                                onClick={() => handleDelete(video._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default Channel;