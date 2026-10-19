import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    switch (currentUser.role) {
      case 'admin': return '/admin';
      case 'employee': return '/employee';
      case 'user': return '/user';
      default: return '/login';
    }
  };

  return (
    <nav className="bg-gradient-to-l from-green-700 to-green-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">♻️</span>
            <span className="text-white font-bold text-xl">سبز بازیافت</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white hover:text-green-200 transition font-medium">
              صفحه اصلی
            </Link>
            <Link to="/shop" className="text-white hover:text-green-200 transition font-medium">
              فروشگاه
            </Link>
            <Link to="/how-it-works" className="text-white hover:text-green-200 transition font-medium">
              نحوه کار
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link
                  to={getDashboardLink()}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition font-medium"
                >
                  <i className="fas fa-tachometer-alt ml-2"></i>
                  داشبورد
                </Link>
                <div className="flex items-center gap-2 text-white">
                  <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold">
                    {currentUser.points} امتیاز
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-200 hover:text-red-100 transition"
                >
                  <i className="fas fa-sign-out-alt ml-1"></i>
                  خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white hover:text-green-200 transition font-medium"
                >
                  ورود
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 transition font-bold"
                >
                  ثبت‌نام
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                  {currentUser.points}⭐
                </span>
                <Link to={getDashboardLink()} className="text-white">
                  <i className="fas fa-tachometer-alt text-lg"></i>
                </Link>
                <button onClick={handleLogout} className="text-red-200">
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-white">
                <i className="fas fa-user text-lg"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
