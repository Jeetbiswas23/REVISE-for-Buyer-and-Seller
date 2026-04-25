import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAuctions } from '../lib/db.js';
import { formatDateTime, formatCurrency, getTimeRemaining } from '../lib/utils.js';
import { CURRENCIES } from '../lib/types.js';
import Navbar from '../components/Navbar.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [stats, setStats] = useState({ active: 0, scheduled: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) { navigate('/signin'); return; }
    const currentUser = JSON.parse(userStr);
    setUser(currentUser);

    loadAuctions();
  }, [navigate]);

  const loadAuctions = async () => {
    try {
      const auctionList = await getAllAuctions();
      setAuctions(auctionList);
      setStats({
        active: auctionList.filter(a => a.status === 'active').length,
        scheduled: auctionList.filter(a => a.status === 'scheduled').length,
        closed: auctionList.filter(a => a.status === 'closed').length,
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleLogout = () => { sessionStorage.removeItem('currentUser'); navigate('/signin'); };

  const getStatusLabel = (item) => {
    if (item.isAwarded) return 'Awarded';
    switch (item.status) {
      case 'active': return 'Active';
      case 'scheduled': return 'Scheduled';
      case 'closed': return 'Closed';
      default: return item.status;
    }
  };

  const getStatusPill = (item) => {
    if (item.isAwarded) return 'bg-emerald-900/60 text-emerald-400';
    switch (item.status) {
      case 'active': return 'bg-green-900/60 text-green-400';
      case 'scheduled': return 'bg-yellow-900/60 text-yellow-400';
      case 'closed': return 'bg-zinc-700/60 text-gray-400';
      default: return 'bg-zinc-700/60 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar user={user} onLogout={handleLogout} showNewRFQ />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-sm tracking-[0.2em] uppercase font-medium">Loading auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Navbar user={user} onLogout={handleLogout} showNewRFQ />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Page Header */}
        <div className="mb-12 slide-up">
          <p className="text-sm tracking-[0.35em] text-gray-500 uppercase font-bold mb-3">
            {user?.role === 'buyer' ? 'Buyer' : 'Supplier'} Workspace
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-4">Auction Board</h1>
          <p className="text-gray-400 text-lg md:text-xl">
            {user?.role === 'buyer'
              ? 'Manage RFQs and monitor live bidding.'
              : 'Review open auctions and submit competitive bids.'}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in">
          <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl">
            <p className="text-gray-400 text-base font-medium mb-1">Active Auctions</p>
            <h2 className="text-5xl font-bold text-green-400">{stats.active}</h2>
          </div>
          <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl">
            <p className="text-gray-400 text-base font-medium mb-1">Scheduled</p>
            <h2 className="text-5xl font-bold text-yellow-400">{stats.scheduled}</h2>
          </div>
          <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl">
            <p className="text-gray-400 text-base font-medium mb-1">Closed</p>
            <h2 className="text-5xl font-bold text-gray-300">{stats.closed}</h2>
          </div>
        </div>

        {/* Auction Table */}
        <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl fade-in overflow-x-auto">

          <table className="w-full border-separate" style={{ borderSpacing: '0 16px' }}>
            <thead>
              <tr className="text-left text-gray-400 text-base">
                <th className="px-5 py-2 font-semibold tracking-wide">RFQ</th>
                <th className="px-5 py-2 font-semibold tracking-wide">Lane</th>
                <th className="px-5 py-2 font-semibold tracking-wide">Currency</th>
                <th className="px-5 py-2 font-semibold tracking-wide">Lowest Bid</th>
                <th className="px-5 py-2 font-semibold tracking-wide">Closes In</th>
                <th className="px-5 py-2 font-semibold tracking-wide">Forced Close</th>
                <th className="px-5 py-2 font-semibold tracking-wide">Status</th>
              </tr>
            </thead>

            <tbody>
              {auctions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-gray-500 text-lg">
                    No auctions available
                  </td>
                </tr>
              ) : (
                auctions.map((item) => {
                  const itemRfq = item.rfqId || item;
                  const cur = CURRENCIES[itemRfq.currency] || CURRENCIES.USD;
                  return (
                    <tr
                      key={item._id}
                      onClick={() => navigate(`/auction/${item._id}`)}
                      className="bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer group"
                    >
                      {/* RFQ */}
                      <td className="px-5 py-5 rounded-l-xl">
                        <p className="text-xs text-gray-400 font-mono tracking-widest font-bold mb-1">{item._id.substring(0,12).toUpperCase()}</p>
                        <p className="text-white text-lg font-bold group-hover:text-green-400 transition-colors">
                          {itemRfq.title}
                        </p>
                      </td>

                      {/* Lane */}
                      <td className="px-5 py-5">
                        <p className="text-gray-300 text-base font-medium">
                          {itemRfq.origin.split(',')[0]} → {itemRfq.destination.split(',')[0]}
                        </p>
                      </td>

                      {/* Currency */}
                      <td className="px-5 py-5">
                        <p className="text-gray-300 text-base font-semibold">{cur.symbol} {cur.code}</p>
                      </td>

                      {/* Lowest Bid */}
                      <td className="px-5 py-5">
                        {item.lowestBid ? (
                          <>
                            <p className="text-green-400 text-xl font-bold">{formatCurrency(item.lowestBid.amount, itemRfq.currency)}</p>
                            <p className="text-xs text-gray-400 mt-1 font-medium">{item.bidCount} bids</p>
                          </>
                        ) : (
                          <p className="text-gray-500 text-xl font-bold">—</p>
                        )}
                      </td>

                      {/* Closes In */}
                      <td className="px-5 py-5">
                        <p className="text-gray-300 text-base font-medium">{formatDateTime(item.bidCloseTime)}</p>
                      </td>

                      {/* Forced Close */}
                      <td className="px-5 py-5">
                        <p className="text-gray-300 text-base font-medium">{formatDateTime(item.forcedCloseTime)}</p>
                        {item.bidCount > 0 && (
                          <p className="text-yellow-400 text-xs font-bold tracking-wider mt-1">+{item.bidCount} EXT</p>
                        )}
                      </td>

                      {/* Status Pill */}
                      <td className="px-5 py-5 rounded-r-xl">
                        <span className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full inline-block ${getStatusPill(item)}`}>
                          {getStatusLabel(item)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
