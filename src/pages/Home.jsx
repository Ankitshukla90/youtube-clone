import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';

const Home = ({ searchQuery }) => {
  const [videos, setVideos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/videos')
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  const filteredVideos = videos.filter(v => {
    const matchesCategory = activeCategory === "All" || v.category === activeCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-4 md:px-6">
      <FilterBar selected={activeCategory} onSelect={setActiveCategory} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-6 pb-10">
        {filteredVideos.map((video) => (
          <VideoCard 
            key={video._id} 
            video={video} 
            onClick={(v) => navigate(`/video/${v._id}`)} 
          />
        ))}
      </div>
    </div>
  );
};
export default Home;