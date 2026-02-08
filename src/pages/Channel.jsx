import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Edit, X, Settings, Plus, Camera, Image as ImageIcon } from 'lucide-react';

const Channel = ({ currentUser }) => {
  const [myVideos, setMyVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false); // New Modal State
  const [editingVideo, setEditingVideo] = useState(null);
  const [manageMode, setManageMode] = useState(false);
  
  // Profile State (For "How you'll appear" modal)
  const [profileData, setProfileData] = useState({
      username: currentUser?.username || "",
      avatar: currentUser?.avatar || "",
      channelBanner: currentUser?.channelBanner || ""
  });

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
    
    // Sync profile data
    setProfileData({
        username: currentUser.username,
        avatar: currentUser.avatar,
        channelBanner: currentUser.channelBanner
    });
  }, [currentUser]);

  // --- VIDEO LOGIC ---
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

  // --- PROFILE LOGIC (NEW) ---
  const handleProfileUpdate = async (e) => {
      e.preventDefault();
      try {
          const res = await fetch('http://localhost:5000/api/auth/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  userId: currentUser._id,
                  ...profileData
              })
          });
          const updatedUser = await res.json();
          alert("Channel updated! Please re-login to see changes completely.");
          setShowCustomize(false);
          // Ideally, update global user state here via a prop function, 
          // but for now re-login triggers the refresh.
      } catch (err) {
          alert("Failed to update profile");
      }
  };

  if (!currentUser) return <div className="p-20 text-center text-xl">Please Sign In to view your channel.</div>;

  return (
    <div className="w-full">
      
      {/* 1. CHANNEL BANNER */}
      <div className="h-40 md:h-52 w-full bg-gray-800 relative group overflow-hidden">
          <img 
            src={currentUser.channelBanner || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80"} 
            className="w-full h-full object-cover" 
            alt="Channel Banner"
          />
          {/* Edit Banner Hint */}
          <button onClick={() => setShowCustomize(true)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
              <Camera size={20}/>
          </button>
      </div>

      {/* 2. CHANNEL HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <div className="relative -mt-16 group cursor-pointer" onClick={() => setShowCustomize(true)}>
                <img src={currentUser.avatar} className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md z-10 object-cover" alt="Avatar"/>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white">
                    <Camera size={24}/>
                </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{currentUser.username || currentUser.name}</h1>
                <p className="text-gray-500 text-sm mt-1">
                    @{currentUser.email.split('@')[0]} • {currentUser.subscribers || 0} subscribers • {myVideos.length} videos
                </p>
                <div className="flex gap-4 mt-1 justify-center md:justify-start text-sm font-medium text-gray-600">
                    <span className="cursor-pointer hover:text-gray-900">More about this channel...</span>
                </div>
                
                {/* ACTION BUTTONS */}
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                    <button 
                        onClick={() => setShowCustomize(true)}
                        className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-full text-sm font-medium"
                    >
                        Customize Channel
                    </button>
                    <button 
                        onClick={() => setManageMode(!manageMode)}
                        className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-full text-sm font-medium"
                    >
                        {manageMode ? "View Channel" : "Manage Videos"}
                    </button>
                    <button 
                        onClick={() => setShowUpload(true)}
                        className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800"
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

      {/* 3. MODALS */}
      
      {/* CUSTOMIZE CHANNEL MODAL (Matches PDF "How you'll appear") */}
      {showCustomize && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
                  <div className="p-6 border-b">
                      <h2 className="text-xl font-bold text-gray-900">How you'll appear</h2>
                      <p className="text-sm text-gray-500 mt-1">Customize your channel profile</p>
                  </div>
                  
                  <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                      {/* Avatar Preview */}
                      <div className="flex justify-center">
                          <div className="relative">
                              <img src={profileData.avatar} className="w-24 h-24 rounded-full border border-gray-200 object-cover" />
                              <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white">
                                  <Camera size={14}/>
                              </div>
                          </div>
                      </div>

                      {/* Inputs */}
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Name</label>
                              <div className="border rounded-lg px-3 py-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                  <input 
                                    className="w-full focus:outline-none text-sm" 
                                    value={profileData.username}
                                    onChange={e => setProfileData({...profileData, username: e.target.value})}
                                  />
                              </div>
                          </div>
                          
                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Avatar URL</label>
                              <div className="border rounded-lg px-3 py-2 flex items-center gap-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                  <ImageIcon size={16} className="text-gray-400"/>
                                  <input 
                                    className="w-full focus:outline-none text-sm" 
                                    placeholder="https://..."
                                    value={profileData.avatar}
                                    onChange={e => setProfileData({...profileData, avatar: e.target.value})}
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Banner URL</label>
                              <div className="border rounded-lg px-3 py-2 flex items-center gap-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                  <ImageIcon size={16} className="text-gray-400"/>
                                  <input 
                                    className="w-full focus:outline-none text-sm" 
                                    placeholder="https://..."
                                    value={profileData.channelBanner}
                                    onChange={e => setProfileData({...profileData, channelBanner: e.target.value})}
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                          <button 
                            type="button" 
                            onClick={() => setShowCustomize(false)} 
                            className="text-blue-600 font-medium text-sm px-4 py-2 hover:bg-blue-50 rounded"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="bg-blue-600 text-white font-medium text-sm px-6 py-2 rounded-full hover:bg-blue-700"
                          >
                              Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* UPLOAD VIDEO MODAL */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{editingVideo ? "Edit Video" : "Upload Video"}</h2>
                    <button onClick={resetForm}><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="p-2 border rounded w-full" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <textarea className="p-2 border rounded w-full" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <input className="p-2 border rounded w-full" placeholder="Thumbnail URL" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} />
                        <input className="p-2 border rounded w-full" placeholder="Video URL" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium float-right">{editingVideo ? "Save" : "Upload"}</button>
                </form>
            </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {manageMode ? (
            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr><th className="p-4">Video</th><th className="p-4">Views</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y">
                        {myVideos.map(video => (
                            <tr key={video._id} className="hover:bg-gray-50 group">
                                <td className="p-4 flex gap-3 items-center">
                                    <img src={video.thumbnailUrl} className="w-24 h-14 object-cover rounded" />
                                    <div className="font-semibold line-clamp-1">{video.title}</div>
                                </td>
                                <td className="p-4">{video.views}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleEditClick(video)} className="p-2 text-blue-600"><Edit size={18}/></button>
                                    <button onClick={() => handleDelete(video._id)} className="p-2 text-red-600"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myVideos.map(video => (
                    <div key={video._id}>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 mb-2">
                            <img src={video.thumbnailUrl} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-sm line-clamp-2">{video.title}</h3>
                        <div className="text-xs text-gray-500 mt-1">{video.views} views • Just now</div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
export default Channel;