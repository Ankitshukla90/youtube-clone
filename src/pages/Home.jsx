import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';

const Home = ({ searchQuery, activeCategory, setActiveCategory }) => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // Fetch videos once
  useEffect(() => {
    fetch('http://localhost:5000/api/videos')
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error("Failed to fetch videos", err));
  }, []);

  // Filter & Sort Logic
  const filteredVideos = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
        activeCategory === "All" || 
        activeCategory === "Trending" || 
        v.category === activeCategory;

    return matchesCategory && matchesSearch;
  });

  // If "Trending" is selected, sort by Views (Highest first)
  if (activeCategory === "Trending") {
      filteredVideos.sort((a, b) => b.views - a.views);
  }

  return (
    <div className="px-4 md:px-6">
      <FilterBar selected={activeCategory} onSelect={setActiveCategory} />
      
      {filteredVideos.length === 0 ? (
        <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-600">No videos found</h2>
            <p className="text-gray-500 mt-2">Try searching for something else.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8 pt-6 pb-10">
            {filteredVideos.map((video) => (
            <VideoCard 
                key={video._id} 
                video={video} 
                onClick={(v) => navigate(`/video/${v._id}`)} 
            />
            ))}
        </div>
      )}
    </div>
  );
};
export default Home;