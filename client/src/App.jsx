import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Hero from './Component/Hero';
import ProductCard from './ProductCard';
import Auth from './Auth';
import Cart from './Cart';
import ProductDetails from './ProductDetails';
import AdminPanel from './AdminPanel';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core State to track multi-page application routing layouts ("shop", "categories", "orders", "admin")
  const [view, setView] = useState("shop");

  // ⚡ Live user session tracking state hooks
  const [currentUser, setCurrentUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchLiveProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:9001/api/products');
      setProducts(response.data.products);
      setError(null);
    } catch (err) {
      console.error("Error communicating with backend:", err);
      setError("Could not connect to the product database server.");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ GLOBAL DELETE HANDLER: Removes item from database cluster and triggers state filter
  const deleteLiveProduct = async (productId, e) => {
    e.stopPropagation(); // Stops detail modal from popping open
    
    if (!window.confirm("⚠️ Are you completely sure you want to delete this product from the inventory?")) return;

    try {
      const response = await axios.delete(`http://localhost:9001/api/products/${productId}`, {
        headers: { 'role': currentUser?.role }
      });

      if (response.data.success) {
        alert("🗑️ Product removed successfully!");
        setProducts(prevProducts => prevProducts.filter(item => item._id !== productId));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item from database.");
    }
  };

  // ⚡ Routine to fetch live orders from your MongoDB backend cluster
  const fetchUserOrders = async () => {
    if (!currentUser) return; 
    
    try {
      setOrdersLoading(true);
      const userId = currentUser.id || currentUser._id;
      const response = await axios.get(`http://localhost:9001/api/order?userId=${userId}`);
      
      if (response.data.success) {
        setUserOrders(response.data.orders || response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching user history logs:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // ⚡ LOGOUT PROCESSOR: Wipes active session memory arrays, completely flushes cart, and routes back home
  const handleLogoutUser = () => {
    setCurrentUser(null);
    setUserOrders([]);
    setCart([]); // 🎯 FIXED: Explicitly clear the cart state to prevent unauthenticated memory persistence leaks
    setView("shop");
    alert("🔒 Logged out successfully. Your secure session has closed and the cart has been emptied.");
  };

  useEffect(() => {
    fetchLiveProducts();
  }, []);

  useEffect(() => {
    if (view === "orders" && currentUser) {
      fetchUserOrders();
    }
  }, [view, currentUser]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Filter layout logic loop
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Dynamic array re-ordering sorting logic block
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceLowHigh") return a.price - b.price;
    if (sortBy === "priceHighLow") return b.price - a.price;
    return 0;
  });

  // Universal list representing your marketplace departments
  const categoriesList = ["All", "Men", "Women", "Kids", "Electronics"];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
      <Navbar
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsAuthOpen(true)}
        activeView={view}
        onViewChange={setView}
        currentUser={currentUser}
        onLogout={handleLogoutUser} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* 🟢 VIEW 1: MAIN SHOP INTERFACE */}
        {view === "shop" && (
          <>
            <Hero searchValue={searchTerm} onSearchChange={setSearchTerm} />

            {/* Interactive Category Navigation Pills Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight border transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-gray-600 border-gray-100 hover:bg-gray-100/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Section Title Container */}
            <div className="mb-8 border-b border-gray-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                  {selectedCategory !== "All" ? `${selectedCategory} Collection` : "Featured Collections"}
                </h2>
                {searchTerm && <p className="text-xs text-gray-400 mt-1 font-semibold">Filtering search matches for "{searchTerm}"</p>}
              </div>

              {/* Sorting Dropdown Selector Element */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
                >
                  <option value="default">Featured / Default</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Display System */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-sm font-bold text-red-800">{error}</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl p-8">
                <p className="text-sm font-bold text-gray-800">No products match your current filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map((item) => (
                  <div key={item._id} onClick={() => setSelectedProduct(item)} className="cursor-pointer relative group">
                    <ProductCard 
                      product={item} 
                      onAddToCart={(prod) => addToCart(prod)} 
                      currentUser={currentUser}
                      onDeleteProduct={(id, e) => deleteLiveProduct(id, e)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 🔵 VIEW 2: DEDICATED CATEGORIES VISUAL GRID */}
        {view === "categories" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-5">
              <h2 className="text-3xl font-black text-gray-950 tracking-tight">Browse Collections</h2>
              <p className="text-xs text-gray-400 font-medium mt-1">Explore our inventory curated by technical and stylistic categories</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {["Men", "Women", "Kids", "Electronics"].map((cat) => (
                <div
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setView("shop"); }}
                  className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between aspect-video relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 text-4xl opacity-10 group-hover:scale-110 transition-transform duration-300 select-none">
                    {cat === "Men" ? "🧔" : cat === "Women" ? "👩" : cat === "Kids" ? "🧒" : "⚡"}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Collection</span>
                    <h3 className="text-xl font-black text-gray-900 mt-1">{cat}</h3>
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors flex items-center gap-1 mt-4">
                    View Items &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⚡ VIEW 3: LIVE RECEIPT HISTORY TRACKER */}
        {view === "orders" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-5 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-gray-950 tracking-tight">Your Orders</h2>
                <p className="text-xs text-gray-400 font-medium mt-1">Monitor historical and real-time transaction updates</p>
              </div>
              {currentUser && (
                <button
                  onClick={fetchUserOrders}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer transition flex items-center gap-1.5"
                >
                  🔄 Refresh Logs
                </button>
              )}
            </div>

            {!currentUser ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center max-w-md mx-auto shadow-xs">
                <span className="text-3xl block mb-3">🔒</span>
                <h4 className="text-sm font-bold text-gray-900">Authentication Required</h4>
                <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                  Please log in to your secure profile account to inspect transaction logs.
                </p>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition cursor-pointer"
                >
                  Sign In / Register
                </button>
              </div>
            ) : ordersLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-xs text-gray-400 mt-3 font-semibold tracking-wide">Syncing MongoDB order documents...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center max-w-md mx-auto shadow-xs">
                <span className="text-3xl block mb-3">📦</span>
                <h4 className="text-sm font-bold text-gray-900">No Orders Placed Yet</h4>
                <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">
                  When you proceed to checkout and finalize transactions, your receipt summaries will render right here.
                </p>
                <button
                  onClick={() => setView("shop")}
                  className="mt-5 bg-gray-950 hover:bg-black text-white font-bold text-xs px-5 py-3 rounded-xl transition cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {userOrders.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs transition hover:shadow-md">
                    <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-gray-50 mb-4">
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase block">Order Identification</span>
                        <span className="text-xs font-bold text-gray-700 font-mono">{order._id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase block">Date Processed</span>
                        <span className="text-xs font-bold text-gray-600">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Just Now'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase block">Payment Method</span>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {order.paymentMode || 'COD'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase block">Grand Total Paid</span>
                        <span className="text-sm font-black text-gray-950">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-gray-50/50 border border-gray-50 rounded-xl p-2.5">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                            {item.product?.image && (
                              <img src={item.product.image} alt="purchased" className="w-full h-full object-cover" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-gray-950 line-clamp-1">
                              {item.product?.name || "Premium Store Inventory Item"}
                            </h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-gray-400">Qty: {item.quantity}</span>
                              {item.size && (
                                <span className="text-[9px] font-black bg-gray-200/60 text-gray-600 px-1 rounded-sm">
                                  SIZE: {item.size}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-xs font-black text-gray-950">
                              ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🛡️ VIEW 4: OWNER INVENTORY MANAGEMENT (ADMIN PANEL GATE) */}
        {view === "admin" && currentUser?.role === "admin" && (
          <AdminPanel currentUser={currentUser} />
        )}

      </main>

      {isCartOpen && (
        <Cart
          cartItems={cart}
          currentUser={currentUser}
          onClose={() => setIsCartOpen(false)}
          onLoginTrigger={() => {
            setIsCartOpen(false);  
            setIsAuthOpen(true);    
          }}
          onUpdateQuantity={(id, qty) => {
            if (qty <= 0) setCart(prev => prev.filter(i => i.product._id !== id));
            else setCart(prev => prev.map(i => i.product._id === id ? { ...i, quantity: qty } : i));
          }}
          onRemoveItem={(id) => setCart(prev => prev.filter(i => i.product._id !== id))}
          onClearCart={() => setCart([])}
        />
      )}

      {isAuthOpen && (
        <Auth
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setCart([]); // 🎯 FIXED: Flushes any prior unauthenticated/residual guest states on successful login
            alert(`👋 Welcome ${user.name}! You are now authorized to complete transactions.`);
          }}
        />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onAddToCart={addToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default App;