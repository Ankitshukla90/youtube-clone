import React from 'react';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';

const Home = ({ videos, onVideoClick, activeCategory, setActiveCategory }) => {
  return (
    <div className="px-4">
      <FilterBar selected={activeCategory} onSelect={setActiveCategory} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pt-6 pb-10">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onClick={onVideoClick} />
        ))}
      </div>
    </div>
  );
};
export default Home;