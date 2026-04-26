import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRFQ, createAuction } from '../lib/db.js';
import { CURRENCIES, AUCTION_STATUS } from '../lib/types.js';
import Navbar from '../components/Navbar.jsx';

const CreateRFQ = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: '', date: '', origin: '', destination: '', description: '',
    currency: 'USD',
    bidStart: '', bidClose: '', forcedClose: '', trigger: '2', extension: '2',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) { navigate('/signin'); return; }
    const currentUser = JSON.parse(userStr);
    if (currentUser.role !== 'buyer') { navigate('/dashboard'); return; }
    setUser(currentUser);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title || !form.origin || !form.destination || !form.date) {
      setError('Please fill in all required fields'); return;
    }
    setLoading(true);
    try {
      const rfq = await createRFQ({
        title: form.title, description: form.description, origin: form.origin,
        destination: form.destination, pickupDate: new Date(form.date),
        currency: form.currency,
      });

      if (form.bidStart && form.bidClose && form.forcedClose) {
        await createAuction({
          rfqId: rfq._id,
          bidStartTime: new Date(form.bidStart),
          bidCloseTime: new Date(form.bidClose),
          forcedCloseTime: new Date(form.forcedClose),
          triggerWindowMinutes: parseInt(form.trigger) || 2,
          extensionDurationMinutes: parseInt(form.extension) || 2,
          status: new Date(form.bidStart) <= new Date() ? 'active' : 'scheduled',
        });
      }

      setSuccess('RFQ & Auction created successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create RFQ');
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    navigate('/signin');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">Loading...</p>
      </div>
    );
  }

  const currencyList = Object.values(CURRENCIES);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <Navbar user={user} onLogout={handleLogout} showNewRFQ />

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10 slide-up">
          <p className="text-[12px] tracking-[0.3em] text-gray-500 uppercase font-bold mb-3">
            Procurement
          </p>
          <h1 className="text-[44px] font-semibold tracking-tight leading-tight mb-4">Create RFQ</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Initialize a new Request for Quotation. Define your shipment requirements, configure the auction window, and let the market compete.
          </p>
        </div>

        {/* Messages */}
        {error && <div className="mb-8 p-5 rounded-xl border border-red-500/30 text-red-400 text-base bg-red-500/10 font-medium">{error}</div>}
        {success && <div className="mb-8 p-5 rounded-xl border border-green-500/30 text-green-400 text-base bg-green-500/10 font-medium">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-10 fade-in">

          {/* REQUEST DETAILS */}
          <div className="bg-zinc-900 rounded-[20px] p-8 md:p-10 shadow-2xl border border-zinc-800/80">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
              <div className="h-8 w-1.5 bg-white rounded-full"></div>
              <h3 className="text-xl font-semibold text-white tracking-wide">Request Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">RFQ Title *</label>
                <input name="title" value={form.title} onChange={handleChange} disabled={loading}
                  placeholder="e.g. London-Paris Express Freight"
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all disabled:opacity-50" />
              </div>
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Pickup / Service Date *</label>
                <input name="date" type="datetime-local" value={form.date} onChange={handleChange} disabled={loading}
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all [color-scheme:dark] disabled:opacity-50" />
              </div>
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Origin *</label>
                <input name="origin" value={form.origin} onChange={handleChange} disabled={loading}
                  placeholder="e.g. London, UK (LHR)"
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all disabled:opacity-50" />
              </div>
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Destination *</label>
                <input name="destination" value={form.destination} onChange={handleChange} disabled={loading}
                  placeholder="e.g. Paris, FR (CDG)"
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all disabled:opacity-50" />
              </div>
            </div>

            <div className="mb-8 space-y-3">
              <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Bid Currency *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {currencyList.map((cur) => (
                  <button
                    key={cur.code}
                    type="button"
                    onClick={() => setForm({ ...form, currency: cur.code })}
                    className={`px-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      form.currency === cur.code
                        ? 'bg-white text-zinc-900 shadow-md scale-105'
                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white border border-transparent hover:border-zinc-600'
                    }`}
                  >
                    <span className="text-xl">{cur.symbol}</span>
                    <span className="text-[10px] tracking-wider uppercase opacity-80">{cur.code}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Full Description</label>
              <textarea name="description" rows="4" value={form.description} onChange={handleChange} disabled={loading}
                placeholder="Include container sizes, weight constraints, specific handling requirements, or delivery notes."
                className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all resize-none disabled:opacity-50 leading-relaxed" />
            </div>
          </div>

          {/* AUCTION WINDOW */}
          <div className="bg-zinc-900 rounded-[20px] p-8 md:p-10 shadow-2xl border border-zinc-800/80">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
              <div className="h-8 w-1.5 bg-yellow-400 rounded-full"></div>
              <h3 className="text-xl font-semibold text-white tracking-wide">Auction Window</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Bid Start Date & Time *</label>
                <input type="datetime-local" name="bidStart" value={form.bidStart} onChange={handleChange} disabled={loading}
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all [color-scheme:dark] disabled:opacity-50" />
              </div>
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Standard Close *</label>
                <input type="datetime-local" name="bidClose" value={form.bidClose} onChange={handleChange} disabled={loading}
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all [color-scheme:dark] disabled:opacity-50" />
              </div>
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Forced Close Limit *</label>
                <input type="datetime-local" name="forcedClose" value={form.forcedClose} onChange={handleChange} disabled={loading}
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all [color-scheme:dark] disabled:opacity-50" />
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-400 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
              <span className="font-semibold text-white">Pro Tip:</span> Set Standard Close to define when the auction should naturally end. Forced Close sets an absolute hard limit, preventing infinite extensions.
            </p>
          </div>

          {/* EXTENSION */}
          <div className="bg-zinc-900 rounded-[20px] p-8 md:p-10 shadow-2xl border border-zinc-800/80">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
              <div className="h-8 w-1.5 bg-green-400 rounded-full"></div>
              <h3 className="text-xl font-semibold text-white tracking-wide">British Auction Extension</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Trigger Window (Minutes)</label>
                <input type="number" name="trigger" value={form.trigger} onChange={handleChange} disabled={loading} min="1"
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white font-mono border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all disabled:opacity-50" />
              </div>
              <div className="space-y-2.5">
                <label className="block text-[13px] text-gray-400 uppercase tracking-widest font-semibold">Extension Duration (Minutes)</label>
                <input type="number" name="extension" value={form.extension} onChange={handleChange} disabled={loading} min="1"
                  className="w-full bg-zinc-800 rounded-xl p-4 text-base text-white font-mono border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-all disabled:opacity-50" />
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700/50">
              <p className="text-[14px] text-gray-300 leading-relaxed font-medium">
                The auction extends automatically by <span className="text-white font-bold">{form.extension || 'Y'} minutes</span> when a competitive bid is placed within the final <span className="text-white font-bold">{form.trigger || 'X'} minutes</span> before closing. This continues until bidding stops or the Forced Close limit is reached.
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-5 pt-4">
            <button type="button" onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-xl bg-zinc-800 text-gray-300 text-[15px] font-semibold hover:bg-zinc-700 hover:text-white transition-all shadow-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-12 py-4 rounded-xl bg-white text-zinc-900 text-[15px] font-bold shadow-lg hover:bg-gray-200 transition-all disabled:opacity-50">
              {loading ? 'Creating RFQ...' : 'Publish Auction →'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateRFQ;
