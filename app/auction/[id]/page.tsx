'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAuctionById, getAuctionState, getRFQById, createBid, createAuctionLog, getBidsByAuctionId } from '@/lib/db';
import { AuctionConfig, RFQ, User, Bid } from '@/lib/types';
import Header from '@/components/header';
import AuctionDetails from '@/components/auction-details';
import BidForm from '@/components/bid-form';

export default function AuctionPage() {
  const router = useRouter();
  const params = useParams();
  const auctionId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [auction, setAuction] = useState<AuctionConfig | null>(null);
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/signup');
      return;
    }

    const currentUser = JSON.parse(userStr);
    setUser(currentUser);

    // Load auction and RFQ
    const auctionData = getAuctionById(auctionId);
    if (!auctionData) {
      router.push('/dashboard');
      return;
    }

    const rfqData = getRFQById(auctionData.rfqId);
    if (!rfqData) {
      router.push('/dashboard');
      return;
    }

    setAuction(auctionData);
    setRfq(rfqData);

    // Load bids
    const bidsData = getBidsByAuctionId(auctionId);
    setBids(bidsData);

    setLoading(false);
  }, [auctionId, router]);

  const handleBidSubmit = (amount: number) => {
    if (!user || !auction) return;

    // Create new bid
    const newBid = createBid({
      auctionId: auction.id,
      supplierId: user.id,
      amount,
      rank: bids.length + 1,
      bidTime: new Date(),
    });

    // Add to logs
    createAuctionLog(auction.id, 'bid_placed', {
      supplierId: user.id,
      amount,
      timestamp: new Date(),
    });

    // Update bids
    const updatedBids = getBidsByAuctionId(auctionId);
    setBids(updatedBids);

    alert('Bid submitted successfully!');
  };

  if (loading || !auction || !rfq) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading auction...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Auction Details */}
          <div className="lg:col-span-2">
            <AuctionDetails auction={auction} rfq={rfq} />
          </div>

          {/* Right: Bid Form */}
          <div className="lg:col-span-1">
            {user?.role === 'supplier' && auction.status !== 'closed' ? (
              <BidForm auctionId={auction.id} onSubmit={handleBidSubmit} />
            ) : (
              <div className="border border-border rounded-lg bg-card p-6">
                <p className="text-muted-foreground text-center">
                  {auction.status === 'closed'
                    ? 'Auction is closed'
                    : 'Only suppliers can bid'}
                </p>
              </div>
            )}

            {/* Active Bids */}
            <div className="mt-6 border border-border rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">ACTIVE BIDS</h3>
              <div className="space-y-2">
                {bids.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No bids yet</p>
                ) : (
                  bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">Rank #{index + 1}</p>
                        <p className="text-sm font-semibold text-foreground">${bid.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bid.bidTime).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
