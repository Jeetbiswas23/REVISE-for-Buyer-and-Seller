import React, { useState } from 'react';
import { formatDateTime, formatCurrency } from '../lib/utils.js';
import { getAuctionState } from '../lib/db.js';

const AuctionBoard = ({ auctions, userRole }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'text-accent',
      scheduled: 'text-chart-2',
      closed: 'text-white',
    };
    
    return (
      <span className={statusClasses[status] || 'text-muted-foreground'}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-7 gap-4 px-6 py-4 bg-secondary border-b border-border text-xs font-semibold tracking-wider text-muted-foreground">
        <div>RFQ</div>
        <div>LANE</div>
        <div>LOWEST BID</div>
        <div>CLOSES IN</div>
        <div>FORCED CLOSE</div>
        <div>STATUS</div>
        <div>ACTION</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {auctions.length === 0 ? (
          <div className="px-6 py-8 text-center text-muted-foreground">
            <p>No auctions available</p>
          </div>
        ) : (
          auctions.map((auction) => {
            const auctionState = getAuctionState(auction.id);
            const lowestBid =
              auctionState && auctionState.bids.length > 0
                ? auctionState.bids[0]
                : null;

            return (
              <div
                key={auction.id}
                className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-border hover:bg-secondary/50 transition-colors group items-center"
              >
                {/* RFQ */}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{auction.id}</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {auction.rfq.title}
                  </p>
                </div>

                {/* Lane */}
                <div className="text-sm text-muted-foreground">
                  {auction.rfq.origin.split(',')[0]} → {auction.rfq.destination.split(',')[0]}
                </div>

                {/* Lowest Bid */}
                <div className="text-sm">
                  {lowestBid ? (
                    <>
                      <p className="text-accent font-semibold">{formatCurrency(lowestBid.amount)}</p>
                      <p className="text-xs text-muted-foreground">{auction.bidCount} BIDS</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">—</p>
                  )}
                </div>

                {/* Closes In */}
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(auction.bidCloseTime)}
                </div>

                {/* Forced Close */}
                <div className="text-sm text-muted-foreground">
                  {formatDateTime(auction.forcedCloseTime)}
                </div>

                {/* Status */}
                <div className="text-sm">{getStatusBadge(auction.status)}</div>

                {/* Action */}
                <div>
                  <a
                    href={`/auction/${auction.id}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View →
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AuctionBoard;
