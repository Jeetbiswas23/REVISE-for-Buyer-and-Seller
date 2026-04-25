import React, { useEffect, useState } from 'react';
import { getAuctionState, getRFQById, getAuctionById, getBidsByAuctionId } from '../lib/db.js';
import { formatDateTime, formatCurrency } from '../lib/utils.js';
import BidForm from './BidForm.jsx';

const AuctionDetails = ({ auctionId, currentUserId, userRole }) => {
  const [auction, setAuction] = useState(null);
  const [rfq, setRfq] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAuctionData = () => {
    const auctionConfig = getAuctionById(auctionId);
    if (!auctionConfig) {
      setLoading(false);
      return;
    }

    const auctionState = getAuctionState(auctionId);
    const rfqData = getRFQById(auctionConfig.rfqId);
    const bidsList = getBidsByAuctionId(auctionId);

    setAuction(auctionState);
    setRfq(rfqData);
    setBids(bidsList);
    setLoading(false);
  };

  useEffect(() => {
    loadAuctionData();
    const interval = setInterval(loadAuctionData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [auctionId]);

  if (loading) {
    return <div className="text-center py-12">Loading auction details...</div>;
  }

  if (!auction || !rfq) {
    return <div className="text-center py-12 text-destructive">Auction not found</div>;
  }

  const lowestBid = bids.length > 0 ? bids[0] : null;

  return (
    <div className="space-y-6">
      {/* RFQ Details */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">{rfq.title}</h2>
        <p className="text-muted-foreground mb-6">{rfq.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-1">ORIGIN</p>
            <p className="text-lg font-semibold">{rfq.origin}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-1">DESTINATION</p>
            <p className="text-lg font-semibold">{rfq.destination}</p>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-wider text-muted-foreground mb-1">PICKUP DATE</p>
          <p className="text-lg font-semibold">{formatDateTime(rfq.pickupDate)}</p>
        </div>
      </div>

      {/* Auction Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg bg-card p-4">
          <p className="text-xs tracking-wider text-muted-foreground mb-2">STATUS</p>
          <p className="text-2xl font-bold text-accent">{auction.status.toUpperCase()}</p>
        </div>
        <div className="border border-border rounded-lg bg-card p-4">
          <p className="text-xs tracking-wider text-muted-foreground mb-2">TOTAL BIDS</p>
          <p className="text-2xl font-bold">{bids.length}</p>
        </div>
        <div className="border border-border rounded-lg bg-card p-4">
          <p className="text-xs tracking-wider text-muted-foreground mb-2">LOWEST BID</p>
          <p className="text-2xl font-bold text-accent">
            {lowestBid ? formatCurrency(lowestBid.amount) : '—'}
          </p>
        </div>
        <div className="border border-border rounded-lg bg-card p-4">
          <p className="text-xs tracking-wider text-muted-foreground mb-2">CLOSES</p>
          <p className="text-sm font-semibold">{formatDateTime(auction.bidCloseTime)}</p>
        </div>
      </div>

      {/* Bids Table */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="px-6 py-4 bg-secondary border-b border-border">
          <h3 className="font-semibold">Bids ({bids.length})</h3>
        </div>

        <div className="divide-y divide-border">
          {bids.length === 0 ? (
            <div className="px-6 py-8 text-center text-muted-foreground">
              No bids yet
            </div>
          ) : (
            bids.map((bid, index) => (
              <div key={bid.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Rank #{index + 1}</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(bid.bidTime)}</p>
                </div>
                <p className="text-xl font-bold text-accent">{formatCurrency(bid.amount)}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bid Form */}
      {userRole === 'supplier' && auction.status === 'active' && (
        <BidForm 
          auctionId={auctionId} 
          supplierId={currentUserId}
          onBidSubmitted={loadAuctionData}
        />
      )}
    </div>
  );
};

export default AuctionDetails;
