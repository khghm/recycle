import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const { register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }
    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    const success = register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'user',
      phone: formData.phone,
      address: formData.address,
    });

    if (success) {
      navigate('/login');
    } else {
      setError('این ایمیل قبلاً ثبت شده است');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">♻️</span>
          <h1 className="text-3xl font-black text-gray-800 mt-4">ثبت‌نام</h1>
          <p className="text-gray-600 mt-2">به خانواده سبز بازیافت بپیوندید</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <i className="fas fa-exclamation-circle ml-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">نام و نام خانوادگی</label>
              <div className="relative">
                <i className="fas fa-user absolute right-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  placeholder="نام خود را وارد کنید"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">ایمیل</label>
              <div className="relative">
                <i className="fas fa-envelope absolute right-3 top-3 text-gray-400"></i>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">شماره تلفن</label>
              <div className="relative">
                <i className="fas fa-phone absolute right-3 top-3 text-gray-400"></i>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  placeholder="09123456789"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">آدرس</label>
              <div className="relative">
                <i className="fas fa-map-marker-alt absolute right-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  placeholder="آدرس محل سکونت"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">رمز عبور</label>
              <div className="relative">
                <i className="fas fa-lock absolute right-3 top-3 text-gray-400"></i>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  placeholder="حداقل ۶ کاراکتر"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">تکرار رمز عبور</label>
              <div className="relative">
                <i className="fas fa-lock absolute right-3 top-3 text-gray-400"></i>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition"
                  placeholder="تکرار رمز عبور"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg mt-2"
            >
              <i className="fas fa-user-plus ml-2"></i>
              ثبت‌نام
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-green-600 font-bold hover:underline">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
