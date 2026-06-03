import React, { useState } from 'react';
import axios from 'axios';

function Auth({ onClose, onAuthSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [otp, setOtp] = useState(''); // ⚡ Future Hook

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:9001/api/user/register', { name, email, password });
      if (response.data.success) {
        alert('🎉 Account created successfully!');
        onAuthSuccess(response.data.user); // Logs in instantly
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || '💥 Registration process rejected by server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:9001/api/user/login', { email, password });
      if (response.data.success) {
        onAuthSuccess(response.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || '❌ Invalid Email or Password configuration.');
    } finally {
      setLoading(false);
    }
  };

  /* ⚡ FUTURE HANDLER HOOK: Reactivate when turning OTP back on
  const handleVerifyOtp = async (e) => { ... }
  */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose}></div>

      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all border border-gray-100">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            {isLoginView ? 'Access your orders and fast checkout.' : 'Join us to track history and save products.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-800 text-xs font-bold p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your Name" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-hidden transition bg-gray-50/50 font-bold" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-hidden transition bg-gray-50/50 font-bold" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-hidden transition bg-gray-50/50 font-bold" />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition transform hover:-translate-y-0.5 cursor-pointer mt-2 disabled:bg-blue-400">
            {loading ? 'Processing...' : isLoginView ? 'Sign In Securely 🔒' : 'Register Account 🚀'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-50 pt-4">
          {isLoginView ? (
            <p>New to GS Store? <button type="button" onClick={() => { setIsLoginView(false); setError(null); }} className="font-semibold text-blue-600 hover:underline cursor-pointer">Create account</button></p>
          ) : (
            <p>Already have an account? <button type="button" onClick={() => { setIsLoginView(true); setError(null); }} className="font-semibold text-blue-600 hover:underline cursor-pointer">Sign in</button></p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Auth;