import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Leaf, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      const user = JSON.parse(localStorage.getItem('gr_currentUser') || '{}');
      switch (user.role) {
        case 'admin': navigate('/admin'); break;
        case 'employee': navigate('/employee'); break;
        default: navigate('/user'); break;
      }
    } else {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl shadow-emerald-500/30 mb-4"
          >
            <Leaf className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900">خوش آمدید</h1>
          <p className="text-gray-500 mt-2">وارد حساب کاربری خود شوید</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-500/5 border border-white/50 p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">ایمیل</label>
              <div className="relative group">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 input-focus"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">رمز عبور</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 input-focus"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-l from-emerald-500 to-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 btn-shine flex items-center justify-center gap-2"
            >
              <span>ورود به حساب</span>
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              حساب ندارید؟{' '}
              <Link to="/register" className="text-emerald-600 font-bold hover:underline">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3 font-bold">اطلاعات ورود آزمایشی:</p>
            <div className="space-y-2">
              {[
                { role: 'ادمین', email: 'admin@greenrecycle.ir', pass: 'admin123', color: 'bg-purple-50 border-purple-100 text-purple-700' },
                { role: 'کارمند', email: 'employee@greenrecycle.ir', pass: 'emp123', color: 'bg-blue-50 border-blue-100 text-blue-700' },
                { role: 'کاربر', email: 'user@test.com', pass: 'user123', color: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
              ].map((cred) => (
                <div key={cred.role} className={`${cred.color} border rounded-xl p-2.5 text-xs flex items-center justify-between`}>
                  <span className="font-black">{cred.role}</span>
                  <span className="opacity-70">{cred.email} / {cred.pass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
