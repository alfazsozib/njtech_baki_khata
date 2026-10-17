import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#01021df1] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          <span className="text-xl font-bold tracking-tight text-white font-['Poppins']">
            Baki <span className="text-[#3b2beb]">Khata</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="rounded-lg bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[#2914e7] px-4 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#0b0355] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;
