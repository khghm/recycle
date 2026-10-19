import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigate, Link } from 'react-router-dom';

export default function UserDashboard() {
  const { currentUser, collectionRecords, purchases, products } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentUser || currentUser.role !== 'user') {
    return <Navigate to="/login" />;
  }

  const myRecords = collectionRecords.filter((r) => r.userId === currentUser.id);
  const myPurchases = purchases.filter((p) => p.userId === currentUser.id);
  const totalPointsEarned = myRecords.reduce((sum, r) => sum + r.pointsAwarded, 0);
  const totalPointsSpent = myPurchases.reduce((sum, p) => sum + p.points, 0);
  const totalWaste = myRecords.reduce((sum, r) => sum + r.weight, 0);

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: 'fas fa-home' },
    { id: 'records', label: 'سوابق جمع‌آوری', icon: 'fas fa-recycle' },
    { id: 'purchases', label: 'خریدهای من', icon: 'fas fa-shopping-bag' },
    { id: 'profile', label: 'پروفایل', icon: 'fas fa-user' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Card */}
        <div className="bg-gradient-to-l from-green-600 to-emerald-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-black">{currentUser.name}</h1>
                <p className="opacity-80">{currentUser.phone}</p>
              </div>
            </div>

            {/* Points Display */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">امتیاز فعلی شما</p>
                  <p className="text-4xl font-black">{currentUser.points}</p>
                </div>
                <div className="text-5xl">⭐</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-black">{totalPointsEarned}</p>
                <p className="text-xs opacity-80">امتیاز کسب شده</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-black">{totalWaste} کیلو</p>
                <p className="text-xs opacity-80">زباله تحویل داده</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-black">{myPurchases.length}</p>
                <p className="text-xs opacity-80">تعداد خرید</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            to="/shop"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition text-center group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition">
              <i className="fas fa-store text-green-600 text-lg"></i>
            </div>
            <p className="font-bold text-gray-800">فروشگاه</p>
            <p className="text-xs text-gray-500">خرید با امتیاز</p>
          </Link>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-calendar-check text-yellow-600 text-lg"></i>
            </div>
            <p className="font-bold text-gray-800">روز جمع‌آوری</p>
            <p className="text-xs text-gray-500">منتظر اطلاع‌رسانی باشید</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-green-50'
              }`}
            >
              <i className={`${tab.icon} ml-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Records */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">
                  <i className="fas fa-recycle text-green-600 ml-2"></i>
                  آخرین جمع‌آوری‌ها
                </h3>
                <div className="space-y-3">
                  {myRecords.slice(-5).reverse().map((record) => (
                    <div key={record.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{record.wasteType}</p>
                        <p className="text-xs text-gray-500">{record.date} - {record.weight} کیلو</p>
                      </div>
                      <span className="text-green-600 font-bold">+{record.pointsAwarded}⭐</span>
                    </div>
                  ))}
                  {myRecords.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">هنوز زباله‌ای تحویل نداده‌اید</p>
                  )}
                </div>
              </div>

              {/* Recent Purchases */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">
                  <i className="fas fa-shopping-bag text-green-600 ml-2"></i>
                  آخرین خریدها
                </h3>
                <div className="space-y-3">
                  {myPurchases.slice(-5).reverse().map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{purchase.productName}</p>
                        <p className="text-xs text-gray-500">{purchase.date}</p>
                      </div>
                      <div className="text-left">
                        <span className="text-red-500 font-bold text-sm">-{purchase.points}⭐</span>
                        <p className={`text-xs ${purchase.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {purchase.status === 'delivered' ? '✅ تحویل شده' : '⏳ در انتظار'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {myPurchases.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">هنوز خریدی نکرده‌اید</p>
                  )}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
              <h3 className="font-bold text-gray-800 mb-4">
                <i className="fas fa-chart-line text-green-600 ml-2"></i>
                وضعیت امتیاز شما
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">امتیاز کسب شده</span>
                    <span className="font-bold text-green-600">{totalPointsEarned}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 rounded-full h-3 transition-all"
                      style={{ width: `${Math.min((totalPointsEarned / Math.max(totalPointsEarned, 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">امتیاز خرج شده</span>
                    <span className="font-bold text-red-500">{totalPointsSpent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-400 rounded-full h-3 transition-all"
                      style={{ width: `${totalPointsEarned > 0 ? (totalPointsSpent / totalPointsEarned) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">امتیاز موجود</span>
                    <span className="font-bold text-yellow-600">{currentUser.points}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-400 rounded-full h-3 transition-all"
                      style={{ width: `${totalPointsEarned > 0 ? (currentUser.points / totalPointsEarned) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-recycle text-green-600 ml-2"></i>
              سوابق جمع‌آوری زباله
            </h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="text-right p-4 font-bold text-gray-700">تاریخ</th>
                      <th className="text-right p-4 font-bold text-gray-700">نوع زباله</th>
                      <th className="text-right p-4 font-bold text-gray-700">وزن</th>
                      <th className="text-right p-4 font-bold text-gray-700">کارمند</th>
                      <th className="text-right p-4 font-bold text-gray-700">امتیاز</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRecords.map((record) => (
                      <tr key={record.id} className="border-t hover:bg-gray-50">
                        <td className="p-4 text-gray-600">{record.date}</td>
                        <td className="p-4 font-medium">{record.wasteType}</td>
                        <td className="p-4 text-gray-600">{record.weight} کیلو</td>
                        <td className="p-4 text-gray-600">{record.employeeName}</td>
                        <td className="p-4">
                          <span className="text-green-600 font-bold">+{record.pointsAwarded}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {myRecords.length === 0 && (
                <div className="p-12 text-center">
                  <i className="fas fa-recycle text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">هنوز زباله‌ای تحویل نداده‌اید</p>
                  <p className="text-gray-400 text-sm mt-2">در روزهای جمع‌آوری، زباله‌های خود را تحویل دهید</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                <i className="fas fa-shopping-bag text-green-600 ml-2"></i>
                خریدهای من
              </h2>
              <Link to="/shop" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition text-sm">
                <i className="fas fa-store ml-1"></i>
                فروشگاه
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="text-right p-4 font-bold text-gray-700">محصول</th>
                      <th className="text-right p-4 font-bold text-gray-700">تاریخ</th>
                      <th className="text-right p-4 font-bold text-gray-700">امتیاز</th>
                      <th className="text-right p-4 font-bold text-gray-700">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPurchases.map((purchase) => (
                      <tr key={purchase.id} className="border-t hover:bg-gray-50">
                        <td className="p-4 font-medium">{purchase.productName}</td>
                        <td className="p-4 text-gray-600">{purchase.date}</td>
                        <td className="p-4 text-red-500 font-bold">{purchase.points}-</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            purchase.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {purchase.status === 'delivered' ? '✅ تحویل شده' : '⏳ در انتظار'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {myPurchases.length === 0 && (
                <div className="p-12 text-center">
                  <i className="fas fa-shopping-bag text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">هنوز خریدی نکرده‌اید</p>
                  <Link to="/shop" className="text-green-600 font-bold hover:underline mt-2 inline-block">
                    رفتن به فروشگاه ←
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-user text-green-600 ml-2"></i>
              اطلاعات پروفایل
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">نام و نام خانوادگی</label>
                    <p className="font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">{currentUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">ایمیل</label>
                    <p className="font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">{currentUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">شماره تلفن</label>
                    <p className="font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">{currentUser.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">آدرس</label>
                    <p className="font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">{currentUser.address}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">تاریخ عضویت</label>
                    <p className="font-bold text-gray-800 bg-gray-50 p-3 rounded-lg">{currentUser.createdAt}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">امتیاز فعلی</label>
                    <p className="font-bold text-green-600 bg-green-50 p-3 rounded-lg text-xl">{currentUser.points} ⭐</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
