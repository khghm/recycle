import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Recycle, ShoppingBag, User, Store, CalendarCheck, TrendingUp, Award, Coins, ArrowLeft, Check, Clock, Calendar, MapPin, Package } from 'lucide-react';

export default function UserDashboard() {
  const { currentUser, collectionRecords, collectionRequests, purchases, products } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentUser || currentUser.role !== 'user') return <Navigate to="/login" />;

  const myRecords = collectionRecords.filter((r) => r.userId === currentUser.id);
  const myPurchases = purchases.filter((p) => p.userId === currentUser.id);
  const myRequests = collectionRequests.filter((r) => r.userId === currentUser.id);
  const totalPointsEarned = myRecords.reduce((sum, r) => sum + r.pointsAwarded, 0);
  const totalPointsSpent = myPurchases.reduce((sum, p) => sum + p.points, 0);
  const totalWaste = myRecords.reduce((sum, r) => sum + r.weight, 0);

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: Home },
    { id: 'requests', label: 'درخواست‌ها', icon: Calendar },
    { id: 'records', label: 'سوابق', icon: Recycle },
    { id: 'purchases', label: 'خریدها', icon: ShoppingBag },
    { id: 'profile', label: 'پروفایل', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-bl from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-8 mb-8 text-white"
        >
          <div className="absolute inset-0 noise"></div>
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-18 h-18 bg-white/15 rounded-2xl flex items-center justify-center p-4 backdrop-blur-sm">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-black">{currentUser.name}</h1>
                <p className="text-white/70">{currentUser.phone}</p>
              </div>
            </div>

            {/* Points Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70 mb-1">امتیاز فعلی شما</p>
                  <p className="text-5xl font-black">{currentUser.points.toLocaleString('fa-IR')}</p>
                </div>
                <div className="relative">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                    <Coins className="w-10 h-10 text-yellow-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: totalPointsEarned, label: 'کسب شده', icon: TrendingUp },
                { value: `${totalWaste} کیلو`, label: 'بازیافت', icon: Recycle },
                { value: myPurchases.length, label: 'خرید', icon: ShoppingBag },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-white/70" />
                  <p className="text-xl font-black">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link to="/shop" className="group bg-white rounded-2xl p-5 shadow-lg shadow-gray-100 border border-gray-100 card-hover text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition">
              <Store className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="font-black text-gray-900">فروشگاه</p>
            <p className="text-xs text-gray-500 mt-1">خرید با امتیاز</p>
          </Link>
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-100 border border-gray-100 text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CalendarCheck className="w-7 h-7 text-amber-600" />
            </div>
            <p className="font-black text-gray-900">روز جمع‌آوری</p>
            <p className="text-xs text-gray-500 mt-1">منتظر اطلاع‌رسانی</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-l from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  آخرین درخواست‌ها
                </h3>
                <div className="space-y-3">
                  {myRequests.slice(-3).reverse().map((request) => (
                    <div key={request.id} className="bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-800 text-sm">{request.productName}</span>
                        <span className={`text-xs px-2 py-1 rounded-lg font-bold ${
                          request.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          request.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                          request.status === 'assigned' ? 'bg-purple-50 text-purple-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {request.status === 'completed' ? 'تکمیل شده' :
                           request.status === 'scheduled' ? 'زمان‌بندی شده' :
                           request.status === 'assigned' ? 'تخصیص یافته' : 'در انتظار'}
                        </span>
                      </div>
                      {request.scheduledDate && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {request.scheduledDate}
                        </p>
                      )}
                      {request.employeeName && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          {request.employeeName}
                        </p>
                      )}
                    </div>
                  ))}
                  {myRequests.length === 0 && <p className="text-gray-400 text-sm text-center py-4">درخواستی ثبت نکرده‌اید</p>}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-emerald-500" />
                  آخرین جمع‌آوری‌ها
                </h3>
                <div className="space-y-3">
                  {myRecords.slice(-3).reverse().map((record) => (
                    <div key={record.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{record.wasteType}</p>
                        <p className="text-xs text-gray-500">{record.date} - {record.weight} کیلو</p>
                      </div>
                      <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1"><TrendingUp className="w-3 h-3" />+{record.pointsAwarded}</span>
                    </div>
                  ))}
                  {myRecords.length === 0 && <p className="text-gray-400 text-sm text-center py-4">هنوز زباله‌ای تحویل نداده‌اید</p>}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                وضعیت امتیاز شما
              </h3>
              <div className="space-y-5">
                {[
                  { label: 'امتیاز کسب شده', value: totalPointsEarned, color: 'bg-emerald-500', max: Math.max(totalPointsEarned, 1) },
                  { label: 'امتیاز خرج شده', value: totalPointsSpent, color: 'bg-red-400', max: Math.max(totalPointsEarned, 1) },
                  { label: 'امتیاز موجود', value: currentUser.points, color: 'bg-amber-400', max: Math.max(totalPointsEarned, 1) },
                ].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">{bar.label}</span>
                      <span className="font-black text-gray-900">{bar.value.toLocaleString('fa-IR')}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(bar.value / bar.max) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={`${bar.color} rounded-full h-3`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Requests */}
        {activeTab === 'requests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              درخواست‌های جمع‌آوری
            </h2>
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{request.productName}</h3>
                        <p className="text-xs text-gray-500">درخواست در: {request.createdAt}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      request.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      request.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      request.status === 'assigned' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {request.status === 'completed' ? 'تکمیل شده' :
                       request.status === 'scheduled' ? 'زمان‌بندی شده' :
                       request.status === 'assigned' ? 'تخصیص یافته' : 'در انتظار بررسی'}
                    </span>
                  </div>

                  {/* Waste Plan */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">برنامه جمع‌آوری:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {request.wastePlan.map((item, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-500">{item.wasteType}</p>
                          <p className="font-bold text-emerald-600">{item.weight} کیلو</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Info */}
                  {request.scheduledDate && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-blue-700">زمان جمع‌آوری:</span>
                      </div>
                      <p className="text-blue-800 font-black text-lg">{request.scheduledDate}</p>
                      {request.employeeName && (
                        <div className="flex items-center gap-2 mt-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700">کارمند: {request.employeeName}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {myRequests.length === 0 && (
                <div className="bg-white rounded-2xl p-16 text-center shadow-lg">
                  <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">هنوز درخواستی ثبت نکرده‌اید</p>
                  <Link to="/shop" className="text-emerald-600 font-bold hover:underline mt-2 inline-flex items-center gap-1">
                    رفتن به فروشگاه
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Records */}
        {activeTab === 'records' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Recycle className="w-5 h-5 text-emerald-600" />
              سوابق جمع‌آوری زباله
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-l from-emerald-50 to-green-50">
                    <tr>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">تاریخ</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">نوع زباله</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">وزن</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">کارمند</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">امتیاز</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRecords.map((record) => (
                      <tr key={record.id} className="border-t border-gray-50 hover:bg-emerald-50/30 transition">
                        <td className="p-4 text-gray-600">{record.date}</td>
                        <td className="p-4 font-bold text-gray-800">{record.wasteType}</td>
                        <td className="p-4 text-gray-600">{record.weight} کیلو</td>
                        <td className="p-4 text-gray-600">{record.employeeName}</td>
                        <td className="p-4"><span className="text-emerald-600 font-black">+{record.pointsAwarded}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {myRecords.length === 0 && (
                <div className="p-16 text-center">
                  <Recycle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">هنوز زباله‌ای تحویل نداده‌اید</p>
                  <p className="text-gray-300 text-sm mt-2">در روزهای جمع‌آوری، زباله‌های خود را تحویل دهید</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Purchases */}
        {activeTab === 'purchases' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                خریدهای من
              </h2>
              <Link to="/shop" className="flex items-center gap-2 bg-gradient-to-l from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 text-sm">
                <Store className="w-4 h-4" />
                فروشگاه
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-l from-emerald-50 to-green-50">
                    <tr>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">محصول</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">تاریخ</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">امتیاز</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPurchases.map((purchase) => (
                      <tr key={purchase.id} className="border-t border-gray-50 hover:bg-emerald-50/30 transition">
                        <td className="p-4 font-bold text-gray-800">{purchase.productName}</td>
                        <td className="p-4 text-gray-600">{purchase.date}</td>
                        <td className="p-4 text-red-500 font-black">{purchase.points}-</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
                            purchase.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {purchase.status === 'delivered' ? <><Check className="w-3 h-3" />تحویل شده</> : <><Clock className="w-3 h-3" />در انتظار</>}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {myPurchases.length === 0 && (
                <div className="p-16 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">هنوز خریدی نکرده‌اید</p>
                  <Link to="/shop" className="text-emerald-600 font-bold hover:underline mt-2 inline-flex items-center gap-1">
                    رفتن به فروشگاه
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              اطلاعات پروفایل
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { label: 'نام و نام خانوادگی', value: currentUser.name },
                  { label: 'ایمیل', value: currentUser.email },
                  { label: 'شماره تلفن', value: currentUser.phone },
                  { label: 'آدرس', value: currentUser.address },
                  { label: 'تاریخ عضویت', value: currentUser.createdAt },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-xs text-gray-400 font-bold mb-1 block">{field.label}</label>
                    <p className="font-bold text-gray-800 bg-gray-50 p-3.5 rounded-xl border border-gray-100">{field.value}</p>
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-400 font-bold mb-1 block">امتیاز فعلی</label>
                  <div className="flex items-center gap-3 bg-gradient-to-l from-amber-50 to-yellow-50 p-3.5 rounded-xl border border-amber-100">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <span className="font-black text-amber-700 text-xl">{currentUser.points.toLocaleString('fa-IR')}</span>
                    <span className="text-xs text-amber-600">امتیاز</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
