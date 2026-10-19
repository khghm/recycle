import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function HowItWorks() {
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <section className="bg-gradient-to-bl from-green-600 to-emerald-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">نحوه کار سایت</h1>
          <p className="text-xl opacity-90">با چند قدم ساده، زباله‌هایتان را به امتیاز تبدیل کنید</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-5xl">📝</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">۱</span>
                  <h3 className="text-2xl font-bold text-gray-800">ثبت‌نام در سایت</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  ابتدا در سایت ثبت‌نام کنید. اطلاعات شخصی خود شامل نام، شماره تلفن و آدرس را وارد کنید. 
                  پس از ثبت‌نام، یک داشبورد اختصاصی برای شما ایجاد می‌شود.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-5xl">📦</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">۲</span>
                  <h3 className="text-2xl font-bold text-gray-800">تفکیک زباله‌ها</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  زباله‌های قابل بازیافت خود را تفکیک کنید. انواع زباله شامل پلاستیک، کاغذ، شیشه، فلزات، پارچه و لوازم الکترونیکی 
                  هر کدام امتیاز متفاوتی دارند.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-5xl">📅</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">۳</span>
                  <h3 className="text-2xl font-bold text-gray-800">اطلاع از روزهای جمع‌آوری</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  ادمین سایت روزهایی را برای جمع‌آوری زباله تعیین می‌کند. کارمندان ما در این روزها به مناطق مختلف مراجعه کرده 
                  و زباله‌ها را به صورت حضوری از شما دریافت می‌کنند.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-5xl">⚖️</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">۴</span>
                  <h3 className="text-2xl font-bold text-gray-800">تحویل و وزن‌کشی</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  کارمند جمع‌آوری، زباله‌های شما را وزن کرده و بر اساس نوع و وزن، امتیاز مربوطه را محاسبه و در سیستم ثبت می‌کند. 
                  این امتیاز بلافاصله به حساب شما اضافه می‌شود.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-5xl">⭐</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">۵</span>
                  <h3 className="text-2xl font-bold text-gray-800">مشاهده امتیاز</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  پس از ثبت، می‌توانید در داشبورد خود امتیاز کسب شده، سوابق جمع‌آوری و وضعیت حساب خود را مشاهده کنید. 
                  امتیاز شما نشان‌دهنده قدرت خریدتان در فروشگاه است.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-5xl">🛍️</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">۶</span>
                  <h3 className="text-2xl font-bold text-gray-800">خرید از فروشگاه</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  با امتیازهای کسب شده، از فروشگاه سایت محصولات متنوع شامل اسکیت، عینک، صندلی، میز، دوچرخه، 
                  هدفون و بسیاری محصولات دیگر را خریداری کنید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Points Table */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-800 text-center mb-8">جدول امتیاز انواع زباله</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🥤', name: 'پلاستیک', points: '۴۰ امتیاز', color: 'bg-blue-50 border-blue-200' },
              { icon: '📰', name: 'کاغذ', points: '۵۰ امتیاز', color: 'bg-yellow-50 border-yellow-200' },
              { icon: '🍾', name: 'شیشه', points: '۵۰ امتیاز', color: 'bg-green-50 border-green-200' },
              { icon: '🥫', name: 'فلزات', points: '۶۰ امتیاز', color: 'bg-gray-50 border-gray-200' },
              { icon: '👕', name: 'پارچه', points: '۳۰ امتیاز', color: 'bg-purple-50 border-purple-200' },
              { icon: '🔋', name: 'الکترونیک', points: '۱۰۰ امتیاز', color: 'bg-red-50 border-red-200' },
            ].map((item, i) => (
              <div key={i} className={`${item.color} border-2 rounded-xl p-5 text-center`}>
                <span className="text-4xl block mb-2">{item.icon}</span>
                <h4 className="font-bold text-gray-800">{item.name}</h4>
                <p className="text-green-600 font-bold mt-1">{item.points}/کیلو</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-l from-green-700 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">آماده شروع هستید؟</h2>
          <p className="text-xl opacity-90 mb-8">همین الان ثبت‌نام کنید و اولین امتیازهایتان را کسب کنید</p>
          {!currentUser ? (
            <Link
              to="/register"
              className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition inline-block shadow-lg"
            >
              ثبت‌نام رایگان
              <i className="fas fa-arrow-left mr-2"></i>
            </Link>
          ) : (
            <Link
              to="/user"
              className="bg-white text-green-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition inline-block shadow-lg"
            >
              ورود به داشبورد
              <i className="fas fa-tachometer-alt mr-2"></i>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
