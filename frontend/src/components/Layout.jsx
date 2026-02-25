// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useState, useEffect } from "react";


// const Layout = ({ children }) => {
//   const { user, logout, isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Dark Mode
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem("theme") === "dark";
//   });


//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       {/* Navigation */}
//       <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-wrap items-center justify-between h-16">
//             <div className="flex">
//               <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//                 {isAdmin ? (
//                   <>
//                     <Link 
//                       to="/admin/dashboard"
//                       className="text-xl font-bold text-primary-600 dark:text-primary-300">
//                       AQI Admin Console
//                 </Link>
//                     <Link 
//                       to="/admins"
//                       className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
//                         location.pathname === '/admins'
//                           ? 'border-primary-500 text-gray-900 dark:text-gray-100'
//                           : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
//                       }`}
//                     >
//                       Admins
//                     </Link>
//                     <Link
//                       to="/admin/clients"
//                       className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
//                         location.pathname === '/admin/clients'
//                           ? 'border-primary-500 text-gray-900 dark:text-gray-100'
//                           : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
//                       }`}
//                     >
//                       Clients
//                     </Link>
//                     <Link
//                       to="/admin/devices"
//                       className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
//                         location.pathname === '/admin/devices'
//                           ? 'border-primary-500 text-gray-900 dark:text-gray-100'
//                           : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
//                       }`}
//                     >
//                       Devices
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                   <h1 className="text-xl font-bold text-primary-600 dark:text-primary-300">
//                       AQI Admin Console
//                     </h1>
//                   <Link
//                     to="/client/devices"
//                     className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
//                       location.pathname === '/client/devices'
//                         ? 'border-primary-500 text-gray-900 dark:text-gray-100'
//                         : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
//                     }`}
//                   >
//                     My Devices
//                   </Link>
//                   </> 
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center">
              
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">
//                   {user.role === "ADMIN" ? user.companyName : user.username}
//                 </span>

//                 {user.role === "ADMIN" && (
//                   <span className="px-2 py-1 rounded-full text-xs font-semibold 
//                     bg-blue-100 text-blue-700">
//                     ADMIN
//                   </span>
//                 )}

//                 {user.role === "CLIENT" && (
//                   <span className="px-2 py-1 rounded-full text-xs font-semibold 
//                     bg-green-100 text-green-700">
//                     CLIENT
//                   </span>
//                 )}

//                 <button
//                   onClick={handleLogout}
//                   className="ml-4 inline-flex items-center text-xs sm:text-sm px-2 sm:px-3 py-1 border border-transparent font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
//                   Logout
//                 </button>
//                 <button
//                   onClick={() => setDarkMode(!darkMode)}
//                   className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md
//                     bg-gray-200 dark:bg-gray-700
//                     text-gray-800 dark:text-gray-200"
//                 >
//                   {darkMode ? "Light Mode" : "Dark Mode"}
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default Layout;

// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState, useEffect } from "react";
// import { FiMenu } from "react-icons/fi";

// const Layout = ({ children }) => {
//   const { user, logout, isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [collapsed, setCollapsed] = useState(false);

