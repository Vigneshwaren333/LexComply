import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, UserCircle, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount and when it changes
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowDropdown(false);
    navigate('/auth');
  };

  return (
    <nav className="bg-gradient-to-r from-[#0D1B2A] to-[#1B263B] p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        {/* Logo Section */}
        <div
            className="text-white font-bold text-2xl cursor-pointer flex items-center gap-2 hover:text-yellow-400 transition duration-300"
            onClick={() => navigate("/")}
            >
              <img 
                src="/images/LexComply_Logo.jpg" 
                alt="Lex Comply Logo" 
                className="w-8 h-8" 
              />
              <span>Lex comply</span>
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-6">
          {[
            { name: "Home", path: "/" },
            { name: "RTI Services", path: "/services/rti" },
            { name: "Cyber Law", path: "/services/cyber-law" },
            { name: "Compliance", path: "/services/compliance" },
          ].map((item, index) => (
            <button
              key={index}
              className="text-white text-lg font-medium px-3 py-1 rounded-lg transition duration-300 
              hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400"
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </button>
          ))}

          {/* Conditional Auth Button */}
          {!isAuthenticated ? (
            <button
              className="text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 
              hover:bg-yellow-600 transition duration-300"
              onClick={() => navigate("/auth")}
            >
              <UserCircle className="w-5 h-5" />
              Sign In
            </button>
          ) : (
            <div className="relative">
              <button
                className="text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#2A3C53] transition duration-300"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <UserCircle className="w-6 h-6" />
                <span className="text-lg">{user?.name}</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;