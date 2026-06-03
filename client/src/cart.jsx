import React, { useState } from 'react';
import axios from 'axios';

function Cart({ 
  cartItems, 
  currentUser, 
  onClose, 
  onLoginTrigger, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // 📝 Desized Granular Form Inputs States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [streetNo, setStreetNo] = useState('');
  const [city, setCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [country, setCountry] = useState('');

  // Calculate Grand Total of products inside checkout inventory state
  const grandTotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || item.price || 0) * item.quantity, 
    0
  );

  // ⚡ TRANSACTION DISPATCHER WITH GRANULAR SHIPPING PAYLOAD
  const handlePlaceOrder = async (e) => {
    e.preventDefault(); 

    if (!currentUser) {
      setErrorMessage("❌ Login Required: Please log in to complete your transaction checkout securely.");
      setTimeout(() => { onLoginTrigger(); }, 1500);
      return;
    }

    // 📋 VALIDATION CONTROL: Enforce all granular inputs are provided
    if (!phoneNumber || !houseNo || !streetNo || !city || !shippingState || !country) {
      setErrorMessage("⚠️ Input Required: Please supply every form parameter to authorize delivery fulfillment.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const formattedItems = cartItems.map((item) => {
        const structuralId = item.product?._id || item.product?.id || item._id || item.productId;
        const structuralPrice = item.product?.price || item.price || 0;
        const structuralName = item.product?.name || item.name || "Premium Catalog Item";

        return {
          productId: structuralId, 
          name: structuralName,
          quantity: item.quantity || 1,
          price: structuralPrice,
          size: item.size || 'M' 
        };
      });

      // Pack the cleanly separated fields inside the final object payload cargo
      const orderPayload = {
        userId: currentUser.id || currentUser._id,
        items: formattedItems,
        totalAmount: grandTotal,
        paymentMode: "COD",
        shippingDetails: {
          phone: phoneNumber,
          houseNo: houseNo,
          streetNo: streetNo,
          city: city,
          state: shippingState,
          country: country
        }
      };

      console.log("🚀 DISPATCHING GRANULAR LEDGER PACK:", orderPayload);

      const response = await axios.post('http://localhost:9001/api/order', orderPayload);

      if (response.data.success) {
        alert("🎉 Order Successful! Your detailed delivery matrix has been locked into the cluster.");
        onClearCart(); 
        onClose();     
      }
    } catch (err) {
      console.error("Critical checkout fault log:", err);
      setErrorMessage(
        err.response?.data?.message || "💥 Server rejected transaction placement validation checks."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
        
        {/* Drawer Header Segment */}
        <div className="px-6 py-5 border-b border-b-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-950 tracking-tight">Shopping Cart</h2>
            <p className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
              {cartItems.length} {cartItems.length === 1 ? 'Item Selected' : 'Items Selected'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Live Validation Warning Alert Bar Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-100 text-red-800 text-xs font-bold p-3 rounded-xl leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Core Content Scroll Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-none">
          
          {/* Selected Products List */}
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <span className="text-4xl mb-3">🛒</span>
                <h3 className="text-sm font-bold text-gray-900">Your bag is completely empty</h3>
              </div>
            ) : (
              cartItems.map((item) => {
                const productObj = item.product || item;
                const displayId = productObj._id || productObj.id;
                
                return (
                  <div key={displayId} className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-3 relative group shadow-2xs">
                    <button onClick={() => onRemoveItem(displayId)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1 rounded-md transition cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100/50">
                      <img src={productObj.image} alt={productObj.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-xs font-bold text-gray-950 truncate">{productObj.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] font-black uppercase bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{productObj.category}</span>
                        <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">SIZE: M</span>
                      </div>

                      <div className="flex items-center gap-2.5 mt-3 bg-gray-50 border border-gray-100 rounded-lg w-fit px-2 py-1">
                        <button onClick={() => onUpdateQuantity(displayId, item.quantity - 1)} className="text-gray-500 font-black text-xs px-1">-</button>
                        <span className="text-xs font-black text-gray-950 min-w-[12px] text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(displayId, item.quantity + 1)} className="text-gray-500 font-black text-xs px-1">+</button>
                      </div>
                    </div>

                    <div className="text-right self-end pb-1">
                      <span className="text-sm font-black text-gray-950">₹{((productObj.price || 0) * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 🏡 GRANULAR ADDRESS FORM FIELDS (🔒 NOW AUTHENTICATION LOCKED) */}
          {cartItems.length > 0 && currentUser && (
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="flex items-center gap-2 text-gray-900">
                <span className="text-lg">📍</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-950">Detailed Logistics Form</h3>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-3.5">
                {/* Field 1: Phone Number */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">Contact Phone Number</label>
                  <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g., 98765XXXXX" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
                </div>

                {/* Fields 2 & 3: House No & Street No */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">House / Flat No</label>
                    <input type="text" required value={houseNo} onChange={(e) => setHouseNo(e.target.value)} placeholder="e.g., H.No 124" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">Street / Ward No</label>
                    <input type="text" required value={streetNo} onChange={(e) => setStreetNo(e.target.value)} placeholder="e.g., Street No 4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
                  </div>
                </div>

                {/* Field 4: City */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">City / Town</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., New Delhi" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
                </div>

                {/* Fields 5 & 6: State & Country */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">State</label>
                    <input type="text" required value={shippingState} onChange={(e) => setShippingState(e.target.value)} placeholder="e.g., Punjab" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wide text-gray-400 mb-1">Country</label>
                    <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g., India" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-hidden focus:border-blue-600" />
                  </div>
                </div>

                <input type="submit" className="hidden" />
              </form>
            </div>
          )}

        </div>

        {/* Bottom Checkout Controller Summary */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-gray-500">Subtotal Valuation</span>
              <span className="font-black text-gray-950 text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold border-b border-gray-100 pb-3">
              <span>Shipping / Logistics</span>
              <span className="text-green-600 font-bold uppercase tracking-wider">FREE DELIVERY</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold py-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Locking Manifest Matrix...</span>
              ) : !currentUser ? (
                <span>Login to Checkout 🔒</span>
              ) : (
                <span>Verify Form & Place Order 🚀</span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;