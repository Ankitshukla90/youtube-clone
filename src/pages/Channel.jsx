import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Edit, X, Settings, Plus, LayoutGrid, List } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const Channel = ({ currentUser }) => {
  const [myVideos, setMyVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [manageMode, setManageMode] = useState(false); // Toggle between View and Manage
  
  const [formData, setFormData] = useState({ 
    title: '', description: '', thumbnailUrl: '', videoUrl: '', category: 'Education' 
  });

  useEffect(() => {
    if(!currentUser) return;
    fetch('http://localhost:5000/api/videos')
      .then(res => res.json())
      .then(data => {
         const userVideos = data.filter(v => v.user === currentUser._id);
         setMyVideos(userVideos);
      });
  }, [currentUser]);

  const resetForm = () => { 
      setFormData({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: 'Education' }); 
      setEditingVideo(null); 
      setShowUpload(false); 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingVideo 
        ? `http://localhost:5000/api/videos/${editingVideo._id}` 
        : 'http://localhost:5000/api/videos';
    const method = editingVideo ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...formData,
            userId: currentUser._id,
            channelName: currentUser.username || currentUser.name,
            channelAvatar: currentUser.avatar
        })
    });
    const savedVideo = await res.json();
    
    if (editingVideo) {
        setMyVideos(myVideos.map(v => v._id === savedVideo._id ? savedVideo : v));
    } else {
        setMyVideos([savedVideo, ...myVideos]);
    }
    resetForm();
  };

  const handleEditClick = (video) => {
      setEditingVideo(video);
      setFormData(video);
      setShowUpload(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this video?")) return;
    await fetch(`http://localhost:5000/api/videos/${id}`, { method: 'DELETE' });
    setMyVideos(myVideos.filter(v => v._id !== id));
  };

  if (!currentUser) return <div className="p-20 text-center text-xl">Please Sign In to view your channel.</div>;

  return (
    <div className="w-full">
      {/* CHANNEL BANNER */}
      <div className="h-40 md:h-52 bg-gradient-to-r from-gray-800 to-gray-600 w-full"></div>

      {/* CHANNEL HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img src={currentUser.avatar} className="w-32 h-32 rounded-full border-4 border-white -mt-16 bg-white shadow-md" alt="Avatar"/>
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{currentUser.username || currentUser.name}</h1>
                <p className="text-gray-500 text-sm mt-1">@{currentUser.email.split('@')[0]} • {myVideos.length} subscribers • {myVideos.length} videos</p>
                <div className="flex gap-4 mt-1 justify-center md:justify-start text-sm font-medium text-gray-600">
                    <span>More about this channel...</span>
                </div>
                
                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                    <button 
                        onClick={() => setManageMode(!manageMode)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${manageMode ? "bg-gray-200 text-black" : "bg-black text-white hover:bg-gray-800"}`}
                    >
                        {manageMode ? "View Channel" : "Manage Videos"}
                    </button>
                    <button 
                        onClick={() => setShowUpload(true)}
                        className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                        <Plus size={16}/> Create
                    </button>
                </div>
            </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex gap-8 mt-8 border-b border-transparent">
            <button className={`pb-2 font-medium text-sm ${!manageMode ? "border-b-2 border-black text-black" : "text-gray-500"}`} onClick={() => setManageMode(false)}>HOME</button>
            <button className={`pb-2 font-medium text-sm text-gray-500`}>VIDEOS</button>
            <button className={`pb-2 font-medium text-sm text-gray-500`}>PLAYLISTS</button>
            {manageMode && <button className="pb-2 font-medium text-sm border-b-2 border-black text-black ml-auto flex items-center gap-2"><Settings size={14}/> STUDIO</button>}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* UPLOAD FORM MODAL */}
        {showUpload && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl m-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{editingVideo ? "Edit Video" : "Upload Video"}</h2>
                        <button onClick={resetForm}><X size={24}/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                            <input className="p-2 border rounded w-full focus:outline-blue-500" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                            <textarea className="w-full p-2 border rounded focus:outline-blue-500" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Thumbnail URL</label>
                                <input className="p-2 border rounded w-full text-sm" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Video URL</label>
                                <input className="p-2 border rounded w-full text-sm" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
                                {editingVideo ? "Save Changes" : "Upload"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* VIDEO DISPLAY LOGIC */}
        {manageMode ? (
            // --- MANAGE MODE (Table Layout) ---
            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-medium text-gray-600">Video</th>
                            <th className="p-4 font-medium text-gray-600">Date</th>
                            <th className="p-4 font-medium text-gray-600">Views</th>
                            <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {myVideos.map(video => (
                            <tr key={video._id} className="hover:bg-gray-50 group">
                                <td className="p-4 flex gap-3 items-center">
                                    <img src={video.thumbnailUrl} className="w-24 h-14 object-cover rounded" alt="thumb" />
                                    <div>
                                        <div className="font-semibold text-gray-900 line-clamp-1">{video.title}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">{video.description}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-500">Just now</td>
                                <td className="p-4 text-gray-500">{video.views}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(video)} className="p-2 hover:bg-gray-200 rounded text-gray-600" title="Edit"><Edit size={18}/></button>
                                        <button onClick={() => handleDelete(video._id)} className="p-2 hover:bg-gray-200 rounded text-red-600" title="Delete"><Trash2 size={18}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {myVideos.length === 0 && <div className="p-8 text-center text-gray-500">No videos yet. Click Create to upload.</div>}
            </div>
        ) : (
            // --- PUBLIC MODE (Grid Layout) ---
            <>
                <h2 className="text-lg font-bold mb-4">For You</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myVideos.map(video => (
                        <div key={video._id}> 
                            {/* Reusing a simplified card view for channel page */}
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 mb-2">
                                <img src={video.thumbnailUrl} className="w-full h-full object-cover" alt="thumb"/>
                            </div>
                            <h3 className="font-bold text-sm line-clamp-2">{video.title}</h3>
                            <div className="text-xs text-gray-500 mt-1">{video.views} views • Just now</div>
                        </div>
                    ))}
                </div>
                {myVideos.length === 0 && <div className="text-gray-500 text-center py-10">This channel has no videos.</div>}
            </>
        )}
      </div>
    </div>
  );
};
export default Channel;