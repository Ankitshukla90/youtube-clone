import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trash2, Upload, Edit, X, Settings, Plus, Camera, Image as ImageIcon } from 'lucide-react';

const Channel = ({ currentUser }) => {
  const { userId } = useParams();
  
  // State
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [manageMode, setManageMode] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const isOwner = currentUser && currentUser._id === userId;

  // Form States
  const [formData, setFormData] = useState({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: 'Education' });
  const [profileForm, setProfileForm] = useState({ username: '', avatar: '', channelBanner: '' });

  // 1. FETCH DATA (Fixed Logic)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Info (This ensures page loads even with 0 videos)
        const userRes = await fetch(`http://localhost:5000/api/auth/find/${userId}`);
        const userData = await userRes.json();
        setChannelData({
            name: userData.username,
            avatar: userData.avatar,
            banner: userData.channelBanner || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80",
            subscribers: userData.subscribers || 0
        });
        setProfileForm({ username: userData.username, avatar: userData.avatar, channelBanner: userData.channelBanner });

        // Fetch Videos
        const videoRes = await fetch(`http://localhost:5000/api/videos/user/${userId}`);
        const videoData = await videoRes.json();
        setVideos(videoData);
      } catch (err) {
        console.error("Failed to load channel data", err);
      }
    };
    fetchData();
  }, [userId]);

  // --- VIDEO ACTIONS ---
  const resetForm = () => {
      setFormData({ title: '', description: '', thumbnailUrl: '', videoUrl: '', category: 'Education' });
      setEditingVideo(null);
      setShowUpload(false);
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const url = editingVideo ? `http://localhost:5000/api/videos/${editingVideo._id}` : 'http://localhost:5000/api/videos';
    const method = editingVideo ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: currentUser._id, channelName: currentUser.username, channelAvatar: currentUser.avatar })
    });
    const saved = await res.json();
    
    if (editingVideo) {
        setVideos(videos.map(v => v._id === saved._id ? saved : v));
    } else {
        setVideos([saved, ...videos]);
    }
    resetForm();
  };

  const deleteVideo = async (id) => {
      if(!window.confirm("Delete this video?")) return;
      await fetch(`http://localhost:5000/api/videos/${id}`, { method: 'DELETE' });
      setVideos(videos.filter(v => v._id !== id));
  };

  // --- PROFILE ACTIONS ---
  const updateProfile = async (e) => {
      e.preventDefault();
      const res = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser._id, ...profileForm })
      });
      const updated = await res.json();
      setChannelData(prev => ({ ...prev, name: updated.username, avatar: updated.avatar, banner: updated.channelBanner }));
      setShowCustomize(false);
      alert("Profile Updated!");
  };

  if (!channelData) return <div className="p-20 text-center">Loading Channel...</div>;

  return (
    <div className="w-full pb-20">
      {/* BANNER */}
      <div className="h-40 md:h-52 w-full bg-gray-800 relative group overflow-hidden">
          <img src={channelData.banner} className="w-full h-full object-cover" alt="Banner"/>
          {isOwner && <button onClick={() => setShowCustomize(true)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"><Camera size={20}/></button>}
      </div>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative -mt-16 group cursor-pointer" onClick={() => isOwner && setShowCustomize(true)}>
                <img src={channelData.avatar} className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md object-cover"/>
                {isOwner && <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-white"><Camera size={24}/></div>}
            </div>
            
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{channelData.name}</h1>
                <p className="text-gray-500 text-sm mt-1">@{channelData.name.replace(/\s/g,'')} • {channelData.subscribers} subscribers • {videos.length} videos</p>
                
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                    {isOwner ? (
                        <>
                            <button onClick={() => setShowCustomize(true)} className="bg-gray-200 px-4 py-2 rounded-full text-sm font-medium">Customize Channel</button>
                            <button onClick={() => setManageMode(!manageMode)} className="bg-gray-200 px-4 py-2 rounded-full text-sm font-medium">{manageMode ? "View Channel" : "Manage Videos"}</button>
                            <button onClick={() => setShowUpload(true)} className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"><Plus size={16}/> Create</button>
                        </>
                    ) : (
                        <button className="bg-black text-white px-6 py-2 rounded-full font-medium text-sm">Subscribe</button>
                    )}
                </div>
            </div>
        </div>
        
        {/* TABS */}
        <div className="flex gap-8 mt-8 border-b border-transparent">
            <button className={`pb-2 font-medium text-sm ${!manageMode ? "border-b-2 border-black" : "text-gray-500"}`} onClick={() => setManageMode(false)}>HOME</button>
            <button className="pb-2 font-medium text-sm text-gray-500">VIDEOS</button>
            <button className="pb-2 font-medium text-sm text-gray-500">PLAYLISTS</button>
            {manageMode && <button className="pb-2 font-medium text-sm border-b-2 border-black ml-auto flex items-center gap-2"><Settings size={14}/> STUDIO</button>}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* MODAL: Upload/Edit Video */}
        {showUpload && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
                    <div className="flex justify-between mb-6"><h2 className="text-xl font-bold">{editingVideo ? "Edit Video" : "Upload Video"}</h2><button onClick={resetForm}><X/></button></div>
                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                        <input className="border p-2 w-full rounded" placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <textarea className="border p-2 w-full rounded" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <input className="border p-2 w-full rounded" placeholder="Thumbnail URL" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} />
                            <input className="border p-2 w-full rounded" placeholder="Video URL" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded w-full">{editingVideo ? "Save" : "Upload"}</button>
                    </form>
                </div>
            </div>
        )}

        {/* MODAL: Customize Channel */}
        {showCustomize && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                    <div className="flex justify-between mb-6"><h2 className="text-xl font-bold">Customize Channel</h2><button onClick={() => setShowCustomize(false)}><X/></button></div>
                    <form onSubmit={updateProfile} className="space-y-4">
                        <div><label className="text-xs font-bold text-gray-700">Name</label><input className="border p-2 w-full rounded" value={profileForm.username} onChange={e => setProfileForm({...profileForm, username: e.target.value})}/></div>
                        <div><label className="text-xs font-bold text-gray-700">Avatar URL</label><input className="border p-2 w-full rounded" value={profileForm.avatar} onChange={e => setProfileForm({...profileForm, avatar: e.target.value})}/></div>
                        <div><label className="text-xs font-bold text-gray-700">Banner URL</label><input className="border p-2 w-full rounded" value={profileForm.channelBanner} onChange={e => setProfileForm({...profileForm, channelBanner: e.target.value})}/></div>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded w-full">Save Changes</button>
                    </form>
                </div>
            </div>
        )}

        {/* VIDEOS LIST */}
        {manageMode ? (
            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b"><tr><th className="p-4">Video</th><th className="p-4 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y">
                        {videos.map(v => (
                            <tr key={v._id} className="hover:bg-gray-50">
                                <td className="p-4 flex gap-3 items-center">
                                    <img src={v.thumbnailUrl} className="w-24 h-14 object-cover rounded"/>
                                    <div className="font-semibold line-clamp-1">{v.title}</div>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => { setEditingVideo(v); setFormData(v); setShowUpload(true); }} className="p-2 text-blue-600"><Edit size={18}/></button>
                                    <button onClick={() => deleteVideo(v._id)} className="p-2 text-red-600"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {videos.length === 0 && <div className="p-8 text-center text-gray-500">No videos yet.</div>}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {videos.map(v => (
                    <div key={v._id} className="cursor-pointer">
                        <img src={v.thumbnailUrl} className="w-full rounded-xl aspect-video object-cover"/>
                        <h3 className="font-bold text-sm mt-2 line-clamp-2">{v.title}</h3>
                        <div className="text-xs text-gray-500">{v.views} views</div>
                    </div>
                ))}
                {videos.length === 0 && <div className="text-gray-500 col-span-full text-center py-10">This channel has no videos yet.</div>}
            </div>
        )}
      </div>
    </div>
  );
};
export default Channel;