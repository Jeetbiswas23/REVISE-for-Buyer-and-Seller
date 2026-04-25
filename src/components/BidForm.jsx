import React, { useState, useEffect } from 'react';
import { createBid, getAuctionState, createAuctionLog } from '../lib/db.js';
import { formatCurrency } from '../lib/utils.js';
import { EVENT_TYPES } from '../lib/types.js';

const BidForm = ({ auctionId, supplierId, onBidSubmitted }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const bidAmount = parseFloat(amount);
      
      // Create the bid
      const newBid = createBid({
        auctionId,
        supplierId,
        amount: bidAmount,
        rank: 1,
        bidTime: new Date(),
      });

      // Create log entry
      createAuctionLog(auctionId, EVENT_TYPES.BID_PLACED, {
        supplierId,
        amount: bidAmount,
      });

      setSuccess(`Bid of ${formatCurrency(bidAmount)} placed successfully!`);
      setAmount('');
      
      if (onBidSubmitted) {
        onBidSubmitted();
      }
    } catch (err) {
      setError('Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Place Bid</h3>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-accent/10 border border-accent rounded text-accent text-sm">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium mb-2">
          Bid Amount ($)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter bid amount"
          disabled={loading}
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Placing Bid...' : 'Place Bid'}
      </button>
    </form>
  );
};

export default BidForm;
