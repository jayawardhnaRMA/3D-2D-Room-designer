# Roomio - Interior Design Visualization Platform

Roomio is a **MERN stack** web application that empowers customers and designers to visualize and plan interior spaces with interactive 2D/3D furniture layouts before purchasing. The platform supports dual-role access (Customer & Designer) with role-specific dashboards, furniture libraries, and design tools.

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Troubleshooting](#troubleshooting)

---

## 🛠️ Tech Stack

### **Frontend (Client)**
- **React 19.2.4** - UI library for building interactive interfaces
- **React Router v7** - Client-side routing for navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Three.js & React Three Fiber** - 3D graphics and WebGL rendering
- **React Three Drei** - Helper components for Three.js in React
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library for UI components
- **React Icons** - Additional icon sets
- **React Colorful** - Color picker component
- **html2canvas** - Screenshot/canvas conversion utility
- **React Testing Library** - Unit and integration testing framework

### **Backend (Server)**
- **Node.js & Express.js v5** - JavaScript runtime and web framework
- **MongoDB & Mongoose v9** - NoSQL database and ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing and security
- **CORS & Cookie Parser** - Cross-origin requests and session handling
- **Dotenv** - Environment variable management
- **Nodemon** - Development server auto-reload

### **Database**
- **MongoDB Atlas** - Cloud-hosted MongoDB (NoSQL)
- **Collections**: Users, Designs, Furniture Items, Clients

### **Development Tools**
- **npm** - Package manager
- **Git** - Version control
- **VS Code** - Recommended IDE

---

## ✨ Features

### **Customer Features**
- 🔐 User authentication (Register/Login)
- 📐 Browse furniture library with filters by category
- 💡 View inspiration gallery
- 🎨 Create and manage design projects
- 👁️ Interactive 2D/3D room visualization
- 📦 Add furniture to designs
- ⭐ Save favorite layouts
- ⚙️ Personal dashboard & settings

### **Designer Features**
- 🔐 Designer account management
- 📚 Full furniture library with dimensions/ratings
- 💼 Portfolio management
- 🎯 Client project management
- 📋 Design history and analytics
- 🏆 Performance tracking
- ⚙️ Professional settings

### **Common Features**
- 🌐 Landing page with company info
- 📞 Contact & support system
- 📖 Privacy policy & terms of service
- 🔒 Secure JWT-based authentication
- 📱 Responsive design across devices

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

1. **Node.js & npm**
   - Download from https://nodejs.org/ (LTS version recommended)
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB Atlas Account**
   - Create free account at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get your connection URI
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

3. **Git** (Optional but recommended)
   - Download from https://git-scm.com/

4. **Text Editor/IDE**
   - VS Code recommended (https://code.visualstudio.com/)

---

## 📁 Project Structure

```
Roomio/
├── client/                          # React frontend application
│   ├── public/                      # Static assets
│   │   └── index.html
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── DesignerSidebar.jsx
│   │   │   ├── CustomerSidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── [other components]
│   │   ├── pages/                   # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── customer/            # Customer-specific pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Library.jsx
│   │   │   │   ├── MyDesigns.jsx
│   │   │   │   ├── Inspiration.jsx
│   │   │   │   └── Settings.jsx
│   │   │   ├── designer/            # Designer-specific pages
│   │   │   │   ├── dashboard.jsx
│   │   │   │   ├── library.jsx
│   │   │   │   ├── portfolio.jsx
│   │   │   │   ├── inspiration.jsx
│   │   │   │   └── settings.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   └── [other pages]
│   │   ├── context/                 # React Context API
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── WizardContext.jsx    # Form/wizard state
│   │   ├── services/                # API service modules
│   │   │   ├── API/
│   │   │   ├── furnitureAPI.js
│   │   │   └── [other services]
│   │   ├── styles/                  # CSS stylesheets
│   │   ├── assets/                  # Images and static files
│   │   ├── App.js                   # Root component with routing
│   │   └── index.js                 # Entry point
│   ├── package.json                 # Frontend dependencies
│   └── tailwind.config.js            # Tailwind CSS configuration
│
├── server/                          # Express.js backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Route handlers/business logic
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js                  # User model
│   │   ├── Design.js                # Design projects
│   │   ├── FurnitureItem.js         # Furniture catalog
│   │   └── Client.js                # Client/customer info
│   ├── routes/                      # API routes
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── designs.js               # Design CRUD endpoints
│   │   ├── furnitureRoutes.js       # Furniture catalog endpoints
│   │   └── clientRoutes.js          # Client management endpoints
│   ├── server.js                    # Main server file
│   ├── seedFurniture.js             # Database seeding script
│   ├── package.json                 # Backend dependencies
│   └── .env                         # Environment variables (create this)
│
├── README.md                        # This file
└── .gitignore                       # Git ignore rules

```

---

## 🚀 Installation & Setup

### **Step 1: Clone the Repository**

```bash
git clone <repository-url>
cd Roomio
```

### **Step 2: Setup MongoDB Atlas**

1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Create a database user with a strong password
4. Click "Connect" → "Drivers" to get your connection string
5. Copy the connection URI: `mongodb+srv://user:password@cluster.mongodb.net/roomio`

### **Step 3: Setup Backend Server**

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file in server directory with:
PORT=5000
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/roomio?retryWrites=true&w=majority&appName=Roomio
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# Save the .env file
```

**Important**: Replace `your-username`, `your-password`, and `your-cluster` in MONGO_URI with your actual MongoDB Atlas credentials.

### **Step 4: Setup Frontend Client**

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Note: Ensure the server is running on http://localhost:5000
# The client will automatically configure axios to use this API
```

## ▶️ Running the Project

### **Start in Development Mode**

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Start Frontend Client:**
```bash
cd client
npm start
```
Client runs on `http://localhost:3000` (opens automatically in browser)

### **Start in Production Mode**

```bash
# Backend
cd server
npm start

# Frontend (in another terminal)
cd client
npm run build
npm start
```

---

## 🔑 Environment Variables

### **Server (.env file in /server directory)**

```env
PORT=5000                                    # Server port
MONGO_URI=mongodb+srv://...                  # MongoDB Atlas connection string
JWT_SECRET=your-secret-key                  # JWT signing secret (use strong random string)
NODE_ENV=development                        # Environment: development or production
```

### **Client Environment (Hardcoded in axios)**

The client is configured to connect to `http://localhost:5000/api/` by default. If you need to change this, update the API service files.

---

## 📡 API Endpoints

### **Authentication Endpoints** (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user info

### **Furniture Endpoints** (`/api/furniture`)
- `GET /` - Get all furniture items
- `GET /:id` - Get specific furniture item
- `POST /` - Create furniture item (admin only)
- `PUT /:id` - Update furniture item (admin only)
- `DELETE /:id` - Delete furniture item (admin only)

### **Design Endpoints** (`/api/designs`)
- `GET /` - Get user's designs
- `GET /:id` - Get specific design
- `POST /` - Create new design
- `PUT /:id` - Update design
- `DELETE /:id` - Delete design

### **Client Endpoints** (`/api/clients`)
- `GET /` - Get clients (designer only)
- `POST /` - Create client
- `GET /:id` - Get client details
- `PUT /:id` - Update client info

---

## 🔐 Authentication Flow

1. **User Registration**: Creates new account with hashed password via bcryptjs
2. **User Login**: Verifies credentials and issues JWT token
3. **Token Storage**: JWT stored in HTTP-only cookie for security
4. **Protected Routes**: Frontend checks token validity before accessing protected pages
5. **Backend Verification**: Each API request validates JWT on server
6. **Role-based Access**: Different dashboards for "customer" and "designer" roles

---

## 🐛 Troubleshooting

### **Port Already in Use**
```bash
# Kill process using port 5000 or 3000
# On Windows (PowerShell as Admin):
Get-Process node | Stop-Process -Force

# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### **MongoDB Connection Error**
- Verify MongoDB Atlas connection URI is correct in `.env`
- Check username/password for special characters (may need URL encoding)
- Ensure IP address is whitelisted in MongoDB Atlas security settings
- Try pinging MongoDB: `npm install -g mongodb-cli` then test connection

### **npm install Fails**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **React Port Already in Use**
```bash
# Windows (PowerShell as Admin):
$proc = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($proc) { Stop-Process -Id $proc.OwningProcess -Force }

# Then start again:
npm start
```

### **Images Not Loading**
- Verify furniture items have valid `image` URLs in MongoDB
- Check browser console (F12) for 404 errors on image requests
- Ensure image URLs are from external sources (Unsplash, etc.) or stored on server

### **CORS Errors**
- Verify frontend is running on `http://localhost:3000`
- Check server `CORS` configuration includes correct origin
- Ensure cookies are enabled in browser

### **Cannot Login**
- Clear browser cookies and localStorage
- Check backend console for error messages
- Verify user exists in MongoDB (`db.users.find()`)
- Try creating a new account

---

## 📚 Additional Resources

- **React Documentation**: https://react.dev
- **Express.js Guide**: https://expressjs.com
- **MongoDB Documentation**: https://docs.mongodb.com
- **Mongoose Guide**: https://mongoosejs.com
- **Tailwind CSS**: https://tailwindcss.com
- **Three.js**: https://threejs.org

---

## 👥 Team & Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review error messages in browser console (F12)
3. Check server terminal for backend errors
4. Verify all environment variables are correctly set

---

## 📝 Notes

- This project uses **React 19** with modern hooks
- Database seeding is optional but recommended for testing
- Always use strong JWT_SECRET in production
- Never commit `.env` file to version control
- Use `npm run dev` during development for auto-reload with Nodemon

---

**Last Updated**: March 2026
**Project Status**: In Development
