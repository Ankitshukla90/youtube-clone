import React from 'react';

const categories = ["All", "Gaming", "Music", "Live", "Education", "Technology", "Lifestyle", "Cooking"];

const FilterBar = ({ selected, onSelect }) => {
  return (
    <div className="flex overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide sticky top-14 bg-white z-10 w-full gap-3">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            selected === cat ? "bg-black text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
export default FilterBar;
