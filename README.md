# AQI Admin Console - Backend API

A Node.js + Express backend API for managing AQI (Air Quality Index) devices and users with role-based access control.

## Features

- **MongoDB** database with Mongoose ODM
- **JWT Authentication** with bcrypt password hashing
- **Role-based access control**: ADMIN and CLIENT roles
- **User Management**: Only ADMIN can create CLIENT accounts
- **Device Management**: ADMIN can create and assign devices to clients
- **Clean MVC Architecture**

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas connection string)
- npm or yarn

## Installation

1. **Clone the repository and navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file and update the following:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong random string for JWT token signing
   - `PORT`: Server port (default: 5000)

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication

- **POST** `/api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`

### Users (Requires Authentication)

- **GET** `/api/users/me` - Get current user profile (Admin/Client)
- **POST** `/api/users` - Create a new CLIENT user (Admin only)
  - Body: `{ "username": "client1", "email": "client@example.com", "password": "password123" }`
- **GET** `/api/users/clients` - Get all clients (Admin only)

### Devices (Requires Authentication)

- **GET** `/api/devices` - Get devices (All for Admin, Own for Client)
- **GET** `/api/devices/:id` - Get device by ID
- **POST** `/api/devices` - Create a new device (Admin only)
  - Body: `{ "deviceId": "ABC123XYZ789DEF456GHI012JKL", "name": "Device 1", "assignedTo": "user_id" }`
- **PUT** `/api/devices/:id` - Update device (Admin only)
- **DELETE** `/api/devices/:id` - Delete device (Admin only)

## Project Structure

```
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management logic
│   └── deviceController.js  # Device management logic
├── middleware/
│   └── auth.js              # JWT authentication & authorization middleware
├── models/
│   ├── User.js              # User model schema
│   └── Device.js            # Device model schema
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User routes
│   └── deviceRoutes.js      # Device routes
├── utils/
│   └── generateToken.js     # JWT token generation utility
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js                # Application entry point
```

## User Roles

### ADMIN
- Can create CLIENT accounts
- Can view all devices
- Can create, update, and delete devices
- Can assign devices to clients

### CLIENT
- Cannot sign up (must be created by ADMIN)
- Can view only devices assigned to them
- Cannot create, update, or delete devices

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Creating the First Admin User

You'll need to manually create an ADMIN user in MongoDB or use MongoDB Compass/Studio 3T:

```javascript
// In MongoDB shell or Compass
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$...", // Hashed password (use bcrypt to generate)
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Alternatively, you can create a script to seed the database with an admin user.

## Device ID Format

Device IDs must be:
- Exactly 30 characters
- Alphanumeric only (a-z, A-Z, 0-9)
- Example: `ABC123XYZ789DEF456GHI012JKL`

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## License

ISC