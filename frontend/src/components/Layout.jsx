import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from "react";


const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600 dark:text-primary-300">
                  AQI Admin Console
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {isAdmin ? (
                  <>
                    <Link 
                      to="/admins"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/admins'
                          ? 'border-primary-500 text-gray-900 dark:text-gray-100'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Admins
                    </Link>
                    <Link
                      to="/admin/clients"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/admin/clients'
                          ? 'border-primary-500 text-gray-900 dark:text-gray-100'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Clients
                    </Link>
                    <Link
                      to="/admin/devices"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        location.pathname === '/admin/devices'
                          ? 'border-primary-500 text-gray-900 dark:text-gray-100'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Devices
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/client/devices"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/client/devices'
                        ? 'border-primary-500 text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    My Devices
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center">
              
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {user.username}
                </span>

                {user.role === "ADMIN" && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold 
                    bg-blue-100 text-blue-700">
                    ADMIN
                  </span>
                )}

                {user.role === "CLIENT" && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold 
                    bg-green-100 text-green-700">
                    CLIENT
                  </span>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center text-xs sm:text-sm px-2 sm:px-3 py-1 border border-transparent font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Logout
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md
                    bg-gray-200 dark:bg-gray-700
                    text-gray-800 dark:text-gray-200"
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>


              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;