import { User, RFQ, AuctionConfig, Bid, AuctionLog, AuctionState } from './types';

// In-memory database
interface Database {
  users: Map<string, User>;
  rfqs: Map<string, RFQ>;
  auctions: Map<string, AuctionConfig>;
  bids: Map<string, Bid>;
  logs: Map<string, AuctionLog>;
}

const db: Database = {
  users: new Map(),
  rfqs: new Map(),
  auctions: new Map(),
  bids: new Map(),
  logs: new Map(),
};

// User operations
export function createUser(user: Omit<User, 'id' | 'createdAt'>) {
  const id = `user_${Date.now()}`;
  const newUser: User = {
    ...user,
    id,
    createdAt: new Date(),
  };
  db.users.set(id, newUser);
  return newUser;
}

export function getUserById(id: string): User | undefined {
  return db.users.get(id);
}

export function getUserByEmail(email: string): User | undefined {
  for (const user of db.users.values()) {
    if (user.email === email) return user;
  }
  return undefined;
}

// RFQ operations
export function createRFQ(rfq: Omit<RFQ, 'id' | 'createdAt' | 'updatedAt'>) {
  const id = `rfq_${Date.now()}`;
  const newRFQ: RFQ = {
    ...rfq,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.rfqs.set(id, newRFQ);
  return newRFQ;
}

export function getRFQById(id: string): RFQ | undefined {
  return db.rfqs.get(id);
}

export function getAllRFQs(): RFQ[] {
  return Array.from(db.rfqs.values());
}

export function getRFQsByBuyer(buyerId: string): RFQ[] {
  return Array.from(db.rfqs.values()).filter((rfq) => rfq.buyerId === buyerId);
}

// Auction operations
export function createAuction(auction: Omit<AuctionConfig, 'id' | 'createdAt'>) {
  const id = `auction_${Date.now()}`;
  const newAuction: AuctionConfig = {
    ...auction,
    id,
    createdAt: new Date(),
  };
  db.auctions.set(id, newAuction);
  return newAuction;
}

export function getAuctionById(id: string): AuctionConfig | undefined {
  return db.auctions.get(id);
}

export function getAuctionByRFQId(rfqId: string): AuctionConfig | undefined {
  for (const auction of db.auctions.values()) {
    if (auction.rfqId === rfqId) return auction;
  }
  return undefined;
}

export function getAuctionsByStatus(status: string): AuctionConfig[] {
  return Array.from(db.auctions.values()).filter((a) => a.status === status);
}

export function updateAuctionStatus(
  id: string,
  status: 'scheduled' | 'active' | 'closed'
) {
  const auction = db.auctions.get(id);
  if (auction) {
    auction.status = status;
    db.auctions.set(id, auction);
  }
  return auction;
}

// Bid operations
export function createBid(bid: Omit<Bid, 'id' | 'createdAt'>) {
  const id = `bid_${Date.now()}_${Math.random()}`;
  const newBid: Bid = {
    ...bid,
    id,
    createdAt: new Date(),
  };
  db.bids.set(id, newBid);
  return newBid;
}

export function getBidsByAuctionId(auctionId: string): Bid[] {
  return Array.from(db.bids.values())
    .filter((bid) => bid.auctionId === auctionId)
    .sort((a, b) => a.amount - b.amount);
}

// Auction Log operations
export function createAuctionLog(
  auctionId: string,
  eventType: string,
  details: Record<string, any>
) {
  const id = `log_${Date.now()}`;
  const log: AuctionLog = {
    id,
    auctionId,
    eventType: eventType as any,
    details,
    createdAt: new Date(),
  };
  db.logs.set(id, log);
  return log;
}

export function getAuctionLogs(auctionId: string): AuctionLog[] {
  return Array.from(db.logs.values())
    .filter((log) => log.auctionId === auctionId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

// Aggregate auction state
export function getAuctionState(auctionId: string): AuctionState | null {
  const auction = db.auctions.get(auctionId);
  if (!auction) return null;

  const bids = getBidsByAuctionId(auctionId);
  const logs = getAuctionLogs(auctionId);
  const rfq = db.rfqs.get(auction.rfqId);

  return {
    id: auctionId,
    rfqId: auction.rfqId,
    bidStartTime: auction.bidStartTime,
    bidCloseTime: auction.bidCloseTime,
    forcedCloseTime: auction.forcedCloseTime,
    triggerWindowMinutes: auction.triggerWindowMinutes,
    extensionDurationMinutes: auction.extensionDurationMinutes,
    status: auction.status,
    bids,
    logs,
  };
}

// Mock data for development
export function seedDatabase() {
  // Create test users
  const buyer = createUser({
    email: 'buyer@acmelogistics.com',
    fullName: 'Alex Morgan',
    company: 'ACME Logistics',
    role: 'buyer',
  });

  const supplier1 = createUser({
    email: 'supplier1@bluelinefreight.com',
    fullName: 'Priya Shah',
    company: 'Blueline Freight',
    role: 'supplier',
  });

  const supplier2 = createUser({
    email: 'supplier2@example.com',
    fullName: 'John Smith',
    company: 'Quick Transport',
    role: 'supplier',
  });

  // Create test RFQs
  const rfq1 = createRFQ({
    title: 'TEST_Cap_bea854',
    description: 'Shipping from Mumbai to Singapore',
    origin: 'Mumbai, IN',
    destination: 'Singapore, SG',
    pickupDate: new Date('2026-04-28T10:48:00'),
    buyerId: buyer.id,
  });

  const rfq2 = createRFQ({
    title: 'TEST_Auction_252c01',
    description: 'Logistics shipment X to Y',
    origin: 'New York, US',
    destination: 'Los Angeles, US',
    pickupDate: new Date('2026-04-30T08:00:00'),
    buyerId: buyer.id,
  });

  // Create test auction
  const now = new Date();
  const bidStart = new Date(now.getTime() + 5 * 60000);
  const bidClose = new Date(bidStart.getTime() + 60 * 60000);
  const forcedClose = new Date(bidClose.getTime() + 30 * 60000);

  const auction1 = createAuction({
    rfqId: rfq1.id,
    bidStartTime: bidStart,
    bidCloseTime: bidClose,
    forcedCloseTime: forcedClose,
    triggerWindowMinutes: 2,
    extensionDurationMinutes: 2,
    status: 'scheduled',
  });

  // Create some test bids
  createBid({
    auctionId: auction1.id,
    supplierId: supplier1.id,
    amount: 500,
    rank: 1,
    bidTime: new Date(bidStart.getTime() + 10 * 60000),
  });

  createBid({
    auctionId: auction1.id,
    supplierId: supplier2.id,
    amount: 1000,
    rank: 2,
    bidTime: new Date(bidStart.getTime() + 20 * 60000),
  });

  createAuctionLog(auction1.id, 'auction_closed', {
    finalBidCount: 2,
    winner: supplier1.id,
  });

  return { buyer, supplier1, supplier2, rfq1, rfq2, auction1 };
}