//   // Dark Mode
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem("theme") === "dark";
//   });

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const sidebarLink = (to, label) => (
//     <Link
//       to={to}
//       className={`block px-4 py-2 rounded-lg text-sm font-medium transition
//         ${
//           location.pathname === to
//             ? "bg-primary-600 text-white"
//             : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//         }`}
//     >
//       {!collapsed && label}
//       {collapsed && label.charAt(0)}
//     </Link>
//   );

//   return (
//     <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

//       {/* Sidebar */}
//       <aside
//         className={`${
//           collapsed ? "w-20" : "w-64"
//         } transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4`}
//       >
//         <div className="flex justify-between items-center mb-6">
//           {!collapsed && (
//             <h2 className="text-lg font-bold text-primary-600 dark:text-primary-300">
//               Menu
//             </h2>
//           )}
//           <FiMenu
//             className="cursor-pointer"
//             onClick={() => setCollapsed(!collapsed)}
//           />
//         </div>

//         <div className="space-y-2">
//           {isAdmin && sidebarLink("/admin/dashboard", "Dashboard")}
//           {isAdmin && sidebarLink("/admins", "View Admins")}
//           {isAdmin && sidebarLink("/admin/clients", "View Clients")}
//           {isAdmin && sidebarLink("/admin/devices", "Manage Devices")}

//           {!isAdmin &&
//             sidebarLink("/client/devices", "My Devices")}

//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="w-full mt-6 px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700"
//           >
//             {!collapsed
//               ? darkMode
//                 ? "Light Mode"
//                 : "Dark Mode"
//               : "T"}
//           </button>
//         </div>
//       </aside>

//       {/* Main Area */}
//       <div className="flex-1 flex flex-col">

//         {/* Top Navbar */}
//         <nav className="h-16 flex justify-between items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          
//           <Link
//             to={isAdmin ? "/admin/dashboard" : "/client/devices"}
//             className="text-xl font-bold text-primary-600 dark:text-primary-300"
//           >
//             AQI Console
//           </Link>

//           <div className="flex items-center gap-3">
//             <span className="font-medium">
//               {user.role === "ADMIN"
//                 ? user.companyName
//                 : user.username}
//             </span>

//             <span
//               className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                 user.role === "ADMIN"
//                   ? "bg-blue-100 text-blue-700"
//                   : "bg-green-100 text-green-700"
//               }`}
//             >
//               {user.role}
//             </span>

//             <button
//               onClick={handleLogout}
//               className="px-3 py-1 text-sm rounded-md text-white bg-primary-600 hover:bg-primary-700"
//             >
//               Logout
//             </button>
//           </div>
//         </nav>

//         {/* Page Content */}
//         <main className="flex-1 p-6">
//           {children}
//         </main>

//       </div>
//     </div>
//   );
// };

// export default Layout;

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiCpu,
  FiUserCheck,
  FiSun,
  FiMoon,
} from "react-icons/fi";

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavItem = ({ to, label, Icon }) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
          ${
            active
              ? "bg-primary-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
      >
        <Icon size={18} />
        {!collapsed && label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col`}
      >
        <div className="flex justify-between items-center mb-6">
           {!collapsed && (
            <h2 className="text-lg font-bold text-primary-600 dark:text-primary-300">
              Menu
            </h2>
          )}
          <FiMenu
            className="cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        {/* Navigation Links */}
        <div className="space-y-2 flex-1">
          {isAdmin && (
            <NavItem
              to="/admin/dashboard"
              label="Dashboard"
              Icon={FiHome}
            />
          )}

          {isAdmin && (
            <NavItem
              to="/admins"
              label="View Admins"
              Icon={FiUserCheck}
            />
          )}

          {isAdmin && (
            <NavItem
              to="/admin/clients"
              label="View Clients"
              Icon={FiUsers}
            />
          )}

          {isAdmin && (
            <NavItem
              to="/admin/devices"
              label="Manage Devices"
              Icon={FiCpu}
            />
          )}

          {!isAdmin && (
            <NavItem
              to="/client/devices"
              label="My Devices"
              Icon={FiCpu}
            />
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-center gap-2 mt-6 px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
          {!collapsed && (darkMode ? "Light Mode" : "Dark Mode")}
        </button>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Navbar (Full Width) */}
        <nav className="h-16 flex justify-between items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          
          <Link
            to={isAdmin ? "/admin/dashboard" : "/client/devices"}
            className="text-xl font-bold text-primary-600 dark:text-primary-300"
          >
            AQI Console
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">
              {user.role === "ADMIN" ? user.companyName : user.username}
            </span>

            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                user.role === "ADMIN"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user.role}
            </span>

            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;