# ✈️ Wanderlust — Full Stack Travel App

A complete, modern travel web application with Node.js backend and beautiful HTML/CSS/JS frontend.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

### 3. Open the App
Visit: **http://localhost:5000**

That's it! The backend serves the frontend automatically.

---

## 📁 Project Structure

```
travel-app/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── package.json
│   ├── data/
│   │   └── db.js              # In-memory data (8 destinations, users, bookings)
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   └── routes/
│       ├── auth.js            # Register, Login, Profile
│       ├── destinations.js    # Search, Filter, Get destinations
│       ├── bookings.js        # Create, View, Cancel bookings
│       ├── wishlist.js        # Save/remove destinations
│       └── reviews.js        # Add and view reviews
└── frontend/
    ├── index.html             # Full single-page app
    ├── css/
    │   └── styles.css         # Complete styles
    └── js/
        └── app.js             # All frontend logic & API calls
```

---

## 🌟 Features

### Frontend
- 🏠 **Home Page** — Hero, search bar, featured destinations, testimonials, newsletter
- 🗺️ **Explore Page** — All destinations with filter chips (Beach, Adventure, Cultural, Luxury, Nature, Romantic) and sort options
- ❤️ **Wishlist** — Save and manage favourite destinations
- 🧳 **My Bookings** — View and cancel travel bookings
- 🔐 **Auth** — Register / Login modal with JWT tokens
- 📸 **Destination Modal** — Full detail view with gallery, highlights, weather, reviews, and booking form
- 🔔 **Toast Notifications** — Success/error feedback
- 📱 **Responsive Design** — Works on mobile and desktop

### Backend API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profile (auth) |
| GET | /api/destinations | List/search/filter destinations |
| GET | /api/destinations/:id | Get single destination |
| GET | /api/destinations/featured/top | Top rated destinations |
| POST | /api/bookings | Create booking (auth) |
| GET | /api/bookings/my | My bookings (auth) |
| PATCH | /api/bookings/:id/cancel | Cancel booking (auth) |
| POST | /api/wishlist/toggle/:id | Toggle wishlist (auth) |
| GET | /api/wishlist | Get my wishlist (auth) |
| GET | /api/reviews/:destId | Get reviews |
| POST | /api/reviews/:destId | Post review (auth) |

---

## 🎨 Design Highlights
- **Fonts**: Playfair Display + DM Sans
- **Colors**: Ocean blue, coral, gold, cream
- **Animations**: Fade-in, hover lifts, shimmer loading
- **UI**: Cards, modals, toast notifications, sticky booking panel

---

## 📦 Dependencies
- **express** — Web framework
- **cors** — Cross-origin support
- **jsonwebtoken** — JWT auth tokens
- **bcryptjs** — Password hashing
- **uuid** — Unique IDs
- **nodemon** (dev) — Auto-restart

---

## 💡 Extending the App
- **Database**: Replace `data/db.js` with MongoDB/PostgreSQL
- **Payments**: Add Stripe integration in bookings route
- **Maps**: Add Google Maps to destination modal
- **Email**: Add Nodemailer for booking confirmations
- **Images**: Add Cloudinary for user-uploaded photos

---

Made with ❤️ by Wanderlust Team
