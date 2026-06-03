import React from 'react';

function ProductCard({ product, onAddToCart, currentUser, onDeleteProduct }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group flex flex-col h-full">
      
      {/* 🗑️ ADMIN TRASH REMOVE BUTTON */}
      {currentUser?.role === 'admin' && (
        <button
          onClick={(e) => onDeleteProduct(product._id, e)}
          className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md hover:bg-red-50 text-gray-500 hover:text-red-600 p-2.5 rounded-xl transition duration-200 border border-gray-100 shadow-xs cursor-pointer group/btn"
          title="Delete Product from Inventory"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 transform group-hover/btn:scale-110 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      )}

      {/* Product Image Display Layout */}
      <div className="aspect-square w-full bg-gray-100 overflow-hidden relative">
        <img 
          src={product.image || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">
            {product.category}
          </span>
          <h4 className="text-sm font-bold text-gray-950 line-clamp-2 mb-2">
            {product.name}
          </h4>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-4">
          <span className="text-base font-black text-gray-950">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onAddToCart(product);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
          >
            Add +
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;