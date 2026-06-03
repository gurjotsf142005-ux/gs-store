import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel({ currentUser }) {
  // Navigation layout tracking for the panel submenus ("products", "orders")
  const [adminTab, setAdminTab] = useState('products');

  // Product Creation States
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  // Global Management List States
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch all user transactions from the cluster
  const fetchGlobalOrdersList = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get('http://localhost:9001/api/order/all', {
        headers: { 'role': currentUser?.role }
      });
      if (response.data.success) {
        setAllOrders(response.data.orders || []);
      }
    } catch (err) {
      console.error("Failed to read system transactions ledger:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (adminTab === 'orders') {
      fetchGlobalOrdersList();
    }
  }, [adminTab]);

  // Handle inventory upload submission
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const productPayload = { name, price: Number(price), category, image, description };

    try {
      const response = await axios.post('http://localhost:9001/api/products', productPayload, {
        headers: { 'role': currentUser?.role }
      });
      if (response.data.success) {
        setMessage({ type: 'success', text: '🎁 Product added to live store inventory successfully!' });
        setName(''); setPrice(''); setImage(''); setDescription('');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to populate inventory.' });
    } finally {
      setLoading(false);
    }
  };

  // ⚡ ACTION TRIGGER: Updates status to MongoDB and refreshes current dashboard layout state
  const handleStatusChange = async (orderId, targetStatus) => {
    try {
      const response = await axios.put(`http://localhost:9001/api/order/${orderId}/status`, 
        { status: targetStatus },
        { headers: { 'role': currentUser?.role } }
      );
      if (response.data.success) {
        alert(`🚚 Fulfillment tracker switched to ${targetStatus}!`);
        // Fast UI local replacement array iteration loop
        setAllOrders(prev => prev.map(order => order._id === orderId ? { ...order, status: targetStatus } : order));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Fulfillment update was rejected by server gates.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Upper Dashboard Submenu Tabs Bar Selector */}
      <div className="flex border-b border-gray-200 gap-4 mb-4">
        <button 
          onClick={() => { setAdminTab('products'); setMessage(null); }}
          className={`pb-3 text-sm font-black uppercase tracking-wider transition cursor-pointer ${
            adminTab === 'products' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          ➕ Add New Item
        </button>
        <button 
          onClick={() => { setAdminTab('orders'); setMessage(null); }}
          className={`pb-3 text-sm font-black uppercase tracking-wider transition cursor-pointer ${
            adminTab === 'orders' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          📦 Manage Active Orders ({allOrders.length})
        </button>
      </div>

      {/* 🔴 WORKSPACE TAB 1: PRODUCT UPLOADER GRID SUB-RENDER */}
      {adminTab === 'products' && (
        <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-xs">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-black text-gray-950 tracking-tight">Owner Inventory Management</h2>
            <p className="text-xs text-gray-400 font-medium mt-1">Upload brand new inventory assets directly to the MongoDB product collection cluster</p>
          </div>

          {message && (
            <div className={`mb-5 p-3 rounded-xl text-xs font-bold border ${
              message.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Product Title</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Premium Plaid Shirt" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Price (₹ INR)</label>
                <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1499" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Category Department</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-700 focus:outline-hidden focus:border-blue-600 cursor-pointer">
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Image URL</label>
                <input type="text" required value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Product Specifications Description</label>
              <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detail structural fabrics fit parameters or audio capacities..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden focus:border-blue-600 resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gray-950 hover:bg-black disabled:bg-gray-400 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition duration-150 cursor-pointer text-center shadow-xs">
              {loading ? 'Injecting Document to Cluster...' : 'Publish Product to Live Marketplace 🚀'}
            </button>
          </form>
        </div>
      )}

      {/* 🔵 WORKSPACE TAB 2: GLOBAL TRANSACTION ORDER FULFILLMENT MONITOR */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-950 tracking-tight">E-Commerce Shipment Dispatch Center</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Inspect customer checkouts, evaluate subtotal logs, and manage live tracking milestones</p>
            </div>
            <button onClick={fetchGlobalOrdersList} className="bg-gray-50 border border-gray-200 font-bold px-4 py-2 rounded-xl text-xs hover:bg-gray-100 transition cursor-pointer">
              🔄 Refresh Orders
            </button>
          </div>

          {ordersLoading ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-xs text-gray-400 mt-3 font-bold tracking-wide uppercase">Syncing complete checkout clusters...</p>
            </div>
          ) : allOrders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
              <span className="text-3xl block mb-2">📦</span>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">No customer invoices available in database records.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allOrders.map((order) => (
                <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col gap-4">
                  
                  {/* Upper Invoice Metadata Strip Segment */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 pb-3">
                    <div className="text-xs font-mono font-bold text-gray-700">
                      <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider font-sans mb-0.5">INVOICE HEX ID</span>
                      {order._id}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider mb-0.5">CUSTOMER RECIPIENT</span>
                      <span className="text-xs font-bold text-gray-950">{order.userId?.name || "Guest Customer Account"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider mb-0.5">GRAND TOTAL AMOUNT</span>
                      <span className="text-sm font-black text-blue-600">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>

                    {/* 🚚 LIVE TRACKING SELECT DROPDOWN ELEMENT */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">TRACKING STATUS:</span>
                      <select 
                        value={order.status || 'Pending'} 
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-black px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-hidden shadow-2xs transition-colors ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Pending">🕒 Pending</option>
                        <option value="Shipped">🚚 Shipped</option>
                        <option value="Delivered">✅ Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Nested Purchases Items Sub-Mapping Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/50 border border-gray-50/70 p-3 rounded-xl">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-xs">
                        <span className="font-mono bg-gray-200/70 px-1.5 py-0.5 rounded text-gray-600 text-[10px] font-bold">x{item.quantity}</span>
                        <div className="flex-1 font-bold text-gray-800 truncate">{item.name || "Catalog Product Asset"}</div>
                        <span className="text-gray-400 font-bold">SIZE: {item.size || 'M'}</span>
                        <span className="font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;