import { Search, Filter, SlidersHorizontal } from "lucide-react";

const SearchFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-2 md:p-3 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-700 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-deep-red/20 focus:bg-white transition-all"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {/* Category Dropdown */}
          <div className="relative min-w-[140px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="text-deep-red" size={16} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:border-deep-red focus:ring-2 focus:ring-deep-red/10 cursor-pointer appearance-none hover:bg-gray-50 transition-colors"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[160px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SlidersHorizontal className="text-gray-500" size={16} />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:border-deep-red focus:ring-2 focus:ring-deep-red/10 cursor-pointer appearance-none hover:bg-gray-50 transition-colors"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
