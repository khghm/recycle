import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Users, ShoppingBag, TreePine, Recycle, Truck, Gift, Leaf, TrendingUp, Zap, Shield } from 'lucide-react';

export default function Home() {
  const { currentUser, products } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 mesh-bg noise"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
          
          {/* Floating Icons */}
          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 right-[15%] text-6xl opacity-20"
          >♻️</motion.div>
          <motion.div
            animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-32 left-[20%] text-5xl opacity-20"
          >🌿</motion.div>
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-[8%] text-4xl opacity-20"
          >🌍</motion.div>
          <motion.div
            animate={{ y: [10, -25, 10] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 right-[8%] text-4xl opacity-20"
          >🌱</motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">پلتفرم هوشمند بازیافت و کسب امتیاز</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
          >
            زباله‌هایت را به
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-l from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                گنج
              </span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-2 left-0 h-1 bg-yellow-400 rounded-full"
              />
            </span>
            {' '}تبدیل کن
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            با تحویل زباله‌های قابل بازیافت، امتیاز کسب کن و از فروشگاه ما محصولات متنوع خریداری کن
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {!currentUser ? (
              <>
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-black/20 hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 btn-shine"
                >
                  <span>شروع رایگان</span>
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>مشاهده فروشگاه</span>
                </Link>
              </>
            ) : (
              <Link
                to="/user"
                className="group inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>ورود به داشبورد</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: Recycle, value: '+۱۲۰۰', label: 'کیلو بازیافت' },
              { icon: Users, value: '+۳۵۰', label: 'کاربر فعال' },
              { icon: ShoppingBag, value: products.length.toString(), label: 'محصول' },
              { icon: TreePine, value: '+۸۵', label: 'درخت کاشته' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center hover:bg-white/15 transition-all duration-300">
                <stat.icon className="w-5 h-5 text-emerald-300 mx-auto mb-2" />
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-gradient-to-b from-green-50 to-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Zap className="w-4 h-4" />
              ساده و سریع
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              چگونه کار می‌کند؟
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">در سه قدم ساده، زباله‌هایتان را به امتیاز تبدیل کنید</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-l from-emerald-200 via-emerald-400 to-emerald-200"></div>

            {[
              {
                icon: Recycle,
                step: '۰۱',
                title: 'جمع‌آوری زباله',
                desc: 'زباله‌های قابل بازیافت خود را تفکیک کنید و آماده تحویل نگه دارید',
                color: 'from-emerald-500 to-green-600'
              },
              {
                icon: Truck,
                step: '۰۲',
                title: 'تحویل به کارمند',
                desc: 'در روزهای تعیین شده، کارمند ما زباله‌ها را حضوری از شما دریافت می‌کند',
                color: 'from-green-500 to-teal-600'
              },
              {
                icon: Gift,
                step: '۰۳',
                title: 'دریافت امتیاز و خرید',
                desc: 'امتیاز کسب کنید و از فروشگاه محصولات متنوع خریداری کنید',
                color: 'from-teal-500 to-emerald-600'
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                className="relative"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-emerald-500/5 border border-emerald-100/50 card-hover relative z-10">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 mx-auto`}>
                    <step.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="absolute top-6 left-6 text-6xl font-black text-emerald-50">{step.step}</div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-500 text-center leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <ShoppingBag className="w-4 h-4" />
              فروشگاه ما
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              محصولات <span className="gradient-text">ویژه</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">با امتیازهای خود از بین محصولات متنوع انتخاب کنید</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {products.slice(0, 8).map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariant}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-100 border border-gray-100 card-hover"
              >
                <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-300 block text-center">{product.image}</span>
                </div>
                <div className="p-5">
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-lg font-bold mb-2">{product.category}</span>
                  <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="gradient-text-gold font-black">{product.points}</span>
                    <span className="text-xs text-gray-400">امتیاز</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 bg-gradient-to-l from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 btn-shine"
            >
              مشاهده همه محصولات
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Waste Types */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Leaf className="w-4 h-4" />
              انواع زباله
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              هر زباله‌ای <span className="gradient-text">ارزشمند</span> است
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">هر نوع زباله قابل بازیافت امتیاز مخصوص خود را دارد</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {[
              { icon: '🥤', name: 'پلاستیک', points: '۴۰', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200' },
              { icon: '📰', name: 'کاغذ', points: '۵۰', bg: 'from-amber-50 to-amber-100', border: 'border-amber-200' },
              { icon: '🍾', name: 'شیشه', points: '۵۰', bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200' },
              { icon: '🥫', name: 'فلزات', points: '۶۰', bg: 'from-gray-50 to-gray-100', border: 'border-gray-200' },
              { icon: '👕', name: 'پارچه', points: '۳۰', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200' },
              { icon: '🔋', name: 'الکترونیک', points: '۱۰۰', bg: 'from-red-50 to-red-100', border: 'border-red-200' },
            ].map((wasteItem, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                className={`bg-gradient-to-br ${wasteItem.bg} border ${wasteItem.border} rounded-2xl p-5 text-center card-hover`}
              >
                <div className="text-4xl mb-3">{wasteItem.icon}</div>
                <div className="font-bold text-gray-800 text-sm">{wasteItem.name}</div>
                <div className="gradient-text font-black text-lg mt-1">{wasteItem.points}</div>
                <div className="text-[10px] text-gray-500">امتیاز/کیلو</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Shield className="w-4 h-4" />
              چرا ما؟
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              مزایای <span className="gradient-text">سبز بازیافت</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: TrendingUp, title: 'کسب امتیاز واقعی', desc: 'با هر کیلو زباله تحویلی، امتیاز واقعی کسب کنید', color: 'from-emerald-500 to-green-600' },
              { icon: ShoppingBag, title: 'محصولات متنوع', desc: 'از اسکیت و عینک تا صندلی و میز، همه در فروشگاه', color: 'from-green-500 to-teal-600' },
              { icon: Truck, title: 'جمع‌آوری رایگان', desc: 'کارمندان ما زباله‌ها را حضوری از شما دریافت می‌کنند', color: 'from-teal-500 to-emerald-600' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                className="group bg-white rounded-3xl p-8 shadow-xl shadow-gray-100 border border-gray-100 card-hover relative overflow-hidden"
              >
                <div className={`absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br ${feature.color} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg noise"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-6">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span className="text-sm">به زمین کمک کن، هدیه بگیر</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              همین الان شروع کن! 🌱
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
              با عضویت در سبز بازیافت، هم به محیط زیست کمک کنید و هم هدایا دریافت کنید
            </p>
            {!currentUser && (
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-white text-emerald-700 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all duration-300 btn-shine"
              >
                ثبت‌نام رایگان
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-black text-xl">سبز بازیافت</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                پلتفرم هوشمند بازیافت و کسب امتیاز. با ما محیط زیست را سبزتر کنید و در عوض هدایای ارزشمند دریافت کنید.
              </p>
              <div className="flex gap-3 mt-6">
                {['instagram', 'twitter', 'telegram'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-all duration-300">
                    <i className={`fab fa-${social} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">دسترسی سریع</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-emerald-400 transition">صفحه اصلی</Link></li>
                <li><Link to="/shop" className="hover:text-emerald-400 transition">فروشگاه</Link></li>
                <li><Link to="/how-it-works" className="hover:text-emerald-400 transition">نحوه کار</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">تماس با ما</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><i className="fas fa-phone text-emerald-500"></i>۰۲۱-۱۲۳۴۵۶۷۸</li>
                <li className="flex items-center gap-2"><i className="fas fa-envelope text-emerald-500"></i>info@greenrecycle.ir</li>
                <li className="flex items-center gap-2"><i className="fas fa-map-marker-alt text-emerald-500"></i>تهران، ولیعصر</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© ۱۴۰۳ سبز بازیافت. تمامی حقوق محفوظ است.</p>
            <p className="text-xs text-gray-500">ساخته شده با ❤️ برای محیط زیست</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
