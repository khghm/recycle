import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, LayoutDashboard, LogOut, ShoppingBag, Coins, ChevronDown, Bell } from 'lucide-react';

import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';

export default function Navbar() {
  const { currentUser, logout, cart, notifications, setShowCartModal } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { showToast } = useToast();

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
    showToast('با موفقیت خارج شدید', 'success');
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
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-110">
                  <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black gradient-text">سبز بازیافت</span>
                <p className="text-xs text-neutral-500 -mt-1">پلتفرم هوشمند بازیافت</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-neutral-600 hover:text-primary-700 hover:bg-primary-50/50'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full"
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
                  <button
                    onClick={() => setShowCartModal(true)}
                    className="relative p-2.5 rounded-xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>

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

                  <div className="flex items-center gap-2 bg-warning/10 border border-warning/30 px-4 py-2 rounded-2xl">
                    <Coins className="w-4 h-4 text-warning" />
                    <span className="font-black text-warning text-sm">{currentUser.points.toLocaleString('fa-IR')}</span>
                    <span className="text-xs text-warning">امتیاز</span>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    داشبورد
                  </Link>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-primary-700 hover:bg-primary-50 transition-all duration-300"
                  >
                    ورود
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    ثبت‌نام رایگان
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              {currentUser && (
                <>
                  <button
                    onClick={() => setShowCartModal(true)}
                    className="relative p-2 rounded-xl text-gray-600 hover:bg-emerald-50 transition"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                  <Link
                    to={getDashboardLink()}
                    className="relative p-2 rounded-xl text-gray-600 hover:bg-emerald-50 transition"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>
                </>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl text-gray-600 hover:bg-emerald-50 transition"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
            <div className="glass mx-4 rounded-3xl shadow-2xl shadow-primary-500/10 p-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl font-medium transition-base ${
                    location.pathname === link.to
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-3 bg-warning/10 rounded-xl">
                      <Coins className="w-4 h-4 text-warning" />
                      <span className="font-black text-warning">{currentUser.points}</span>
                      <span className="text-xs text-warning">امتیاز</span>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="btn-primary block text-center"
                    >
                      داشبورد
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-error hover:bg-error/10 rounded-xl font-medium transition-base text-right"
                    >
                      خروج از حساب
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-primary-700 font-bold text-center"
                    >
                      ورود
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary block text-center"
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

      {/* Logout Confirmation */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="خروج از حساب"
        message="آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟"
        confirmText="خروج"
        cancelText="انصراف"
        type="warning"
      />

      {/* Spacer */}
      <div className="h-20"></div>
    </>
  );
}
