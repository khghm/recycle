import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, ArrowLeft, Leaf, AlertCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', address: '',
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
      name: formData.name, email: formData.email, password: formData.password,
      role: 'user', phone: formData.phone, address: formData.address,
    });
    if (success) navigate('/login');
    else setError('این ایمیل قبلاً ثبت شده است');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fields = [
    { name: 'name', icon: User, label: 'نام و نام خانوادگی', placeholder: 'نام خود را وارد کنید', type: 'text' },
    { name: 'email', icon: Mail, label: 'ایمیل', placeholder: 'example@email.com', type: 'email' },
    { name: 'phone', icon: Phone, label: 'شماره تلفن', placeholder: '09123456789', type: 'tel' },
    { name: 'address', icon: MapPin, label: 'آدرس', placeholder: 'آدرس محل سکونت', type: 'text' },
    { name: 'password', icon: Lock, label: 'رمز عبور', placeholder: 'حداقل ۶ کاراکتر', type: 'password' },
    { name: 'confirmPassword', icon: Lock, label: 'تکرار رمز عبور', placeholder: 'تکرار رمز عبور', type: 'password' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl shadow-emerald-500/30 mb-4"
          >
            <Leaf className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900">ثبت‌نام</h1>
          <p className="text-gray-500 mt-2">به خانواده سبز بازیافت بپیوندید</p>
        </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.name} className={field.name === 'address' ? 'md:col-span-2' : ''}>
                  <label className="block text-gray-700 font-bold mb-1.5 text-xs">{field.label}</label>
                  <div className="relative group">
                    <field.icon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition" />
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full pr-11 pl-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all duration-300 text-sm input-focus"
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-l from-emerald-500 to-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 btn-shine flex items-center justify-center gap-2 mt-6"
            >
              <span>ثبت‌نام</span>
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                وارد شوید
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
