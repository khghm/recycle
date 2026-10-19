import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

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
    <div className="min-h-screen bg-gradient-to-bl from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">♻️</span>
          <h1 className="text-3xl font-black text-gray-800 mt-4">ورود به حساب</h1>
          <p className="text-gray-600 mt-2">خوش آمدید! لطفاً وارد حساب کاربری خود شوید</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <i className="fas fa-exclamation-circle ml-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">ایمیل</label>
              <div className="relative">
                <i className="fas fa-envelope absolute right-3 top-3 text-gray-400"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">رمز عبور</label>
              <div className="relative">
                <i className="fas fa-lock absolute right-3 top-3 text-gray-400"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              <i className="fas fa-sign-in-alt ml-2"></i>
              ورود
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              حساب ندارید؟{' '}
              <Link to="/register" className="text-green-600 font-bold hover:underline">
                ثبت‌نام کنید
              </Link>
            </p>
          </div>

          <div className="mt-6 border-t pt-6">
            <p className="text-xs text-gray-500 text-center mb-3">اطلاعات ورود آزمایشی:</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="font-bold text-green-700">ادمین:</span> admin@greenrecycle.ir / admin123
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="font-bold text-green-700">کارمند:</span> employee@greenrecycle.ir / emp123
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="font-bold text-green-700">کاربر:</span> user@test.com / user123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
