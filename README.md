# AuctionHub - React Version

A modern freight auction management system built with React, React Router, and Tailwind CSS.

## ✨ What's Changed

This is a complete conversion from Next.js (with TypeScript) to standard React with JSX:

### Technology Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing (replaces Next.js routing)
- **Vite** - Build tool and dev server (replaces Next.js)
- **Tailwind CSS** - Styling
- **JSX** - Component syntax (instead of TSX)

### Project Structure

```
src/
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Signin.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── AuctionPage.jsx
│   └── CreateRFQ.jsx
├── components/         # Reusable components
│   ├── Header.jsx
│   ├── AuctionBoard.jsx
│   ├── AuctionDetails.jsx
│   └── BidForm.jsx
├── lib/                # Utilities and logic
│   ├── db.js           # In-memory database
│   ├── types.js        # Type definitions (JSDoc)
│   └── utils.js        # Utility functions
├── App.jsx             # Main app with routes
└── index.jsx           # Entry point
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 🔐 Demo Accounts

The app comes with pre-seeded demo data. Use any of these to sign in:

**Buyer Account:**

- Email: `buyer@acmelogistics.com`
- Password: (any password, validation is simplified)
- Company: ACME Logistics

**Supplier Accounts:**

- Email: `supplier1@bluelinefreight.com`
- Email: `supplier2@example.com`
- Password: (any password)

## 📚 Features

### For Buyers

- Create Request for Quotations (RFQs)
- View all auctions and live bids
- Monitor bidding activity
- Track auction status

### For Suppliers

- Browse active auctions
- Place competitive bids
- View bid rankings
- Track bid history

## 🔄 Routing

The following routes are available:

- `/` - Home (redirects to dashboard/signup)
- `/signin` - Sign in page
- `/signup` - Create new account
- `/dashboard` - Main auction board
- `/auction/:id` - Auction details & bidding
- `/create-rfq` - Create new RFQ (buyers only)

## 💾 Data Storage

The app uses an in-memory database stored in `src/lib/db.js`:

- **Persistence:** Data persists during the session (refreshing the page keeps data)
- **Demo Data:** Automatically seeded on first app load
- **Reset:** Clearing session storage will reset all data

## 🎨 Styling

Uses Tailwind CSS with custom theme colors:

- Dark and light mode support via CSS variables
- Responsive grid layouts
- Accessible form components
- Smooth transitions and animations

## 🔧 Key Files

| File                 | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `src/App.jsx`        | Main router configuration                   |
| `src/lib/db.js`      | In-memory database with all CRUD operations |
| `src/lib/utils.js`   | Format and utility functions                |
| `vite.config.js`     | Vite build configuration                    |
| `tailwind.config.js` | Tailwind CSS theme config                   |

## 🚨 Important Notes

1. **No Backend:** This is a frontend-only app with in-memory storage
2. **Session-Based:** Data persists only during the current session
3. **Demo Seeding:** Database auto-seeds on first visit
4. **Simplified Auth:** No password validation for demo purposes

## 📝 Migration Notes from Next.js

Key changes made during conversion:

| Next.js                                     | React               |
| ------------------------------------------- | ------------------- |
| `next/link` → `react-router-dom` links      | Navigation routing  |
| `next/navigation` useRouter → `useNavigate` | Route navigation    |
| Server components → Client components       | All JSX files now   |
| API routes → In-memory db.js                | Backend logic       |
| TypeScript → JSDoc comments                 | Type documentation  |
| `app/` directory → `src/pages/`             | Page organization   |
| Automatic routes → Explicit Routes          | React Router config |

## 🐛 Troubleshooting

### Port Already in Use

Change the dev server port in `vite.config.js`:

```javascript
server: {
  port: 3000, // Change this
}
```

### Styles Not Loading

Ensure Tailwind CSS is properly configured in `src/index.css`

### Demo Data Not Appearing

Check browser DevTools Console for errors, or clear session storage and restart

## 📦 Building for Production

```bash
npm run build
# Creates optimized build in 'dist/' directory

npm run preview
# Preview the production build locally
```

## 🤝 Support

For issues or questions about the React conversion:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Node.js version is 16+

---

**Happy Coding! 🚀**
