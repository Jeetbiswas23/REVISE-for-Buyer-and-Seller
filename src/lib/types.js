// Type definitions as JSDoc comments for reference
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} fullName
 * @property {string} company
 * @property {'buyer' | 'supplier'} role
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} RFQ
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} origin
 * @property {string} destination
 * @property {Date} pickupDate
 * @property {string} buyerId
 * @property {string} currency
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} AuctionConfig
 * @property {string} id
 * @property {string} rfqId
 * @property {Date} bidStartTime
 * @property {Date} bidCloseTime
 * @property {Date} forcedCloseTime
 * @property {number} triggerWindowMinutes
 * @property {number} extensionDurationMinutes
 * @property {'scheduled' | 'active' | 'closed'} status
 * @property {string|null} awardedBidId
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Bid
 * @property {string} id
 * @property {string} auctionId
 * @property {string} supplierId
 * @property {number} amount
 * @property {string} offerDetails
 * @property {string} deliveryTimeline
 * @property {number} rank
 * @property {Date} bidTime
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} AuctionLog
 * @property {string} id
 * @property {string} auctionId
 * @property {'bid_placed' | 'rank_change' | 'extension_triggered' | 'auction_closed' | 'bid_awarded'} eventType
 * @property {Record<string, any>} details
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} AuctionState
 * @property {string} id
 * @property {string} rfqId
 * @property {Date} bidStartTime
 * @property {Date} bidCloseTime
 * @property {Date} forcedCloseTime
 * @property {number} triggerWindowMinutes
 * @property {number} extensionDurationMinutes
 * @property {'scheduled' | 'active' | 'closed'} status
 * @property {string|null} awardedBidId
 * @property {Bid[]} bids
 * @property {AuctionLog[]} logs
 */

export const ROLES = {
  BUYER: 'buyer',
  SUPPLIER: 'supplier',
};

export const AUCTION_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  CLOSED: 'closed',
};

export const EVENT_TYPES = {
  BID_PLACED: 'bid_placed',
  RANK_CHANGE: 'rank_change',
  EXTENSION_TRIGGERED: 'extension_triggered',
  AUCTION_CLOSED: 'auction_closed',
  BID_AWARDED: 'bid_awarded',
};

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
};
