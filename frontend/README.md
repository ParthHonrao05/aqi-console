# AQI Admin Console - Frontend

React + Vite frontend for the AQI Admin Console application.

## Features

- **Admin Dashboard**: Manage clients and devices
- **Client Dashboard**: View assigned devices
- **JWT Authentication**: Secure token-based authentication
- **Role-based Routing**: Automatic redirection based on user role
- **Clean UI**: Built with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- Running backend server (see backend README)

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (optional)
   Create a `.env` file if you need to override the default API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Default Credentials

After seeding the admin user (using the backend script), use:
- **Email**: admin@example.com
- **Password**: admin123

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/          # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── admin/
│   │   │   ├── Clients.jsx
│   │   │   └── Devices.jsx
│   │   └── client/
│   │       └── ClientDevices.jsx
│   ├── services/         # API service layer
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Features by Role

### Admin
- View all clients
- Create new client accounts
- View all devices
- Create new devices
- Assign devices to clients
- Delete devices

### Client
- View only assigned devices
- Cannot create or modify devices
- Cannot view other clients' devices

## Development Notes

- The app uses React Router for navigation
- Authentication state is managed via React Context
- API calls are made through axios with automatic token injection
- Protected routes automatically redirect based on user role
- Tailwind CSS is configured with a custom color palette