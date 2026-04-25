import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuctionById, awardAuction, placeBid, getAuctionActivity } from '../lib/db.js';
import { formatDateTime, formatCurrency, getTimeRemaining } from '../lib/utils.js';
import { EVENT_TYPES, CURRENCIES } from '../lib/types.js';
import Navbar from '../components/Navbar.jsx';

const AuctionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [auction, setAuction] = useState(null);
  const [rfq, setRfq] = useState(null);
  const [bids, setBids] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [offerDetails, setOfferDetails] = useState('');
  const [deliveryTimeline, setDeliveryTimeline] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [activeTab, setActiveTab] = useState('bids');
  const [expandedBid, setExpandedBid] = useState(null);
  const [awardConfirm, setAwardConfirm] = useState(null);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) { navigate('/signin'); return; }
    setUser(JSON.parse(userStr));
  }, [navigate]);

  const loadAuctionData = async () => {
    try {
      const auctionData = await getAuctionById(id);
      if (!auctionData) { setLoading(false); return; }
      
      const activityData = await getAuctionActivity(id);
      
      setAuction(auctionData);
      setRfq(auctionData.rfqId);
      setBids(activityData.bids || []);
      setLogs(activityData.logs || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuctionData();
    const interval = setInterval(loadAuctionData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (!auction) return;
    const timer = setInterval(() => { setTimeRemaining(getTimeRemaining(auction.bidCloseTime)); }, 1000);
    return () => clearInterval(timer);
  }, [auction]);

  const handleLogout = () => { sessionStorage.removeItem('currentUser'); navigate('/signin'); };

  const currency = rfq?.currency || 'USD';
  const cur = CURRENCIES[currency] || CURRENCIES.USD;

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError(''); setBidSuccess('');
    if (!bidAmount || parseFloat(bidAmount) <= 0) { setBidError('Please enter a valid bid amount'); return; }
    if (!offerDetails.trim()) { setBidError('Please describe what you are offering'); return; }
    setBidLoading(true);
    try {
      const amount = parseFloat(bidAmount);
      await placeBid({ auctionId: id, amount, offerDetails, deliveryTimeline });
      setBidSuccess(`Bid of ${formatCurrency(amount, currency)} placed!`);
      setBidAmount(''); setOfferDetails(''); setDeliveryTimeline('');
      loadAuctionData();
    } catch (err) { setBidError(err.message || 'Failed to place bid.'); }
    finally { setBidLoading(false); }
  };

  const handleAwardBid = async (bidId) => {
    try {
      await awardAuction(id, bidId);
      setAwardConfirm(null);
      loadAuctionData();
    } catch (err) {
      console.error(err);
      alert('Failed to award bid');
    }
  };

  const getLogEventLabel = (t) => ({ bid_placed:'BID PLACED', rank_change:'RANK CHANGE', extension_triggered:'EXTENSION', auction_closed:'CLOSED', bid_awarded:'AWARDED' }[t] || t.toUpperCase());
  const getLogEventColor = (t) => ({
    bid_placed: 'text-green-400 bg-green-900/40 border-green-400/20',
    rank_change: 'text-blue-400 bg-blue-900/40 border-blue-400/20',
    extension_triggered: 'text-yellow-400 bg-yellow-900/40 border-yellow-400/20',
    auction_closed: 'text-gray-400 bg-zinc-700/40 border-gray-400/20',
    bid_awarded: 'text-emerald-400 bg-emerald-900/40 border-emerald-400/20',
  }[t] || 'text-gray-400 bg-zinc-700/40 border-gray-400/20');

  if (loading) {
    return (<div className="min-h-screen bg-black text-white"><Navbar user={user} onLogout={handleLogout} showNewRFQ />
      <div className="flex items-center justify-center h-96"><p className="text-gray-500 text-lg tracking-[0.2em] font-medium uppercase">Loading auction...</p></div></div>);
  }
  if (!auction || !rfq) {
    return (<div className="min-h-screen bg-black text-white"><Navbar user={user} onLogout={handleLogout} showNewRFQ />
      <div className="flex flex-col items-center justify-center h-96 gap-4"><p className="text-gray-400 text-xl font-medium">Auction not found</p>
        <button onClick={() => navigate('/dashboard')} className="text-white underline text-lg font-medium hover:text-gray-300">← Back to Dashboard</button></div></div>);
  }

  const lowestBid = bids.length > 0 ? bids[0] : null;
  const isActive = auction.status === 'active';
  const isClosed = auction.status === 'closed';
  const isAwarded = !!auction.awardedBidId;
  const awardedBid = isAwarded ? auction.awardedBidId : null;

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <Navbar user={user} onLogout={handleLogout} showNewRFQ />

      <div className="max-w-7xl mx-auto px-6 py-12">

        <button onClick={() => navigate('/dashboard')}
          className="text-gray-400 text-base font-semibold tracking-wide hover:text-white transition-colors mb-8 flex items-center gap-2">
          ← Back to Auctions
        </button>

        {/* Page Header */}
        <div className="mb-12 flex items-start justify-between slide-up">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm uppercase text-gray-500 font-bold tracking-widest">
                {auction.id.substring(0,12).toUpperCase()}
              </span>
              <span className="text-sm font-semibold tracking-wider px-3 py-1.5 rounded-md bg-zinc-800 text-gray-300">
                {cur.symbol} {cur.code}
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight">{rfq.title}</h1>
            <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">{rfq.description}</p>
          </div>

          <div className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-widest shrink-0 ${
            isAwarded ? 'text-emerald-400 bg-emerald-900/60' :
            isActive ? 'text-green-400 bg-green-900/60' :
            isClosed ? 'text-gray-400 bg-zinc-700/60' :
            'text-yellow-400 bg-yellow-900/60'
          }`}>
            {isActive && <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 mr-2 pulse-dot"></span>}
            {isAwarded ? '✓ AWARDED' : auction.status.toUpperCase()}
          </div>
        </div>

        {/* Awarded Banner */}
        {isAwarded && awardedBid && (
          <div className="bg-emerald-900/20 border-2 border-emerald-500/30 rounded-2xl p-8 mb-12 shadow-2xl fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm tracking-widest text-emerald-400/80 uppercase font-bold mb-2">Contract Awarded</p>
                <h2 className="text-4xl font-bold text-white mb-3">
                  {formatCurrency(awardedBid.amount, currency)} — {getUserById(awardedBid.supplierId)?.company || 'Supplier'}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">{awardedBid.offerDetails}</p>
                {awardedBid.deliveryTimeline && (
                  <p className="text-emerald-400 text-base font-semibold mt-2 track-wide">📦 {awardedBid.deliveryTimeline}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-emerald-500/80 uppercase tracking-widest font-bold mb-2">Awarded To</p>
                <p className="text-2xl font-bold text-white mb-1">{awardedBid.supplierId?.fullName || 'Supplier'}</p>
                <p className="text-lg text-gray-400 font-medium">{awardedBid.supplierId?.company}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12 fade-in">
          <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800/80">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Lane</p>
            <p className="text-xl font-bold text-gray-200">{rfq.origin.split(',')[0]} → {rfq.destination.split(',')[0]}</p>
          </div>
          <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800/80">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Lowest Bid</p>
            <p className="text-4xl font-bold text-green-400 leading-tight">{lowestBid ? formatCurrency(lowestBid.amount, currency) : '—'}</p>
            <p className="text-sm font-medium text-gray-500 mt-2">{bids.length} total bids</p>
          </div>
          <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800/80">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Time Remaining</p>
            <p className={`text-4xl font-bold font-mono leading-tight ${isActive ? 'text-yellow-400' : 'text-gray-500'}`}>
              {isActive ? timeRemaining || getTimeRemaining(auction.bidCloseTime) : 'Closed'}
            </p>
          </div>
          <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800/80">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Bid Close</p>
            <p className="text-base font-semibold text-gray-300">{formatDateTime(auction.bidCloseTime)}</p>
          </div>
          <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800/80">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-2">Forced Close</p>
            <p className="text-base font-semibold text-gray-300">{formatDateTime(auction.forcedCloseTime)}</p>
            <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mt-2">{auction.triggerWindowMinutes}m trig · {auction.extensionDurationMinutes}m ext</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

          {/* Left: Main Content */}
          <div className="xl:col-span-2">

            {/* Tabs */}
            <div className="flex gap-3 mb-6">
              {[
                { key: 'bids', label: `Live Ranking (${bids.length})` },
                { key: 'details', label: 'RFQ Details' },
                { key: 'activity', label: `Activity Log (${logs.length})` },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 text-base rounded-xl font-semibold tracking-wide transition-colors ${
                    activeTab === tab.key ? 'bg-zinc-800 text-white shadow-md' : 'bg-transparent text-gray-400 hover:bg-zinc-800/50 hover:text-white'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Bids / Live Ranking */}
            {activeTab === 'bids' && (
              <div className="bg-zinc-900 rounded-[20px] p-6 shadow-2xl fade-in overflow-x-auto border border-zinc-800/50">
                <table className="w-full border-separate" style={{ borderSpacing: '0 16px' }}>
                  <thead>
                    <tr className="text-left text-gray-400 text-base">
                      <th className="px-5 py-2 font-semibold tracking-wide">Rank</th>
                      <th className="px-5 py-2 font-semibold tracking-wide">Amount</th>
                      <th className="px-5 py-2 font-semibold tracking-wide">Supplier</th>
                      <th className="px-5 py-2 font-semibold tracking-wide w-1/3">Offer Details</th>
                      <th className="px-5 py-2 font-semibold tracking-wide">{user?.role === 'buyer' ? 'Action' : 'Bid Time'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-16 text-center text-gray-500">
                          <p className="text-xl font-medium text-gray-400 mb-2">No bids placed yet.</p>
                          <span className="text-base">Suppliers can submit their bids with offer details below.</span>
                        </td>
                      </tr>
                    ) : (
                      bids.map((bid, index) => {
                        const supplier = bid.supplierId;
                        const isL1 = index === 0;
                        const isBidAwarded = auction.awardedBidId && auction.awardedBidId._id === bid._id;
                        const isExpanded = expandedBid === bid._id;

                        return (
                          <React.Fragment key={bid._id}>
                            <tr
                              className={`rounded-xl cursor-pointer transition ${
                                isBidAwarded ? 'bg-emerald-900/20 hover:bg-emerald-900/30 shadow-sm' : 
                                isL1 ? 'bg-green-900/20 hover:bg-green-900/30 shadow-sm' : 
                                'bg-zinc-800 hover:bg-zinc-700 shadow-sm'
                              }`}
                              onClick={() => setExpandedBid(isExpanded ? null : bid._id)}
                            >
                              <td className="px-5 py-5 rounded-l-xl">
                                <div className="flex items-center gap-3">
                                  <span className={`text-xl tracking-widest font-black ${isBidAwarded ? 'text-emerald-400' : isL1 ? 'text-green-400' : 'text-gray-400'}`}>
                                    #{index + 1}
                                  </span>
                                  {isL1 && !isBidAwarded && (
                                    <span className="text-xs px-2.5 py-1 rounded-md bg-green-500/20 text-green-400 font-bold tracking-widest">L1</span>
                                  )}
                                  {isBidAwarded && (
                                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold tracking-widest">AWARDED</span>
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-5">
                                <p className={`font-bold text-2xl ${isBidAwarded ? 'text-emerald-400' : isL1 ? 'text-green-400' : 'text-white'}`}>
                                  {formatCurrency(bid.amount, currency)}
                                </p>
                              </td>

                              <td className="px-5 py-5">
                                <p className="text-lg text-white font-bold">
                                  {user?.role === 'buyer' ? (supplier?.fullName || 'Supplier') : (supplier?._id === user?._id ? 'You' : `Bidder #${index + 1}`)}
                                </p>
                                {user?.role === 'buyer' && supplier && (
                                  <p className="text-sm text-gray-400 font-medium mt-1">{supplier.company}</p>
                                )}
                              </td>

                              <td className="px-5 py-5">
                                <div className="max-w-[250px] xl:max-w-sm">
                                  {bid.offerDetails ? (
                                    <p className="text-base text-gray-300 font-medium truncate">{bid.offerDetails}</p>
                                  ) : (
                                    <p className="text-base text-gray-500 italic">No details</p>
                                  )}
                                  {bid.deliveryTimeline && (
                                    <p className="text-sm font-semibold text-yellow-500 mt-1">📦 {bid.deliveryTimeline}</p>
                                  )}
                                </div>
                              </td>

                              <td className="px-5 py-5 rounded-r-xl">
                                {user?.role === 'buyer' && !isAwarded ? (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setAwardConfirm(bid._id); }}
                                    className="px-4 py-2.5 text-sm rounded-lg shadow-md font-bold tracking-wide bg-zinc-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 transition-colors"
                                  >
                                    Award ✓
                                  </button>
                                ) : (
                                  <p className="text-base text-gray-400 font-medium">{formatDateTime(bid.bidTime)}</p>
                                )}
                              </td>
                            </tr>

                            {/* Expanded Details Row */}
                            {isExpanded && (
                              <tr>
                                <td colSpan="5" className="p-0 border-none">
                                  <div className="bg-zinc-800/80 rounded-xl p-8 mx-3 mb-4 mt-2 space-y-6 fade-in shadow-inner border border-zinc-700/50">
                                    <div className="grid grid-cols-2 gap-10">
                                      <div>
                                        <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">What They Offer</p>
                                        <p className="text-lg text-gray-200 leading-relaxed font-medium whitespace-pre-wrap">
                                          {bid.offerDetails || 'No additional details provided.'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Delivery Timeline</p>
                                        <p className="text-lg text-gray-200 font-medium">{bid.deliveryTimeline || 'Not specified'}</p>
                                        
                                        <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2 mt-6">Bid Submitted</p>
                                        <p className="text-lg text-gray-200 font-medium">{formatDateTime(bid.bidTime)}</p>
                                      </div>
                                    </div>
                                    {user?.role === 'buyer' && supplier && (
                                      <div className="pt-6 mt-4 border-t border-zinc-700/80">
                                        <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Supplier Contact</p>
                                        <p className="text-lg text-white font-bold">{supplier.fullName} — <span className="text-gray-400">{supplier.company}</span></p>
                                        <p className="text-base text-gray-400 font-medium mt-1">{supplier.email}</p>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}

                            {/* Inline Award Confirmation */}
                            {awardConfirm === bid._id && (
                              <tr>
                                <td colSpan="5" className="p-0 border-none">
                                  <div className="bg-emerald-900/20 border-2 border-emerald-500/30 rounded-xl p-6 mx-3 mb-4 mt-2 fade-in shadow-lg">
                                    <p className="text-lg text-white font-medium mb-5">
                                      Are you sure you want to award this contract to <span className="font-bold text-emerald-400">{supplier?.fullName}</span> for{' '}
                                      <span className="font-bold text-emerald-400">{formatCurrency(bid.amount, currency)}</span>?
                                    </p>
                                    <div className="flex gap-4">
                                      <button onClick={() => handleAwardBid(bid._id)}
                                        className="px-6 py-3 rounded-xl bg-emerald-500 text-zinc-950 text-base font-black tracking-wide shadow-md hover:bg-emerald-400 transition-colors">
                                        Confirm Award ✓
                                      </button>
                                      <button onClick={() => setAwardConfirm(null)}
                                        className="px-6 py-3 rounded-xl bg-zinc-800 text-gray-300 text-base font-bold shadow-sm hover:bg-zinc-700 hover:text-white transition-colors">
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab: RFQ Details */}
            {activeTab === 'details' && (
              <div className="bg-zinc-900 rounded-[20px] p-8 md:p-10 space-y-10 fade-in border border-zinc-800/50 shadow-2xl">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Shipment Details</h3>
                  <div className="grid grid-cols-2 gap-8 bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                    <div><p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Origin</p><p className="text-xl font-semibold text-white">{rfq.origin}</p></div>
                    <div><p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Destination</p><p className="text-xl font-semibold text-white">{rfq.destination}</p></div>
                    <div><p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Pickup Date</p><p className="text-xl font-semibold text-white">{formatDateTime(rfq.pickupDate)}</p></div>
                    <div><p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Currency</p><p className="text-xl font-semibold text-white">{cur.symbol} {cur.name} ({cur.code})</p></div>
                  </div>
                </div>
                {rfq.description && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Description</h3>
                    <p className="text-lg font-medium text-gray-300 leading-relaxed bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">{rfq.description}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Auction Configuration</h3>
                  <div className="grid grid-cols-2 gap-8 bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                    <div><p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Bid Start</p><p className="text-lg font-semibold text-white">{formatDateTime(auction.bidStartTime)}</p></div>
                    <div><p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Bid Close</p><p className="text-lg font-semibold text-white">{formatDateTime(auction.bidCloseTime)}</p></div>
                    <div><p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Forced Close</p><p className="text-lg font-semibold text-white">{formatDateTime(auction.forcedCloseTime)}</p></div>
                    <div><p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Extension Rule</p><p className="text-lg font-semibold text-white">{auction.triggerWindowMinutes}m trigger / {auction.extensionDurationMinutes}m ext</p></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Activity Log */}
            {activeTab === 'activity' && (
              <div className="bg-zinc-900 rounded-[20px] p-6 shadow-2xl border border-zinc-800/50 fade-in">
                {logs.length === 0 ? (
                  <div className="p-16 text-center text-gray-500"><p className="text-lg font-medium">No activity recorded yet</p></div>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="p-5 rounded-xl bg-zinc-800 flex items-start gap-5 shadow-sm">
                        <span className={`text-xs px-3 py-1.5 rounded-md border tracking-widest font-bold shrink-0 mt-0.5 ${getLogEventColor(log.eventType)}`}>
                          {getLogEventLabel(log.eventType)}
                        </span>
                        <div className="flex-1 min-w-0">
                          {log.details?.amount && (
                            <p className="text-lg text-white font-medium">
                              Bid of <span className="text-green-400 font-bold">{formatCurrency(log.details.amount, currency)}</span>
                              {log.eventType === 'bid_awarded' ? ' awarded' : ' placed'}
                            </p>
                          )}
                          {log.details?.finalBidCount !== undefined && (
                            <p className="text-lg text-white font-medium">Auction closed with {log.details.finalBidCount} total bids</p>
                          )}
                          <p className="text-sm font-medium text-gray-400 mt-1.5">{formatDateTime(log.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">

            {/* Bid Summary */}
            <div className="bg-zinc-900 rounded-[20px] p-8 shadow-2xl border border-zinc-800/80 space-y-6">
              <h3 className="text-base font-bold text-gray-400 uppercase tracking-widest mb-2">Bid Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-400">Total Bids</span>
                  <span className="text-2xl font-black text-white">{bids.length}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                  <span className="text-base font-semibold text-gray-400">Lowest (L1)</span>
                  <span className="text-2xl font-black text-green-400">{lowestBid ? formatCurrency(lowestBid.amount, currency) : '—'}</span>
                </div>
                {bids.length > 1 && (
                  <>
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                      <span className="text-base font-semibold text-gray-400">Highest</span>
                      <span className="text-lg font-bold text-gray-300">{formatCurrency(bids[bids.length-1].amount, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                      <span className="text-base font-semibold text-gray-400">Spread</span>
                      <span className="text-lg font-bold text-yellow-500">{formatCurrency(bids[bids.length-1].amount - bids[0].amount, currency)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                  <span className="text-base font-semibold text-gray-400">Currency</span>
                  <span className="text-lg font-bold text-white tracking-widest">{cur.symbol} {cur.code}</span>
                </div>
              </div>
            </div>

            {/* Place Bid (Supplier Only, Active only) */}
            {user?.role === 'supplier' && isActive && !isAwarded && (
              <div className="bg-zinc-900 rounded-[20px] p-8 shadow-2xl border-2 border-zinc-700/50">
                <h3 className="text-lg font-bold text-white mb-6">Submit Your Bid</h3>

                {bidError && <div className="p-4 mb-5 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold bg-red-500/10">{bidError}</div>}
                {bidSuccess && <div className="p-4 mb-5 rounded-xl border border-green-500/30 text-green-400 text-sm font-semibold bg-green-500/10">{bidSuccess}</div>}

                <form onSubmit={handleBidSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Bid Amount ({cur.symbol} {cur.code}) *</label>
                    <input type="number" step="0.01" min="0" value={bidAmount}
                      onChange={(e) => { setBidAmount(e.target.value); setBidError(''); setBidSuccess(''); }}
                      disabled={bidLoading} placeholder={`Enter amount in ${cur.code}`}
                      className="w-full bg-zinc-800 rounded-xl p-4 text-base font-bold text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-colors disabled:opacity-50" />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">What You Offer *</label>
                    <textarea rows="4" value={offerDetails}
                      onChange={(e) => setOfferDetails(e.target.value)}
                      disabled={bidLoading} placeholder="Describe your service, insurance, tracking, etc."
                      className="w-full bg-zinc-800 rounded-xl p-4 text-base font-medium text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-colors resize-none disabled:opacity-50" />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Delivery Timeline</label>
                    <input type="text" value={deliveryTimeline}
                      onChange={(e) => setDeliveryTimeline(e.target.value)}
                      disabled={bidLoading} placeholder="e.g. 3-5 business days"
                      className="w-full bg-zinc-800 rounded-xl p-4 text-base font-medium text-white border border-transparent focus:outline-none focus:border-zinc-500 focus:bg-zinc-700/50 transition-colors disabled:opacity-50" />
                  </div>

                  {lowestBid && (
                    <p className="text-sm font-medium text-gray-400 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 mt-4">
                      Current L1: <span className="font-bold text-white">{formatCurrency(lowestBid.amount, currency)}</span> — bid lower to take the lead
                    </p>
                  )}

                  <button type="submit" disabled={bidLoading}
                    className="w-full bg-white text-zinc-900 rounded-xl py-4 text-base font-black tracking-wide shadow-lg hover:bg-gray-200 transition-colors disabled:opacity-50 mt-4">
                    {bidLoading ? 'Placing bid...' : 'Submit Bid →'}
                  </button>
                </form>
              </div>
            )}

            {/* Awarded / Closed state */}
            {(isClosed || isAwarded) && (
              <div className="bg-zinc-900 rounded-[20px] p-8 shadow-2xl border border-zinc-800/80 space-y-4">
                <h3 className="text-base font-bold text-gray-400 uppercase tracking-widest mb-1">{isAwarded ? 'Contract Awarded' : 'Auction Closed'}</h3>
                <p className="text-base font-medium text-gray-300 leading-relaxed">
                  {isAwarded
                    ? 'A winning bid has been selected for this auction.'
                    : 'This auction has ended. No more bids can be placed.'}
                </p>
                {(isAwarded ? awardedBid : lowestBid) && (
                  <div className="pt-4 border-t border-zinc-800/80 mt-4">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{isAwarded ? 'Award Amount' : 'Winning Bid'}</p>
                    <p className="text-4xl font-black text-emerald-400">
                      {formatCurrency((isAwarded ? awardedBid : lowestBid).amount, currency)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Timing */}
            <div className="bg-zinc-900 rounded-[20px] p-8 shadow-2xl border border-zinc-800/80 space-y-5">
              <h3 className="text-base font-bold text-gray-400 uppercase tracking-widest mb-2">Timing</h3>
              <div className="space-y-4">
                <div><p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bid Start</p><p className="text-base font-semibold text-white mt-1">{formatDateTime(auction.bidStartTime)}</p></div>
                <div><p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bid Close</p><p className="text-base font-semibold text-white mt-1">{formatDateTime(auction.bidCloseTime)}</p></div>
                <div><p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Forced Close</p><p className="text-base font-semibold text-white mt-1">{formatDateTime(auction.forcedCloseTime)}</p></div>
                <div className="pt-4 border-t border-zinc-800">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Extension Rule</p>
                  <p className="text-base font-medium text-gray-300 mt-1 leading-relaxed">Extends <span className="font-bold text-white">{auction.extensionDurationMinutes}m</span> if bid within last <span className="font-bold text-white">{auction.triggerWindowMinutes}m</span></p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
