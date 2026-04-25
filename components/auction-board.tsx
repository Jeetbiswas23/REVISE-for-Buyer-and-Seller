'use client';

import { AuctionConfig, RFQ } from '@/lib/types';
import Link from 'next/link';
import { getAuctionState } from '@/lib/db';

interface AuctionBoardProps {
  auctions: (AuctionConfig & { rfq: RFQ; bidCount: number })[];
  userRole: 'buyer' | 'supplier';
}

export default function AuctionBoard({ auctions, userRole }: AuctionBoardProps) {
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="text-accent">ACTIVE</span>;
      case 'scheduled':
        return <span className="text-chart-2">SCHEDULED</span>;
      case 'closed':
        return <span className="text-white">CLOSED</span>;
      default:
        return <span className="text-muted-foreground">{status}</span>;
    }
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
        <div></div>
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
              <Link
                key={auction.id}
                href={`/auction/${auction.id}`}
                className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-border hover:bg-secondary/50 transition-colors group cursor-pointer items-center"
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
                      <p className="text-accent font-semibold">${lowestBid.amount.toLocaleString()}</p>
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
                <div className="text-right">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    →
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
