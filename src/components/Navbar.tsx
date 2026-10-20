import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, LayoutDashboard, LogOut, ShoppingBag, Coins, ChevronDown, Bell } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout, cart, notifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadNotifications = currentUser ? notifications.filter((n) => n.userId === currentUser.id && !n.read).length : 0;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

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

  const navLinks = [
    { to: '/', label: 'خانه' },
    { to: '/shop', label: 'فروشگاه' },
    { to: '/how-it-works', label: 'نحوه کار' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-lg shadow-emerald-500/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-110">
                  <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black gradient-text">سبز بازیافت</span>
                <p className="text-[10px] text-gray-500 -mt-1">پلتفرم هوشمند بازیافت</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-emerald-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <>
                  {/* Cart Icon */}
                  <Link
                    to="/shop"
                    className="relative p-2.5 rounded-xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>

                  {/* Notifications Icon */}
                  <Link
                    to={getDashboardLink()}
                    className="relative p-2.5 rounded-xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>

                  <div className="flex items-center gap-2 bg-gradient-to-l from-amber-50 to-yellow-50 border border-amber-200/50 px-4 py-2 rounded-2xl">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="font-black text-amber-700 text-sm">{currentUser.points.toLocaleString('fa-IR')}</span>
                    <span className="text-[10px] text-amber-600">امتیاز</span>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center gap-2 bg-gradient-to-l from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 btn-shine"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    داشبورد
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-2xl text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
                  >
                    ورود
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 bg-gradient-to-l from-emerald-500 to-green-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 btn-shine"
                  >
                    ثبت‌نام رایگان
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-emerald-50 transition"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 lg:hidden"
          >
            <div className="glass mx-4 rounded-3xl shadow-2xl shadow-emerald-500/10 p-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-2xl font-medium transition ${
                    location.pathname === link.to
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 rounded-2xl">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className="font-black text-amber-700">{currentUser.points}</span>
                      <span className="text-xs text-amber-600">امتیاز</span>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-3 bg-gradient-to-l from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-center"
                    >
                      داشبورد
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-medium transition text-right"
                    >
                      خروج از حساب
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-emerald-700 font-bold text-center"
                    >
                      ورود
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 bg-gradient-to-l from-emerald-500 to-green-600 text-white rounded-2xl font-bold text-center"
                    >
                      ثبت‌نام رایگان
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-20"></div>
    </>
  );
}
