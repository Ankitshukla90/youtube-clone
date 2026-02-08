import React from 'react';
import VideoCard from '../components/VideoCard';
import FilterBar from '../components/FilterBar';

const Home = ({ videos, onVideoClick, activeCategory, setActiveCategory }) => {
  return (
    <div className="px-4 md:px-6">
      <FilterBar selected={activeCategory} onSelect={setActiveCategory} />
      {videos.length === 0 ? (
        <div className="text-center py-20"><h2 className="text-xl font-semibold text-gray-600">No videos found</h2></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pt-6 pb-10">
            {videos.map((video) => (<VideoCard key={video._id} video={video} onClick={onVideoClick} />))}
        </div>
      )}
    </div>
  );
};
export default Home;