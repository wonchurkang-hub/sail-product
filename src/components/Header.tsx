import React, { useState } from 'react';
import { ShoppingBag, Search, HelpCircle, Laptop, Sliders, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenSupport: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function Header({
  cart,
  onOpenCart,
  onOpenSupport,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['All', 'Keyboards', 'Audio', 'Accessories', 'Lighting'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO AREA */}
        <div id="header-logo" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white shadow-sm transition hover:scale-105">
            <span className="font-mono text-lg font-bold tracking-tighter">O</span>
          </div>
          <div>
            <h1 className="font-sans text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
              Object & Space
            </h1>
            <p className="hidden font-mono text-[10px] tracking-widest text-gray-400 sm:block uppercase">
              Curated Desk Elements
            </p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav id="header-nav" className="hidden lg:flex lg:items-center lg:space-x-8">
          {categories.map((category) => (
            <button
              key={category}
              id={`nav-link-${category.toLowerCase()}`}
              onClick={() => setActiveCategory(category)}
              className={`font-sans text-sm font-medium transition duration-200 hover:text-gray-900 ${
                (category === 'All' && activeCategory === 'All') || activeCategory === category
                  ? 'text-gray-900 underline underline-offset-8 decoration-gray-900 decoration-2'
                  : 'text-gray-500'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* INTERACTION AREA */}
        <div id="header-actions" className="flex items-center space-x-4">
          
          {/* SEARCH BAR INPUT toggle-controlled */}
          <div className="relative flex items-center">
            <button
              id="search-toggle-btn"
              onClick={() => setShowSearch(!showSearch)}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition"
              title="Search Catalog"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {(showSearch || searchQuery) && (
              <div id="search-input-box" className="absolute right-10 top-1/2 w-48 -translate-y-1/2 cursor-default sm:w-64">
                <input
                  type="text"
                  placeholder="Find premium accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white py-1 px-4 text-xs font-sans text-gray-800 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 shadow-sm"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-sans text-xs"
                    title="Clear Search"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SIMULATED CONTACT / HELPDESK SUPPORT */}
          <button
            id="support-toggle-btn"
            onClick={onOpenSupport}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition flex items-center space-x-1"
            title="Desk Assistant"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="hidden md:inline text-xs font-sans select-none text-gray-600 hover:text-gray-900 font-medium">Assistant</span>
          </button>

          {/* PERSISTENT SHOPPING CART DROPDOWN/DRAWER TRIGGER */}
          <button
            id="cart-toggle-btn"
            onClick={onOpenCart}
            className="group relative flex items-center space-x-1 rounded-full bg-gray-50 py-1.5 px-3 hover:bg-gray-950 hover:text-white transition duration-200"
            title="Open cart drawer"
          >
            <ShoppingBag className="h-4 w-4 text-gray-700 group-hover:text-white transition" />
            <span className="text-xs font-semibold text-gray-800 group-hover:text-white font-mono select-none">
              Cart
            </span>
            {totalItems > 0 && (
              <span id="cart-badge" className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE CATEGORIES STREAM */}
      <div id="mobile-category-bar" className="flex border-t border-gray-50 bg-gray-50/50 py-2.5 px-4 overflow-x-auto scrollbar-none lg:hidden">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              id={`mobile-nav-link-${category.toLowerCase()}`}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3.5 py-1 text-xs font-sans font-medium whitespace-nowrap transition ${
                activeCategory === category
                  ? 'bg-gray-950 text-white'
                  : 'bg-white text-gray-600 border border-gray-150'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
