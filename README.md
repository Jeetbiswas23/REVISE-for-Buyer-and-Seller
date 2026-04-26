# Revise - Reverse Auction OS

**Revise** is an enterprise-grade Procurement & Bidding platform built for fast-paced operators. It allows buyers and suppliers to seamlessly coordinate, rank, and execute British-style reverse auctions across freight, transit, and service lanes.

## Core Features

### 🏢 For Buyers
- **Live RFQ Generation:** Easily construct and deploy Request for Quotations outlining timelines, origins, destinations, and currencies.
- **Automated Auction Windows:** Configure highly specific Bid Start times, Close times, and Forced Overtime Close caps.
- **British-style Auto-Extensions:** Automatically extend closing windows (e.g., add 2 minutes if someone bids in the final 2 minutes) to guarantee true market-clearing competitive prices.
- **Contract Awarding:** Immediately award contracts to the winning bid and permanently close out negotiations with a fully auditable trail.

### 🚚 For Suppliers
- **Competitive Live Ranking:** See exactly where your bid stands in the live leaderboard to stay competitive.
- **Granular Offer Details:** Bundle additional value in your bids with custom delivery service agreements or insurance descriptions.
- **Real-Time Spread Math:** Track exactly how much further you need to drop your bid to take over the crucial #1 (L1) rank.

## Tech Stack
Built utilizing a full **Model-View-Controller (MVC) architecture**:
- **Frontend:** React, Vite, Tailwind CSS (Dark/Zinc Premium Aesthetic)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose Schema design)
- **Authentication:** Custom JWT (JSON Web Token) with distinct `Buyer` and `Supplier` session layers.

## Getting Started

1. **Start the Database** 
   Ensure you have a local MongoDB instance running on your machine (Port `27017`).
2. **Start the Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
3. **Start the Frontend** (In a new terminal window)
   ```bash
   npm install
   npm run dev
   ```

Open up `http://localhost:5173` to jump into the Revise environment!
