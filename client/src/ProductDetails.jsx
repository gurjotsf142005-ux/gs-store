import React, { useState } from 'react';

function ProductDetails({ product, onAddToCart, onClose }) {
  // ⚡ NEW: State to track which size button is active
  const [selectedSize, setSelectedSize] = useState('M');

  // Available sizes array for clothing items
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Soft dark blur backdrop filter layer */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose}></div>

      {/* Main Modal Display Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10 max-h-[90vh] overflow-y-auto md:overflow-visible">
        
        {/* Close Button Anchor */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white backdrop-blur-xs p-2 rounded-xl text-gray-500 hover:text-gray-900 transition shadow-xs cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Column 1: Media Showcase Frame */}
        <div className="relative bg-gray-50 aspect-square md:h-full w-full overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-500" 
          />
          {product.stock <= 5 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs animate-pulse">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Column 2: Data Content Details Block Layout */}
        <div className="p-6 sm:p-8 flex flex-col justify-between h-full bg-white">
          <div>
            {/* Category Tag Header */}
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
              {product.category} Collection
            </span>
            
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight mt-3 leading-tight">
              {product.name}
            </h2>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Product Overview</span>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                {product.description || "Premium curated item tailored for maximum comfort and high-end aesthetics."}
              </p>
            </div>

            {/* ⚡ NEW: Interactive Size Selector (Only shows up for clothing departments!) */}
            {product.category !== "Electronics" && (
              <div className="mt-6">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-2">Select Size</span>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer Pricing & Checkout Action */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">M.R.P. Total</span>
              <span className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => {
                // Pass the selected size along with the product details to the cart state!
                onAddToCart({ ...product, selectedSize: product.category !== "Electronics" ? selectedSize : null });
                onClose();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-4 rounded-xl shadow-xs hover:shadow-md transition duration-200 text-center cursor-pointer"
            >
              Add Item To Bag 🛍️
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;