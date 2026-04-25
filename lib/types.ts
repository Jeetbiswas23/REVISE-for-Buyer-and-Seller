export type UserRole = 'buyer' | 'supplier';

export interface User {
  id: string;
  email: string;
  fullName: string;
  company: string;
  role: UserRole;
  createdAt: Date;
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  pickupDate: Date;
  buyerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuctionConfig {
  id: string;
  rfqId: string;
  bidStartTime: Date;
  bidCloseTime: Date;
  forcedCloseTime: Date;
  triggerWindowMinutes: number;
  extensionDurationMinutes: number;
  status: 'scheduled' | 'active' | 'closed';
  createdAt: Date;
}

export interface Bid {
  id: string;
  auctionId: string;
  supplierId: string;
  amount: number;
  rank: number;
  bidTime: Date;
  createdAt: Date;
}

export interface AuctionLog {
  id: string;
  auctionId: string;
  eventType: 'bid_placed' | 'rank_change' | 'extension_triggered' | 'auction_closed';
  details: Record<string, any>;
  createdAt: Date;
}

export interface AuctionState {
  id: string;
  rfqId: string;
  bidStartTime: Date;
  bidCloseTime: Date;
  forcedCloseTime: Date;
  triggerWindowMinutes: number;
  extensionDurationMinutes: number;
  status: 'scheduled' | 'active' | 'closed';
  bids: Bid[];
  logs: AuctionLog[];
}
