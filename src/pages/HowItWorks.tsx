import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Leaf, UserPlus, Package, Calendar, Scale, Star, ShoppingBag, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const { currentUser } = useApp();

  const steps = [
    { icon: UserPlus, title: 'ثبت‌نام در سایت', desc: 'ابتدا در سایت ثبت‌نام کنید. اطلاعات شخصی خود شامل نام، شماره تلفن و آدرس را وارد کنید. پس از ثبت‌نام، یک داشبورد اختصاصی برای شما ایجاد می‌شود.', color: 'from-blue-500 to-indigo-600' },
    { icon: Package, title: 'تفکیک زباله‌ها', desc: 'زباله‌های قابل بازیافت خود را تفکیک کنید. انواع زباله شامل پلاستیک، کاغذ، شیشه، فلزات، پارچه و لوازم الکترونیکی هر کدام امتیاز متفاوتی دارند.', color: 'from-emerald-500 to-green-600' },
    { icon: Calendar, title: 'اطلاع از روزهای جمع‌آوری', desc: 'ادمین سایت روزهایی را برای جمع‌آوری زباله تعیین می‌کند. کارمندان ما در این روزها به مناطق مختلف مراجعه کرده و زباله‌ها را به صورت حضوری از شما دریافت می‌کنند.', color: 'from-green-500 to-teal-600' },
    { icon: Scale, title: 'تحویل و وزن‌کشی', desc: 'کارمند جمع‌آوری، زباله‌های شما را وزن کرده و بر اساس نوع و وزن، امتیاز مربوطه را محاسبه و در سیستم ثبت می‌کند. این امتیاز بلافاصله به حساب شما اضافه می‌شود.', color: 'from-teal-500 to-cyan-600' },
    { icon: Star, title: 'مشاهده امتیاز', desc: 'پس از ثبت، می‌توانید در داشبورد خود امتیاز کسب شده، سوابق جمع‌آوری و وضعیت حساب خود را مشاهده کنید. امتیاز شما نشان‌دهنده قدرت خریدتان در فروشگاه است.', color: 'from-amber-500 to-orange-600' },
    { icon: ShoppingBag, title: 'خرید از فروشگاه', desc: 'با امتیازهای کسب شده، از فروشگاه سایت محصولات متنوع شامل اسکیت، عینک، صندلی، میز، دوچرخه، هدفون و بسیاری محصولات دیگر را خریداری کنید.', color: 'from-purple-500 to-pink-600' },
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariant = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-600 via-green-600 to-teal-600 pt-16 pb-24">
        <div className="absolute inset-0 noise"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">راهنمای استفاده</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-4"
          >
            چگونه کار می‌کند؟
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70"
          >
            با چند قدم ساده، زباله‌هایتان را به امتیاز تبدیل کنید
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,40 1440,30 L1440,60 L0,60 Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-3xl p-6 md:p-8 shadow-lg shadow-gray-100 border border-gray-100 card-hover"
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0 shadow-lg`}>
                  <step.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-center md:text-right">
                  <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                      {i + 1}
                    </span>
                    <h3 className="text-xl font-black text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Points Table */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Star className="w-4 h-4" />
              جدول امتیاز
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              امتیاز هر نوع <span className="gradient-text">زباله</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { icon: '🧴', name: 'پلاستیک', points: '۴۰', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', svg: <svg viewBox="0 0 64 64" className="w-12 h-12"><path fill="#3b82f6" d="M24 8h16v8h-16zM20 16h24l4 8v28a4 4 0 01-4 4H20a4 4 0 01-4-4V24z"/></svg> },
              { icon: '📄', name: 'کاغذ', points: '۵۰', bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', svg: <svg viewBox="0 0 64 64" className="w-12 h-12"><path fill="#d97706" d="M16 8h24l12 12v36a4 4 0 01-4 4H16a4 4 0 01-4-4V12a4 4 0 014-4z"/><path fill="#fbbf24" d="M40 8v12h12"/></svg> },
              { icon: '🫙', name: 'شیشه', points: '۵۰', bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', svg: <svg viewBox="0 0 64 64" className="w-12 h-12"><path fill="#10b981" d="M24 4h16v8l4 8v32a8 8 0 01-8 8h-8a8 8 0 01-8-8V20l4-8z"/></svg> },
              { icon: '🔩', name: 'فلزات', points: '۶۰', bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', svg: <svg viewBox="0 0 64 64" className="w-12 h-12"><path fill="#6b7280" d="M12 24h40v4a8 8 0 01-8 8H20a8 8 0 01-8-8zM20 36h24v20H20z"/></svg> },
              { icon: '👔', name: 'پارچه', points: '۳۰', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', svg: <svg viewBox="0 0 64 64" className="w-12 h-12"><path fill="#8b5cf6" d="M20 8l-8 12 8 8v28h24V28l8-8-8-12-8 4h-16z"/></svg> },
              { icon: '🔌', name: 'الکترونیک', points: '۱۰۰', bg: 'from-red-50 to-red-100', border: 'border-red-200', svg: <svg viewBox="0 0 64 64" className="w-12 h-12"><rect fill="#ef4444" x="12" y="16" width="40" height="28" rx="4"/><path fill="#fca5a5" d="M24 44h16v8H24z"/><circle fill="#fca5a5" cx="32" cy="30" r="6"/></svg> },
            ].map((wasteItem, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                className={`bg-gradient-to-br ${wasteItem.bg} border ${wasteItem.border} rounded-2xl p-6 text-center card-hover`}
              >
                <div className="mb-3 flex justify-center">{wasteItem.svg}</div>
                <h4 className="font-bold text-gray-800">{wasteItem.name}</h4>
                <p className="gradient-text font-black text-2xl mt-2">{wasteItem.points}</p>
                <p className="text-xs text-gray-500">امتیاز به ازای هر کیلو</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg noise"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">آماده شروع هستید؟</h2>
            <p className="text-xl text-white/70 mb-10">همین الان ثبت‌نام کنید و اولین امتیازهایتان را کسب کنید</p>
            {!currentUser ? (
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-white text-emerald-700 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all duration-300 btn-shine"
              >
                ثبت‌نام رایگان
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/user"
                className="group inline-flex items-center gap-2 bg-white text-emerald-700 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all duration-300 btn-shine"
              >
                ورود به داشبورد
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
