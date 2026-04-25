// API utility for REVERSE Auction OS

const BASE_URL = '/api';

const getAuthHeaders = () => {
  const userStr = sessionStorage.getItem('currentUser');
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    };
  }
  return { 'Content-Type': 'application/json' };
};

// Auth
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }
  return res.json();
};

export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }
  return res.json();
};

// RFQ
export const createRFQ = async (rfqData) => {
  const res = await fetch(`${BASE_URL}/rfqs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(rfqData),
  });
  if (!res.ok) throw new Error('Failed to create RFQ');
  return res.json();
};

export const getRFQById = async (id) => {
  const res = await fetch(`${BASE_URL}/rfqs/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch RFQ');
  return res.json();
};

// Auctions
export const createAuction = async (auctionData) => {
  const res = await fetch(`${BASE_URL}/auctions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(auctionData),
  });
  if (!res.ok) throw new Error('Failed to create Auction');
  return res.json();
};

export const getAllAuctions = async () => {
  const res = await fetch(`${BASE_URL}/auctions`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch auctions');
  return res.json();
};

export const getAuctionById = async (id) => {
  const res = await fetch(`${BASE_URL}/auctions/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch auction');
  return res.json();
};

export const awardAuction = async (auctionId, bidId) => {
  const res = await fetch(`${BASE_URL}/auctions/${auctionId}/award`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ bidId }),
  });
  if (!res.ok) throw new Error('Failed to award auction');
  return res.json();
};

// Bids
export const placeBid = async (bidData) => {
  const res = await fetch(`${BASE_URL}/bids`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bidData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to place bid');
  }
  return res.json();
};

export const getAuctionActivity = async (auctionId) => {
  const res = await fetch(`${BASE_URL}/bids/${auctionId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch activity');
  return res.json(); // { bids: [], logs: [] }
};
