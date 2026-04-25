# 🚀 Setup Guide - AuctionHub React Version

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js) or **pnpm** / **yarn**

Check your versions:

```bash
node --version
npm --version
```

## Installation Steps

### Step 1: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
npm install
```

Or if you prefer pnpm:

```bash
pnpm install
```

Or if you prefer yarn:

```bash
yarn install
```

This may take a few minutes. You should see output showing installed packages like:

- react
- react-dom
- react-router-dom
- vite
- tailwindcss
- And development dependencies

### Step 2: Start the Development Server

```bash
npm run dev
```

You should see output like:

```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

The browser should automatically open to `http://localhost:5173/`

### Step 3: See the App Running

You should now see the AuctionHub login/signup page. The app is live and ready to use!

## First Time Usage

1. **Create an Account:**
   - Click "Sign Up"
   - Fill in: Full Name, Company, Email
   - Choose role: Buyer or Supplier
   - Click "Sign Up"

2. **Or Use Demo Account:**
   - Click "Sign In"
   - Use: `buyer@acmelogistics.com`
   - Password can be anything (demo mode)
   - Click "Sign In"

3. **Explore Features:**
   - View auction board
   - Click "View" on any auction
   - Place bids (if supplier)
   - Create RFQs (if buyer)

## Development Workflow

### Running the App

```bash
npm run dev
```

- App reloads automatically when you save files
- Check browser console for errors

### Building for Production

```bash
npm run build
```

- Creates optimized build in `dist/` folder
- Ready to deploy to any static host

### Preview Production Build

```bash
npm run preview
```

- Test production build locally before deployment

### Linting

```bash
npm run lint
```

- Check code for quality issues

## Project Structure

```
├── src/
│   ├── pages/           # Page components (Home, Signin, Signup, etc)
│   ├── components/      # Reusable components
│   ├── lib/             # Database & utilities
│   ├── App.jsx          # Routes configuration
│   ├── index.jsx        # Entry point
│   └── index.css        # Tailwind styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── package.json         # Dependencies
└── README.md            # Documentation
```

## Key Directories

- **`src/pages/`** - Full page components (add new pages here)
- **`src/components/`** - Reusable UI components
- **`src/lib/db.js`** - All database operations (in-memory)
- **`src/lib/utils.js`** - Helper functions

## Understanding the Data Flow

```
Browser → React Components → React Router
   ↓
   → App State (useState)
   ↓
   → Database (src/lib/db.js)
   ↓
   → SessionStorage (client-side persistence)
```

## Common Issues & Solutions

### Issue: Port 5173 is already in use

**Solution:** Change port in `vite.config.js`:

```javascript
server: {
  port: 3000, // Change to different port
}
```

### Issue: "Cannot find module" error

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Styles not loading

**Solution:** Ensure Tailwind CSS is imported in `src/index.css`

### Issue: Demo data not appearing

**Solution:** Open DevTools → Application → Clear SessionStorage → Refresh

## Available NPM Scripts

| Command           | Purpose                  |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Check code quality       |

## File Size & Performance

- Development build: ~500KB (with hot reload)
- Production build: ~50-80KB (optimized)
- Load time: <1 second on modern networks

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Create an account or use demo login
4. ✅ Explore the application
5. ✅ Modify components and see changes live

## Deployment

### To Deploy to Vercel:

```bash
npm run build
# Then push to GitHub and connect to Vercel
```

### To Deploy to Netlify:

```bash
npm run build
# Upload 'dist' folder to Netlify
```

### To Deploy Anywhere:

```bash
npm run build
# Upload 'dist' folder to any static host (AWS S3, GitHub Pages, etc)
```

## Need Help?

- Check browser console for errors (F12)
- Check terminal output for warnings
- Read inline comments in code files
- Check the README.md for feature documentation

---

**You're all set! 🎉 Happy building!**
