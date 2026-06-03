import React, { useState } from 'react';
import axios from 'axios';

function AddProductModal({ onClose, onProductAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Clothing',
    image: '',
    stock: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    // Parsing number fields safely before shipping payload
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      // Pinging your live Express controller endpoint loop
      const response = await axios.post('http://localhost:9001/api/products', payload);
      
      if (response.data.success) {
        // Trigger a fresh state reload in App.jsx to show the new card instantly
        onProductAdded();
        onClose();
      }
    } catch (err) {
      console.error("Error creating record:", err);
      setFormError(err.response?.data?.message || "Failed to add product to database.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent blur overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose}></div>

      {/* Form Card Body */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Add New Product</h2>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Insert items directly into MongoDB</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {formError && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-800 text-xs font-semibold p-3 rounded-xl">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Product Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Plaid Flannel Shirt" className="w-full px-4 py-3 bg-gray-50 text-sm font-medium border border-gray-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:bg-white transition" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Price (₹)</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} placeholder="1499" className="w-full px-4 py-3 bg-gray-50 text-sm font-medium border border-gray-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:bg-white transition" />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Stock Count</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="10" className="w-full px-4 py-3 bg-gray-50 text-sm font-medium border border-gray-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:bg-white transition" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 text-sm font-medium border border-gray-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:bg-white transition cursor-pointer">
              <option value="Clothing">Clothing</option>
              <option value="Audio">Audio</option>
              <option value="Peripherals">Peripherals</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Image Asset URL</label>
            <input required type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 bg-gray-50 text-xs text-blue-600 font-medium border border-gray-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:bg-white transition" />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
            <textarea required rows="3" name="description" value={formData.description} onChange={handleChange} placeholder="Provide exquisite detail tracking features..." className="w-full px-4 py-3 bg-gray-50 text-sm font-medium border border-gray-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:bg-white transition resize-none"></textarea>
          </div>

          <button type="submit" disabled={submitting} className="w-full mt-2 bg-gray-900 hover:bg-black text-white text-sm font-bold py-4 rounded-xl shadow-md transition disabled:bg-gray-400 cursor-pointer">
            {submitting ? "Pushing to Cluster..." : "Publish Product Live"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default AddProductModal;