import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { currentUser, products } = useApp();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-green-600 via-green-500 to-emerald-400 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-9xl">♻️</div>
          <div className="absolute bottom-10 left-10 text-8xl">🌿</div>
          <div className="absolute top-1/2 left-1/3 text-7xl">🌍</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              زباله‌هایتان را بفروشید
              <br />
              <span className="text-yellow-300">امتیاز کسب کنید!</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              با تحویل زباله‌های قابل بازیافت، امتیاز دریافت کنید و محصولات متنوع بخرید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!currentUser ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <i className="fas fa-user-plus ml-2"></i>
                    ثبت‌نام رایگان
                  </Link>
                  <Link
                    to="/shop"
                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition"
                  >
                    <i className="fas fa-store ml-2"></i>
                    مشاهده فروشگاه
                  </Link>
                </>
              ) : (
                <Link
                  to="/user"
                  className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition shadow-lg"
                >
                  <i className="fas fa-tachometer-alt ml-2"></i>
                  ورود به داشبورد
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-2">♻️</div>
              <div className="text-3xl font-black text-green-600">+۱۲۰۰</div>
              <div className="text-gray-600 mt-1">کیلو بازیافت شده</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-3xl font-black text-green-600">+۳۵۰</div>
              <div className="text-gray-600 mt-1">کاربر فعال</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-2">🛍️</div>
              <div className="text-3xl font-black text-green-600">{products.length}</div>
              <div className="text-gray-600 mt-1">محصول در فروشگاه</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-2">🌳</div>
              <div className="text-3xl font-black text-green-600">+۸۵</div>
              <div className="text-gray-600 mt-1">درخت کاشته شده</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              چگونه کار می‌کند؟
            </h2>
            <p className="text-gray-600 text-lg">در سه قدم ساده، زباله‌هایتان را به امتیاز تبدیل کنید</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📦</span>
              </div>
              <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">۱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">جمع‌آوری زباله</h3>
              <p className="text-gray-600">زباله‌های قابل بازیافت خود را تفکیک کنید و آماده تحویل نگه دارید</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚛</span>
              </div>
              <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">۲</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">تحویل به کارمند</h3>
              <p className="text-gray-600">در روزهای تعیین شده، کارمند ما زباله‌ها را حضوری از شما دریافت می‌کند</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎁</span>
              </div>
              <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">۳</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">دریافت امتیاز و خرید</h3>
              <p className="text-gray-600">امتیاز کسب کنید و از فروشگاه محصولات متنوع خریداری کنید</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              محصولات فروشگاه
            </h2>
            <p className="text-gray-600 text-lg">با امتیازهای خود از بین محصولات متنوع انتخاب کنید</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                <div className="text-5xl mb-4">{product.image}</div>
                <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  {product.points} امتیاز
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition inline-block"
            >
              مشاهده همه محصولات
              <i className="fas fa-arrow-left mr-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Waste Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4">
              انواع زباله قابل بازیافت
            </h2>
            <p className="text-gray-600 text-lg">هر نوع زباله امتیاز مخصوص خود را دارد</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '🥤', name: 'پلاستیک', points: '۴۰ امتیاز/کیلو' },
              { icon: '📰', name: 'کاغذ', points: '۵۰ امتیاز/کیلو' },
              { icon: '🍾', name: 'شیشه', points: '۵۰ امتیاز/کیلو' },
              { icon: '🥫', name: 'فلزات', points: '۶۰ امتیاز/کیلو' },
              { icon: '👕', name: 'پارچه', points: '۳۰ امتیاز/کیلو' },
              { icon: '🔋', name: 'الکترونیک', points: '۱۰۰ امتیاز/کیلو' },
            ].map((item, i) => (
              <div key={i} className="bg-white border-2 border-green-100 rounded-xl p-4 text-center hover:border-green-400 transition">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                <div className="text-green-600 text-xs mt-1">{item.points}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-l from-green-700 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            همین الان شروع کنید! 🌱
          </h2>
          <p className="text-xl mb-8 opacity-90">
            با عضویت در سبز بازیافت، هم به محیط زیست کمک کنید و هم هدایا دریافت کنید
          </p>
          {!currentUser && (
            <Link
              to="/register"
              className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition inline-block shadow-lg"
            >
              ثبت‌نام رایگان
              <i className="fas fa-arrow-left mr-2"></i>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">♻️</span>
                <span className="text-white font-bold text-lg">سبز بازیافت</span>
              </div>
              <p className="text-sm">پلتفرم هوشمند بازیافت و کسب امتیاز. با ما محیط زیست را سبزتر کنید.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">دسترسی سریع</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-green-400 transition">صفحه اصلی</Link></li>
                <li><Link to="/shop" className="hover:text-green-400 transition">فروشگاه</Link></li>
                <li><Link to="/how-it-works" className="hover:text-green-400 transition">نحوه کار</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">تماس با ما</h4>
              <ul className="space-y-2 text-sm">
                <li><i className="fas fa-phone ml-2"></i>۰۲۱-۱۲۳۴۵۶۷۸</li>
                <li><i className="fas fa-envelope ml-2"></i>info@greenrecycle.ir</li>
                <li><i className="fas fa-map-marker-alt ml-2"></i>تهران، خیابان ولیعصر</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© ۱۴۰۳ سبز بازیافت. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
