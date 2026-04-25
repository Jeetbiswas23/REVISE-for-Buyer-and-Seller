'use client';

import { AuctionConfig, RFQ, AuctionLog } from '@/lib/types';
import { getAuctionLogs, getBidsByAuctionId } from '@/lib/db';
import { useState, useEffect } from 'react';

interface AuctionDetailsProps {
  auction: AuctionConfig;
  rfq: RFQ;
}

export default function AuctionDetailsComponent({ auction, rfq }: AuctionDetailsProps) {
  const [logs, setLogs] = useState<AuctionLog[]>([]);

  useEffect(() => {
    const logsData = getAuctionLogs(auction.id);
    setLogs(logsData);
  }, [auction.id]);

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

  const bids = getBidsByAuctionId(auction.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-border rounded-lg bg-card p-6">
        <p className="text-xs tracking-wider text-muted-foreground mb-2">PROCUREMENT</p>
        <h1 className="text-3xl font-bold text-foreground mb-2">{rfq.title}</h1>
        <p className="text-foreground/70">{rfq.description}</p>
      </div>

      {/* Request Details */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">REQUEST DETAILS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">PICKUP / SERVICE DATE</p>
            <p className="text-foreground">{formatDateTime(rfq.pickupDate)}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">ORIGIN</p>
            <p className="text-foreground">{rfq.origin}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">DESTINATION</p>
            <p className="text-foreground">{rfq.destination}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">STATUS</p>
            <p className="text-accent font-semibold">{auction.status.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Auction Window */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">AUCTION WINDOW</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">BID START</p>
            <p className="text-sm text-foreground">{formatDateTime(auction.bidStartTime)}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">BID CLOSE</p>
            <p className="text-sm text-foreground">{formatDateTime(auction.bidCloseTime)}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">
              FORCED CLOSE * (HARD CAP)
            </p>
            <p className="text-sm text-foreground">{formatDateTime(auction.forcedCloseTime)}</p>
          </div>
        </div>
      </div>

      {/* British Auction Extension */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">BRITISH AUCTION EXTENSION</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">
              TRIGGER WINDOW (X) - MINUTES BEFORE CLOSE
            </p>
            <p className="text-xl font-semibold text-foreground">{auction.triggerWindowMinutes}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">
              EXTENSION DURATION (Y) - MINUTES
            </p>
            <p className="text-xl font-semibold text-foreground">{auction.extensionDurationMinutes}</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-secondary/50 border border-border rounded p-4">
          ⓘ Auction extends by Y minutes when: bid placed within last X min • L1 (lowest bidder)
          changes • any rank change. Never exceeds Forced Close.
        </div>
      </div>

      {/* Activity Log */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">ACTIVITY LOG</h2>

        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activity yet</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded bg-secondary/50 border border-border"
              >
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </p>
                <div className="flex-1">
                  <p className="text-sm text-foreground capitalize">{log.eventType.replace(/_/g, ' ')}</p>
                  {log.details && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {JSON.stringify(log.details, null, 2)}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
