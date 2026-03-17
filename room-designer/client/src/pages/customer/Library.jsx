import React, { useRef, useEffect, useState } from 'react';
import LoggedInNavbar from '../../components/LoggedInNavbar';
import CustomerSidebar from '../../components/CustomerSidebar';
import { Heart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { furnitureAPI } from '../../services/furnitureAPI';


const Library = () => {
  const [activeTab, setActiveTab] = useState('All Items');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedMaterials, setSelectedMaterials] = useState(['Premium Velvet']);
  const [selectedStyle, setSelectedStyle] = useState('Modern');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const tabs = ['All Items', 'Sofas', 'Tables', 'Chairs', 'Beds', 'Storage', 'Lighting', 'Saved Items'];
  const colors = [
    { name: 'black', bg: 'bg-black' },
    { name: 'white', bg: 'bg-white', border: true },
    { name: 'brown', bg: 'bg-amber-700' },
    { name: 'gray', bg: 'bg-gray-400' },
    { name: 'blue', bg: 'bg-blue-500' }
  ];
  const materials = ['Solid Wood', 'Premium Velvet', 'Metal', 'Leather'];
  const styles = ['Modern', 'Scandinavian', 'Industrial', 'Minimalist'];

  // Load furniture from database
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadFurniture = async () => {
      try {
        const response = await furnitureAPI.getFurnitureItems(activeTab, null);
        setProducts(response.items || []);
      } catch (error) {
        console.error("Error loading furniture:", error);
        setProducts([]);
      }
    };

    loadFurniture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMaterial = (material) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedColor('blue');
    setSelectedMaterials(['Premium Velvet']);
    setSelectedStyle('Modern');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xs ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
        ))}
      </div>
    );
  };

  return (
    <>
      <LoggedInNavbar userRole="customer" />
      <div className="des-wrapper">
      <CustomerSidebar />
      <div className="des-frame">
        <div className="des-layout">

          {/* Content Area */}
          <main className="des-content flex-1 flex overflow-hidden">
            {/* Left Filters Panel */}
            <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
              <div className="p-6">
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Price Range</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-700">${priceRange[0]}</span>
                    <span className="text-sm text-gray-700">${priceRange[1]}+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Color */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Color</h3>
                  <div className="flex items-center gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full ${color.bg} border-2 flex items-center justify-center transition-all ${
                          selectedColor === color.name
                            ? 'border-blue-600'
                            : color.border
                              ? 'border-gray-400'
                              : 'border-gray-300'
                        }`}
                      >
                        {selectedColor === color.name && (
                          <span className={`text-sm ${color.name === 'white' ? 'text-gray-600' : 'text-white'}`}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Material</h3>
                  <div className="space-y-2">
                    {materials.map((material) => (
                      <label key={material} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(material)}
                          onChange={() => toggleMaterial(material)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Style</h3>
                  <div className="space-y-2">
                    {styles.map((style) => (
                      <label key={style} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="style"
                          checked={selectedStyle === style}
                          onChange={() => setSelectedStyle(style)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search & Tabs */}
              <div className="bg-white border-b border-gray-200 px-8 py-4">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search furniture, styles, or collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tabs & Sort */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                          activeTab === tab
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tab === 'Saved Items' && <Heart size={16} className="fill-current" />}
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">SORT BY</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option>Most Popular</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest</option>
                      <option>Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                <div className="grid grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id || product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Image */}
                      <div className="relative h-48 bg-gray-200">
                        <img
                          src={product.image || product.img || '/images/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = '/images/placeholder.png'}
                        />
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-3 left-3">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-md ${
                              product.badge === 'NEW' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {product.badge}
                            </span>
                          </div>
                        )}
                        {/* Heart Icon */}
                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                          <Heart
                            size={18}
                            className={`${product.saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                          <span className="text-lg font-bold text-blue-600">${product.price}</span>
                        </div>

                        <p className="text-xs text-gray-500 mb-3">
                          {typeof product.dimensions === 'object' && product.dimensions?.width
                            ? `${product.dimensions.width} × ${product.dimensions.depth} × ${product.dimensions.height} ${product.dimensions.unit}`
                            : product.dimensions || 'N/A'}
                        </p>

                        <div className="flex items-center gap-2 mb-4">
                          {renderStars(product.rating)}
                          <span className="text-xs text-gray-500">({product.reviews})</span>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                          Add to Design
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-8">
                  <p className="text-sm text-gray-600">Showing 1-12 of 148 products</p>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white border border-gray-300 rounded-lg transition-colors">
                      <ChevronLeft size={18} className="text-gray-600" />
                    </button>

                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button className="p-2 hover:bg-white border border-gray-300 rounded-lg transition-colors">
                      <ChevronRight size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      </div>
    </>
  );
};

export default Library;
