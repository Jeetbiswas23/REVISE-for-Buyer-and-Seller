'use client';

import { useState } from 'react';
import { getBidsByAuctionId } from '@/lib/db';

interface BidFormProps {
  auctionId: string;
  onSubmit: (amount: number) => void;
}

export default function BidForm({ auctionId, onSubmit }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const bids = getBidsByAuctionId(auctionId);
  const lowestBid = bids.length > 0 ? bids[0].amount : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(bidAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid bid amount');
        return;
      }

      if (lowestBid && amount >= lowestBid) {
        alert(
          `Your bid must be lower than the current lowest bid of $${lowestBid.toLocaleString()}`
        );
        return;
      }

      onSubmit(amount);
      setBidAmount('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">PLACE BID</h3>

      {lowestBid && (
        <div className="mb-4 p-3 bg-secondary/50 rounded border border-border">
          <p className="text-xs text-muted-foreground mb-1">CURRENT LOWEST</p>
          <p className="text-lg font-semibold text-accent">${lowestBid.toLocaleString()}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs tracking-wider text-muted-foreground block mb-3">
            BID AMOUNT (USD)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={lowestBid ? `Less than $${lowestBid}` : 'Enter amount'}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
            />
          </div>
          {lowestBid && (
            <p className="text-xs text-muted-foreground mt-2">
              Must be lower than ${lowestBid.toLocaleString()}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !bidAmount}
          className="w-full py-3 px-4 bg-accent text-accent-foreground rounded font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="text-accent font-semibold">Reverse Auction:</span> Lowest bid wins. Your
          bid must be lower than all others.
        </p>
      </div>
    </div>
  );
}
