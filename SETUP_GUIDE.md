# 🎬 PrimeCine Setup Guide for Beginners

Welcome! This guide will walk you through setting up all the FREE services needed for PrimeCine.

## ✅ What We've Done So Far

1. ✅ Created frontend with React + Vite + Tailwind CSS
2. ✅ Created backend structure with Express.js
3. ✅ Installed all necessary dependencies
4. ✅ Created beautiful UI components with Gen-Z styling
5. ✅ Set up routing and navigation

## 🚀 Current Status

Your frontend is now running at: **http://localhost:5173**

You can see:
- ✨ Beautiful home page with hero slider
- 🎨 Modern navbar with glassmorphism
- 📱 Fully responsive design
- 🌈 Purple/neon gradient theme

## 📝 Next Steps: Setting Up Free Services

To make the app fully functional, you need to set up these FREE services:

### 1️⃣ MongoDB Atlas (Database) - **REQUIRED**

**What it's for:** Storing movies, users, bookings, and payments data

**Steps:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Click "Sign Up" and create a free account
3. Choose "Free" tier (M0 Sandbox)
4. Select a cloud provider (AWS recommended) and region closest to you
5. Click "Create Cluster" (wait 3-5 minutes)
6. Click "Database Access" → "Add New Database User"
   - Username: `primecine_admin`
   - Password: Click "Autogenerate Secure Password" and SAVE IT
7. Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
8. Click "Database" → "Connect" → "Connect your application"
9. Copy the connection string (looks like: `mongodb+srv://...`)
10. Replace `<password>` with your saved password

**Where to paste:** In `backend/.env` file, update:
```
MONGODB_URI=mongodb+srv://primecine_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/primecine?retryWrites=true&w=majority
```

---

### 2️⃣ Firebase (Authentication) - **REQUIRED**

**What it's for:** User login/signup with email and Google

**Steps:**
1. Go to https://console.firebase.google.com/
2. Click "Add Project"
3. Name it "PrimeCine" → Continue
4. Disable Google Analytics (optional) → Create Project
5. Click the web icon `</>` to add a web app
6. Name it "PrimeCine Web" → Register app
7. Copy the firebaseConfig values
8. Go to "Authentication" → "Get Started"
9. Click "Sign-in method" tab
10. Enable "Email/Password" → Save
11. Enable "Google" → Add support email → Save

**Where to paste:** In `frontend/.env` file, update:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=primecine-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=primecine-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=primecine-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

---

### 3️⃣ Stripe (Payments - Test Mode) - **REQUIRED**

**What it's for:** Processing ticket payments (test mode only)

**Steps:**
1. Go to https://dashboard.stripe.com/register
2. Create a free account
3. Skip business details (you can fill later)
4. Go to "Developers" → "API keys"
5. Toggle "Test mode" ON (top right)
6. Copy "Publishable key" (starts with `pk_test_`)
7. Click "Reveal test key" and copy "Secret key" (starts with `sk_test_`)

**Where to paste:**
- Frontend `.env`:
```
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
```
- Backend `.env`:
```
STRIPE_SECRET_KEY=sk_test_xxxxx
```

**Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future date and any 3-digit CVC

---

### 4️⃣ Cloudinary (Image Hosting) - **REQUIRED**

**What it's for:** Uploading and storing movie posters

**Steps:**
1. Go to https://cloudinary.com/users/register/free
2. Create a free account
3. Verify your email
4. Go to Dashboard
5. Copy: "Cloud Name", "API Key", "API Secret"
6. Go to Settings → Upload → Upload Presets
7. Click "Add upload preset"
8. Name it "primecine_movies"
9. Set "Signing Mode" to "Unsigned"
10. Save

**Where to paste:**
- Frontend `.env`:
```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=primecine_movies
```
- Backend `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 5️⃣ EmailJS (Contact Form) - **OPTIONAL**

**What it's for:** Sending emails from contact form

**Steps:**
1. Go to https://www.emailjs.com/
2. Create a free account
3. Go to "Email Services" → "Add New Service"
4. Choose "Gmail" (or your preferred email)
5. Connect your Gmail account
6. Copy the "Service ID"
7. Go to "Email Templates" → "Create New Template"
8. Design your template or use default
9. Copy the "Template ID"
10. Go to "Account" → Copy "Public Key"

**Where to paste:** In `frontend/.env`:
```
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxx
```

---

### 6️⃣ Arcjet (Security) - **OPTIONAL**

**What it's for:** Rate limiting and bot protection

**Steps:**
1. Go to https://arcjet.com/
2. Create a free account
3. Create a new site
4. Copy the API key

**Where to paste:** In `backend/.env`:
```
ARCJET_KEY=ajkey_xxxxx
```

---

## 🔧 After Setting Up Services

### 1. Update Environment Variables

Make sure both `.env` files are filled:
- `frontend/.env` - Frontend configuration
- `backend/.env` - Backend configuration

### 2. Generate JWT Secret

For `backend/.env`, generate a random JWT secret:

**Option 1 - Use Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2 - Use a random string:**
```
JWT_SECRET=my_super_secret_random_string_12345_change_this
```

### 3. Start the Backend

Open a NEW terminal and run:
```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

### 4. Keep Frontend Running

Your frontend should still be running on: http://localhost:5173

If not, run:
```bash
cd frontend
npm run dev
```

---

## 🎯 Testing the Application

1. Open http://localhost:5173 in your browser
2. You should see:
   - ✨ Beautiful hero slider
   - 🎬 Movie cards
   - 🎨 Smooth animations
   - 📱 Responsive design

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### MongoDB connection error
- Check your connection string
- Make sure you replaced `<password>` with actual password
- Verify IP whitelist includes 0.0.0.0/0

### Tailwind styles not working
- Make sure `tailwind.config.js` and `postcss.config.js` exist
- Restart the dev server

---

## 📚 What's Next?

After setting up all services, we'll build:

1. ✅ **Phase 1: Basic Setup** (DONE)
   - Project structure
   - UI components
   - Routing

2. 🔄 **Phase 2: Core Features** (NEXT)
   - Movie listing from database
   - Movie details page
   - Seat selection system
   - Booking flow

3. 🔄 **Phase 3: Authentication**
   - Firebase integration
   - Login/Register functionality
   - Protected routes

4. 🔄 **Phase 4: Payments**
   - Stripe integration
   - Checkout process
   - Payment confirmation

5. 🔄 **Phase 5: Admin Panel**
   - Add/edit movies
   - Manage showtimes
   - View bookings

---

## 💡 Tips for Beginners

1. **Don't rush** - Set up one service at a time
2. **Save your keys** - Keep all API keys in a safe place
3. **Test mode** - Always use test mode for Stripe
4. **Free tier** - All services have generous free tiers
5. **Ask for help** - If stuck, just ask!

---

## 📞 Need Help?

If you're stuck on any step, let me know which service you're setting up and what error you're seeing!

---

**Built with ❤️ for beginners**

*Premium Seats. Prime Moments* 🎬
