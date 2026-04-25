'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuctionsByStatus, getAuctionState, getAllRFQs, getRFQById, seedDatabase, getAuctionByRFQId, createAuction } from '@/lib/db';
import { AuctionConfig, RFQ, User } from '@/lib/types';
import Header from '@/components/header';
import AuctionBoard from '@/components/auction-board';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [auctions, setAuctions] = useState<
    (AuctionConfig & { rfq: RFQ; bidCount: number })[]
  >([]);
  const [stats, setStats] = useState({ active: 0, scheduled: 0, closed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/signup');
      return;
    }

    const currentUser = JSON.parse(userStr);
    setUser(currentUser);

    // Seed database on first load
    const isSeeded = sessionStorage.getItem('dbSeeded');
    if (!isSeeded) {
      seedDatabase();
      sessionStorage.setItem('dbSeeded', 'true');
    }

    // Load auctions
    const allRFQs = getAllRFQs();
    const auctionList: (AuctionConfig & { rfq: RFQ; bidCount: number })[] = [];

    allRFQs.forEach((rfq) => {
      // For demo: create auction for each RFQ if it doesn't exist
      let auction = getAuctionByRFQId(rfq.id);

      if (!auction) {
        // Create auction for demo
        const now = new Date();
        const bidStart = new Date(now.getTime() + 5 * 60000);
        const bidClose = new Date(bidStart.getTime() + 60 * 60000);
        const forcedClose = new Date(bidClose.getTime() + 30 * 60000);

        auction = createAuction({
          rfqId: rfq.id,
          bidStartTime: bidStart,
          bidCloseTime: bidClose,
          forcedCloseTime: forcedClose,
          triggerWindowMinutes: 2,
          extensionDurationMinutes: 2,
          status: 'closed',
        });
      }

      const auctionState = getAuctionState(auction.id);
      auctionList.push({
        ...auction,
        rfq,
        bidCount: auctionState?.bids.length || 0,
      });
    });

    setAuctions(auctionList);

    // Calculate stats
    const activeCount = auctionList.filter((a) => a.status === 'active').length;
    const scheduledCount = auctionList.filter((a) => a.status === 'scheduled').length;
    const closedCount = auctionList.filter((a) => a.status === 'closed').length;

    setStats({
      active: activeCount,
      scheduled: scheduledCount,
      closed: closedCount,
    });

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <p className="text-xs tracking-wider text-muted-foreground mb-2">
              {user?.role === 'buyer' ? 'BUYER' : 'SUPPLIER'} WORKSPACE
            </p>
            <h1 className="text-5xl font-bold text-foreground mb-2">Auction Board</h1>
            <p className="text-foreground/70">
              {user?.role === 'buyer'
                ? 'Manage RFQs and monitor live bidding.'
                : 'Review open auctions and submit competitive bids.'}
            </p>
          </div>

          {user?.role === 'buyer' && (
            <Link
              href="/create-rfq"
              className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 transition-opacity"
            >
              + New RFQ
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-border bg-card rounded-lg p-6">
            <p className="text-xs tracking-wider text-muted-foreground mb-2">
              ACTIVE AUCTIONS
            </p>
            <p className="text-4xl font-bold text-accent">{stats.active}</p>
          </div>
          <div className="border border-border bg-card rounded-lg p-6">
            <p className="text-xs tracking-wider text-muted-foreground mb-2">SCHEDULED</p>
            <p className="text-4xl font-bold text-chart-2">{stats.scheduled}</p>
          </div>
          <div className="border border-border bg-card rounded-lg p-6">
            <p className="text-xs tracking-wider text-muted-foreground mb-2">CLOSED</p>
            <p className="text-4xl font-bold text-white">{stats.closed}</p>
          </div>
        </div>

        {/* Auctions Table */}
        <AuctionBoard auctions={auctions} userRole={user?.role || 'supplier'} />
      </main>
    </div>
  );
}
