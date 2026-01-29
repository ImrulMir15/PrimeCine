# 🎬 PrimeCine - Premium Seats. Prime Moments

A modern, Gen-Z styled online movie ticket booking platform built with React, Node.js, and MongoDB.

## 🌟 Features

- 🎥 **Movie Browsing**: Now Showing & Coming Soon sections
- 🎟️ **Ticket Booking**: Interactive seat selection with real-time availability
- 🔐 **Authentication**: Firebase Auth with Google Sign-In & Email/Password
- 💳 **Payments**: Stripe integration (test mode)
- 🎨 **Modern UI**: Dark theme with purple/neon gradients, glassmorphism effects
- 📱 **Responsive**: Fully responsive design for all devices
- 🔒 **Secure**: Rate limiting, bot protection with Arcjet
- 📧 **Contact**: EmailJS integration for contact forms

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Auth**: Firebase Authentication
- **Payments**: Stripe
- **Animations**: Framer Motion
- **Icons**: React Icons
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Auth**: JWT + bcryptjs
- **Payments**: Stripe
- **Security**: Arcjet (rate limiting, bot protection)
- **Image Upload**: Cloudinary

## 📋 Prerequisites

Before you begin, make sure you have:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## 🚀 Getting Started

### Step 1: Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### Step 2: Set Up Free Services

You'll need to create FREE accounts for the following services:

#### 1️⃣ **MongoDB Atlas** (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

#### 2️⃣ **Firebase** (Authentication)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Sign-in methods → Enable "Email/Password" and "Google"
4. Go to Project Settings → General
5. Scroll down to "Your apps" → Click web icon (</>) to create a web app
6. Copy the Firebase configuration values

#### 3️⃣ **Stripe** (Payments - Test Mode)
1. Go to [Stripe](https://dashboard.stripe.com/register)
2. Create a free account
3. Go to Developers → API keys
4. Copy the **Publishable key** (starts with `pk_test_`)
5. Copy the **Secret key** (starts with `sk_test_`)

#### 4️⃣ **Cloudinary** (Image Hosting)
1. Go to [Cloudinary](https://cloudinary.com/users/register/free)
2. Create a free account
3. Go to Dashboard
4. Copy: Cloud Name, API Key, API Secret
5. Go to Settings → Upload → Upload presets → Create upload preset (unsigned)

#### 5️⃣ **EmailJS** (Contact Form)
1. Go to [EmailJS](https://www.emailjs.com/)
2. Create a free account
3. Add Email Service (Gmail recommended)
4. Create Email Template
5. Copy: Service ID, Template ID, Public Key

#### 6️⃣ **Arcjet** (Security - Optional)
1. Go to [Arcjet](https://arcjet.com/)
2. Create a free account
3. Create a new site
4. Copy the API key

### Step 3: Configure Environment Variables

#### Frontend (.env)
Create a `.env` file in the `frontend` folder:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API
VITE_API_URL=http://localhost:5000/api

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here

# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

#### Backend (.env)
Create a `.env` file in the `backend` folder:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/primecine?retryWrites=true&w=majority

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_random_string_here

# Stripe Secret Key
STRIPE_SECRET_KEY=sk_test_your_key_here

# Arcjet (optional)
ARCJET_KEY=your_arcjet_key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 4: Run the Application

#### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

## 📁 Project Structure

```
PrimeCine/
├── frontend/                 # React frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context (Auth, etc.)
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── assets/          # Images, icons
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
└── backend/                 # Node.js backend
    ├── models/              # MongoDB models
    ├── routes/              # API routes
    ├── controllers/         # Route controllers
    ├── middleware/          # Custom middleware
    ├── config/              # Configuration files
    ├── utils/               # Utility functions
    ├── server.js            # Main server file
    ├── .env                 # Environment variables
    └── package.json
```

## 🎨 Design Features

- **Dark Theme**: Sleek dark background with purple/neon accents
- **Glassmorphism**: Frosted glass effect on cards
- **Glow Effects**: Neon glow on buttons and interactive elements
- **Smooth Animations**: Hover effects, transitions, micro-interactions
- **Responsive**: Mobile-first design

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting (Arcjet)
- Bot protection (Arcjet)
- CORS configuration
- Environment variable protection

## 📱 Pages

1. **Home**: Hero slider, Now Showing, Coming Soon
2. **Movies**: Browse all movies
3. **Movie Details**: Poster, trailer, cast, showtimes
4. **Booking**: Seat selection, pricing
5. **Checkout**: Payment with Stripe
6. **Profile**: User dashboard, booking history
7. **Admin**: Manage movies & showtimes (protected)
8. **Contact**: Contact form with EmailJS

## 🧪 Testing

### Test Payment Cards (Stripe)
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables
4. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Add environment variables
4. Deploy

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💬 Support

If you have any questions or need help, please open an issue.

---

**Built with ❤️ by PrimeCine Team: MD. Imrul Kowsar Mir**

*Premium Seats. Prime Moments.*
