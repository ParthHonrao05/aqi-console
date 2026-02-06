# AQI Admin Console - Setup & Run Guide

This guide will walk you through setting up and running both the backend and frontend of the AQI Admin Console.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one of the following:
   - **Local MongoDB**: [Download here](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud): [Sign up here](https://www.mongodb.com/cloud/atlas) (Free tier available)
3. **npm** (comes with Node.js) or **yarn**

## Quick Start

### Step 1: Backend Setup

1. **Navigate to the project root directory**
   ```bash
   cd "D:\projects\AQI Admin Console"
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   # Copy the example file
   # On Windows PowerShell:
   Copy-Item .env.example .env
   
   # Or on Linux/Mac:
   # cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   # MongoDB Connection
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/aqi-admin-console
   
   # For MongoDB Atlas (cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aqi-admin-console
   
   # JWT Secret (change this to a random string in production!)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Server Port
   PORT=5000
   ```

4. **Start MongoDB** (if using local MongoDB)
   
   **Windows:**
   ```bash
   # If MongoDB is installed as a service, it should start automatically
   # Otherwise, navigate to MongoDB installation directory and run:
   mongod
   ```
   
   **Linux/Mac:**
   ```bash
   sudo systemctl start mongod
   # Or
   mongod --dbpath /path/to/your/data/directory
   ```

5. **Seed the default admin user**
   ```bash
   npm run seed:admin
   ```
   
   This will create an admin user with:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
   
   ⚠️ **Important**: Change this password after first login!

6. **Start the backend server**
   
   **Development mode** (with auto-reload):
   ```bash
   npm run dev
   ```
   
   **Production mode**:
   ```bash
   npm start
   ```

   The backend API will be running on `http://localhost:5000`

   You should see:
   ```
   MongoDB Connected: ...
   Server is running on port 5000
   ```

### Step 2: Frontend Setup

1. **Open a new terminal window** (keep the backend running in the first terminal)

2. **Navigate to the frontend directory**
   ```bash
   cd "D:\projects\AQI Admin Console\frontend"
   ```

3. **Install frontend dependencies**
   ```bash
   npm install
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:3000`
   
   You should see something like:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

### Step 3: Login

1. You should see the login page
2. Use the default admin credentials:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`

3. After login, you'll be redirected to the Admin Dashboard

## Running Both Services Together

You need **two terminal windows** running simultaneously:

**Terminal 1 - Backend:**
```bash
cd "D:\projects\AQI Admin Console"
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "D:\projects\AQI Admin Console\frontend"
npm run dev
```

## Project Structure

```
AQI Admin Console/
├── config/              # Backend configuration
├── controllers/         # Backend controllers
├── middleware/          # Backend middleware
├── models/              # Database models
├── routes/              # Backend routes
├── scripts/             # Utility scripts
├── utils/               # Backend utilities
├── server.js            # Backend entry point
├── package.json         # Backend dependencies
├── .env                 # Backend environment variables
│
└── frontend/            # Frontend React application
    ├── src/
    │   ├── components/  # React components
    │   ├── context/     # React context
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   └── utils/       # Frontend utilities
    ├── package.json     # Frontend dependencies
    └── vite.config.js   # Vite configuration
```

## API Endpoints

Once the backend is running, you can test the API:

- **Health Check**: `GET http://localhost:5000/health`
- **Login**: `POST http://localhost:5000/api/auth/login`
- **Get Current User**: `GET http://localhost:5000/api/users/me` (requires auth)
- **Get All Clients**: `GET http://localhost:5000/api/users/clients` (admin only)
- **Get All Devices**: `GET http://localhost:5000/api/devices` (requires auth)

## Common Issues & Solutions

### 1. MongoDB Connection Error

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solutions**:
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env` file
- For local MongoDB, verify it's running on port 27017
- For MongoDB Atlas, check your connection string and network access

### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
- Change the `PORT` in `.env` file to a different port (e.g., 5001)
- Or stop the process using port 5000:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - Linux/Mac: `lsof -ti:5000 | xargs kill`

### 3. Frontend Can't Connect to Backend

**Solutions**:
- Make sure the backend is running on port 5000
- Check `frontend/vite.config.js` proxy configuration
- Verify `VITE_API_URL` in frontend `.env` (if you created one)

### 4. Admin User Already Exists

**Error**: When running `npm run seed:admin`

**Solutions**:
- This is normal if admin already exists
- To reset password, use: `npm run seed:admin -- --reset-password`

### 5. Module Not Found Errors

**Solutions**:
- Make sure you've run `npm install` in both root and frontend directories
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check Node.js version: `node --version` (should be v14+)

## Production Build

### Backend
The backend is ready for production. Make sure to:
- Set a strong `JWT_SECRET` in `.env`
- Use a production MongoDB database
- Set `NODE_ENV=production`

### Frontend
Build the frontend for production:

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/` directory.

Serve it with a web server or use:
```bash
npm run preview
```

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload in development mode
2. **API Proxy**: The frontend proxies API requests to `http://localhost:5000` automatically
3. **Token Expiry**: Default token expiry is 7 days (configurable in `.env`)
4. **Logs**: Check terminal output for backend logs and errors

## Next Steps

1. ✅ Backend and Frontend are running
2. ✅ Login with admin credentials
3. ✅ Create client users (Admin Dashboard → Clients)
4. ✅ Create devices and assign them to clients (Admin Dashboard → Devices)
5. ✅ Test client login and view their assigned devices

## Need Help?

- Check the console/terminal for error messages
- Verify all environment variables are set correctly
- Ensure MongoDB is running and accessible
- Check that both backend and frontend are running on different ports

---

**Happy coding! 🚀**