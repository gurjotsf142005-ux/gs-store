import React from 'react';

function Navbar({ 
  cartCount, 
  onCartClick, 
  onLoginClick, 
  activeView, 
  onViewChange,
  currentUser,
  onLogout // ⚡ Destructured logout callback function properties
}) {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onViewChange("shop")}>
            <span className="text-xl font-black text-gray-950 tracking-tight">
              GS <span className="text-blue-600">Store</span>
            </span>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onViewChange("shop")} 
              className={`text-sm font-semibold transition cursor-pointer ${
                activeView === "shop" ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Shop
            </button>
            <button 
              onClick={() => onViewChange("categories")} 
              className={`text-sm font-semibold transition cursor-pointer ${
                activeView === "categories" ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Categories
            </button>
            <button 
              onClick={() => onViewChange("orders")} 
              className={`text-sm font-semibold transition cursor-pointer ${
                activeView === "orders" ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Orders
            </button>

            {/* 🛡️ SECURITY WATCH: Show Admin tab ONLY to the store owner */}
            {currentUser?.role === 'admin' && (
              <button 
                onClick={() => onViewChange("admin")} 
                className={`text-sm font-bold transition cursor-pointer px-3 py-1.5 rounded-lg ${
                  activeView === "admin" 
                    ? "bg-red-50 text-red-600 font-extrabold" 
                    : "text-red-500 hover:bg-red-50/50"
                }`}
              >
                🛡️ Admin Panel
              </button>
            )}
          </div>

          {/* Right: Cart & Login Actions */}
          <div className="flex items-center gap-4">
            
            {/* Bag Icon with Counter */}
            <button 
              onClick={onCartClick} 
              className="relative p-2 text-gray-500 hover:text-blue-600 rounded-xl transition cursor-pointer flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ⚡ ACCOUNT BLOCK WITH LOGOUT HOOK: */}
            {currentUser ? (
              <div className="flex flex-col items-end gap-0.5">
                <span className="bg-gray-100 text-gray-900 text-xs font-bold px-3.5 py-1.5 rounded-xl max-w-[130px] truncate select-none">
                  Hi, {currentUser.name.split(' ')[0]} 👋
                </span>
                <button 
                  onClick={onLogout}
                  className="text-[10px] text-gray-400 hover:text-red-500 font-bold transition uppercase tracking-wide cursor-pointer mr-1"
                >
                  [ Logout ]
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="bg-gray-950 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
              >
                Login
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;