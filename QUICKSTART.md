# 🚀 QUICK START GUIDE

## Installation & Running (60 seconds)

```bash
# 1. Install packages
npm install

# 2. Start server
npm run dev

# 3. Browser opens to http://localhost:5173
```

## Login with Demo Account

**Email:** `buyer@acmelogistics.com`
**Password:** (any password - this is demo mode)

Or create a new account:

- Click "Sign Up"
- Fill in details
- Choose role (Buyer/Supplier)

---

## 🎯 Key Differences from Original

### Next.js → React

- ✋ No more `next/link` - use React Router
- ✋ No more `next/navigation` - use `useNavigate()`
- ✋ No more API routes - use `src/lib/db.js`
- ✋ No more TypeScript - use JSX with JSDoc comments
- ✅ Same Tailwind CSS styling
- ✅ Same functionality & features

### File Changes

```
next.config.mjs        ❌ Deleted
app/                   ❌ → src/pages/
app/api/               ❌ → src/lib/db.js
tsconfig.json          ⚠️  Unused
package.json           ✅ Updated
```

### New Files

```
vite.config.js         ✅ New (build config)
tailwind.config.js     ✅ New (theme)
postcss.config.js      ✅ New (CSS processing)
.eslintrc.json         ✅ New (code quality)
index.html             ✅ New (entry point)
src/                   ✅ New (main directory)
```

---

## 📁 Where to Find Things

| What       | Where                                         |
| ---------- | --------------------------------------------- |
| Pages      | `src/pages/` (Dashboard, Signin, etc)         |
| Components | `src/components/` (Header, AuctionBoard, etc) |
| Database   | `src/lib/db.js` (all data operations)         |
| Utils      | `src/lib/utils.js` (helper functions)         |
| Styles     | `src/index.css` + `tailwind.config.js`        |
| Routes     | `src/App.jsx`                                 |

---

## 💻 Common Commands

| Command           | What it does             |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Create production build  |
| `npm run preview` | Test production build    |
| `npm run lint`    | Check code for errors    |

---

## 🔗 Routes Available

| Route          | Purpose                  |
| -------------- | ------------------------ |
| `/`            | Home (redirects)         |
| `/signin`      | Login page               |
| `/signup`      | Create account           |
| `/dashboard`   | Auction board            |
| `/auction/:id` | View auction details     |
| `/create-rfq`  | Create RFQ (buyers only) |

---

## 🎮 Features to Try

1. **Sign In** with demo account
2. **View Auctions** on dashboard
3. **Click "View"** to see auction details
4. **Place Bid** (if logged in as supplier)
5. **Create RFQ** (if logged in as buyer)

---

## 🚨 If Something Breaks

### React won't start

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use

Edit `vite.config.js` and change port to 3000/3001

### Demo data gone

Clear browser storage and refresh

### Styles not loading

Check `src/index.css` imports Tailwind

---

## 📦 Project Size

- Development: ~200MB (with node_modules)
- Production: ~50KB (optimized)
- Load time: <1 second

---

## 🚢 Ready to Deploy?

```bash
# Build
npm run build

# Upload 'dist/' folder to:
# - Vercel
# - Netlify
# - AWS S3
# - GitHub Pages
# - Any static host
```

---

## ✅ Everything Works?

Then you're ready to:

- ✅ Modify components in `src/components/`
- ✅ Add new pages in `src/pages/`
- ✅ Update database in `src/lib/db.js`
- ✅ Deploy to production!

---

**That's it! You're all set! 🎉**

For detailed docs, see:

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `CONVERSION.md` - What changed from Next.js
