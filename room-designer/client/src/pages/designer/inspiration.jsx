import React, { useState } from 'react';
import LoggedInNavbar from '../../components/LoggedInNavbar';
import DesignerSidebar from '../../components/DesignerSidebar';
import livingspace from '../../assets/livingspace.png';
import heightsloft from '../../assets/heightsloft.png';
import contemporary_dining from '../../assets/contemporary_dining.png';
import hideaway from '../../assets/hideaway.png';
import { Heart, Plus, ChevronDown, BookmarkPlus, List } from "lucide-react";


import '../../styles/designer/Inspiration.css';
const Inspiration = () => {
  const [activeStyle, setActiveStyle] = useState('All Styles');
  const [savedDesigns, setSavedDesigns] = useState([]);

  const styleFilters = [
    { name: 'All Styles', hasDropdown: false },
    { name: 'Modern', hasDropdown: true },
    { name: 'Industrial', hasDropdown: true },
    { name: 'Minimalist', hasDropdown: true },
    { name: 'Scandinavian', hasDropdown: true }
  ];

  const inspirationCards = [
    {
      id: 1,
      title: 'Sun-Drenched Living Space',
      subtitle: 'Professional Render',
      itemsUsed: 45,
      image: livingspace,
      badge: 'MODERN',
      badgeColor: 'bg-blue-600',
      saved: false
    },
    {
      id: 2,
      title: 'Brooklyn Heights Loft',
      subtitle: 'Student Design',
      itemsUsed: 32,
      image: heightsloft,
      badge: 'INDUSTRIAL',
      badgeColor: 'bg-blue-600',
      saved: false
    },
    {
      id: 3,
      title: 'Contemporary Dining',
      subtitle: 'Pro Visualization',
      itemsUsed: 28,
      image: contemporary_dining,
      badge: 'MINIMAL',
      badgeColor: 'bg-blue-600',
      saved: false
    },
    {
      id: 4,
      title: 'Nordic Winter Hideaway',
      subtitle: 'Professional Render',
      itemsUsed: 38,
      image: hideaway,
      badge: 'SCANDINAVIAN',
      badgeColor: 'bg-blue-600',
      saved: false
    }
  ];

  const toggleSave = (id) => {
    if (savedDesigns.includes(id)) {
      setSavedDesigns(savedDesigns.filter(designId => designId !== id));
    } else {
      setSavedDesigns([...savedDesigns, id]);
    }
  };

  return (
    <>
      <LoggedInNavbar userRole="designer" />
      <div className="des-wrapper">
      <DesignerSidebar />
      <div className="des-frame">
        <div className="des-layout">
        

        {/* Main Content Area */}
        <main className="des-content bg-white">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Page Title & New Project Button */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Inspiration</h1>
                <p className="text-gray-600 text-base max-w-2xl">
                  Explore professional room renders curated by our top designers. Discover the layouts and products that bring these spaces to life.
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                <Plus size={18} />
                New Project
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-8 mt-6">
              {styleFilters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setActiveStyle(filter.name)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                    activeStyle === filter.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.name}
                  {filter.hasDropdown && <ChevronDown size={14} />}
                </button>
              ))}
            </div>

            {/* Inspiration Cards Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {inspirationCards.map((card) => (
                <div key={card.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative h-64 bg-gray-200">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`${card.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded`}>
                        {card.badge}
                      </span>
                    </div>
                    {/* Heart Icon */}
                    <button
                      onClick={() => toggleSave(card.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart
                        size={20}
                        className={`${savedDesigns.includes(card.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {card.subtitle} • {card.itemsUsed} items used
                    </p>

                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <List size={16} />
                        See Items Used
                      </button>
                      <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <BookmarkPlus size={20} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Section */}
            <div className="text-center">
              <button className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors mb-4">
                Load More Inspiration
              </button>
              <p className="text-sm text-gray-500">Showing 8 of 248 designs</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</>
);
};


export default Inspiration;

