import { AuctionConfig, Bid } from './types';

/**
 * Check if auction should be extended based on the last bid
 * Extends when:
 * 1. Bid is placed within trigger window before bid close
 * 2. L1 (lowest bidder) changes
 * 3. Any rank change
 * 4. But never exceeds forced close time
 */
export function shouldExtendAuction(
  auction: AuctionConfig,
  previousBids: Bid[],
  newBid: Bid,
  currentTime: Date
): boolean {
  // Check if already past bid close time but before forced close
  const timeSinceBidClose = currentTime.getTime() - auction.bidCloseTime.getTime();
  if (timeSinceBidClose < 0) {
    // Auction hasn't closed yet, check if within trigger window
    const timeUntilClose = auction.bidCloseTime.getTime() - currentTime.getTime();
    const triggerWindowMs = auction.triggerWindowMinutes * 60 * 1000;

    if (timeUntilClose > 0 && timeUntilClose <= triggerWindowMs) {
      return true;
    }
  } else if (timeSinceBidClose >= 0) {
    // Check if within extension period
    const oldL1 = previousBids.length > 0 ? previousBids[0] : null;
    const newL1 = [newBid, ...previousBids].sort((a, b) => a.amount - b.amount)[0];

    // Check if L1 changed or if it's within trigger window
    if (oldL1?.id !== newL1.id) {
      return true;
    }

    // Check if any rank changed significantly
    const previousRanks = new Map(previousBids.map((b, i) => [b.id, i]));
    for (const bid of [newBid, ...previousBids]) {
      const newRank = [newBid, ...previousBids]
        .sort((a, b) => a.amount - b.amount)
        .findIndex((b) => b.id === bid.id);
      const oldRank = previousRanks.get(bid.id);
      if (oldRank !== undefined && oldRank !== newRank) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Calculate new close time if auction should be extended
 * Extension never exceeds forced close time
 */
export function getNewCloseTime(
  auction: AuctionConfig,
  currentCloseTime: Date,
  currentTime: Date
): Date {
  const extensionMs = auction.extensionDurationMinutes * 60 * 1000;
  const newCloseTime = new Date(Math.max(currentCloseTime.getTime(), currentTime.getTime()) + extensionMs);

  // Never exceed forced close
  if (newCloseTime.getTime() > auction.forcedCloseTime.getTime()) {
    return auction.forcedCloseTime;
  }

  return newCloseTime;
}

/**
 * Get ranked bids (lowest amount wins in reverse auction)
 */
export function getRankedBids(bids: Bid[]): Bid[] {
  return [...bids]
    .sort((a, b) => a.amount - b.amount)
    .map((bid, index) => ({
      ...bid,
      rank: index + 1,
    }));
}

/**
 * Check if auction is closed
 */
export function isAuctionClosed(auction: AuctionConfig, currentTime: Date): boolean {
  return currentTime.getTime() >= auction.forcedCloseTime.getTime();
}

/**
 * Get auction status description
 */
export function getAuctionStatusDescription(
  auction: AuctionConfig,
  currentTime: Date
): {
  status: 'scheduled' | 'active' | 'closed';
  message: string;
  timeRemaining?: number;
} {
  if (currentTime.getTime() < auction.bidStartTime.getTime()) {
    return {
      status: 'scheduled',
      message: 'Auction has not started yet',
    };
  }

  if (currentTime.getTime() >= auction.forcedCloseTime.getTime()) {
    return {
      status: 'closed',
      message: 'Auction is closed',
    };
  }

  const timeRemaining = auction.forcedCloseTime.getTime() - currentTime.getTime();
  return {
    status: 'active',
    message: 'Auction is active',
    timeRemaining,
  };
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
