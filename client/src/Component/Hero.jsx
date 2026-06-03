import React from 'react';

function Hero({ searchValue, onSearchChange }) {
  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white shadow-xl">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>

      <div className="relative max-w-3xl px-8 py-12 sm:px-12 sm:py-16 lg:px-16">
        <span className="inline-flex items-center rounded-full bg-blue-400/20 px-3 py-1 text-xs font-bold tracking-wider text-blue-200 uppercase mb-4 backdrop-blur-xs">
          ✨ Exclusive Curations Live
        </span>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl max-w-2xl leading-none">
          Discover Premium <br />
          <span className="text-blue-300">Style & Tech Gear</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm sm:text-base text-blue-100/90 leading-relaxed font-medium">
          Explore curated winter wardrobe essentials matching your premium aesthetic alongside elite developer tech accessories.
        </p>

        {/* Search Bar inside Hero */}
        <div className="mt-8 max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-400 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </div>
          <input 
            type="text" 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search clothes, audio, peripherals..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-900 placeholder-gray-400 font-medium text-sm rounded-2xl shadow-md border border-transparent focus:outline-hidden focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

      </div>
    </div>
  );
}

export default Hero;