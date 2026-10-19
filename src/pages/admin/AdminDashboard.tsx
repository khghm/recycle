import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { currentUser, users, products, collectionDays, collectionRecords, purchases, addCollectionDay, addProduct, deleteProduct, updatePurchase, updateCollectionDay } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddDay, setShowAddDay] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', points: 0, image: '📦', category: '', stock: 0 });
  const [newDay, setNewDay] = useState({ date: '', employeeId: '', area: '' });

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const employees = users.filter((u) => u.role === 'employee');
  const regularUsers = users.filter((u) => u.role === 'user');
  const totalPointsAwarded = collectionRecords.reduce((sum, r) => sum + r.pointsAwarded, 0);
  const totalWasteCollected = collectionRecords.reduce((sum, r) => sum + r.weight, 0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProduct);
    setNewProduct({ name: '', description: '', points: 0, image: '📦', category: '', stock: 0 });
    setShowAddProduct(false);
  };

  const handleAddDay = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((emp) => emp.id === newDay.employeeId);
    if (emp) {
      addCollectionDay({
        date: newDay.date,
        employeeId: emp.id,
        employeeName: emp.name,
        area: newDay.area,
        status: 'scheduled',
      });
      setNewDay({ date: '', employeeId: '', area: '' });
      setShowAddDay(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: 'fas fa-chart-pie' },
    { id: 'users', label: 'کاربران', icon: 'fas fa-users' },
    { id: 'employees', label: 'کارمندان', icon: 'fas fa-user-tie' },
    { id: 'products', label: 'محصولات', icon: 'fas fa-box' },
    { id: 'collections', label: 'جمع‌آوری', icon: 'fas fa-truck' },
    { id: 'records', label: 'سوابق', icon: 'fas fa-clipboard-list' },
    { id: 'purchases', label: 'خریدها', icon: 'fas fa-shopping-bag' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-64 bg-white shadow-lg lg:min-h-screen p-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-user-shield text-2xl text-green-600"></i>
            </div>
            <h3 className="font-bold text-gray-800">{currentUser.name}</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">مدیر سیستم</span>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-right px-4 py-3 rounded-xl flex items-center gap-3 transition font-medium ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">
                <i className="fas fa-chart-pie text-green-600 ml-2"></i>
                نمای کلی
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-5 shadow-sm border-r-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">کل کاربران</p>
                      <p className="text-2xl font-black text-gray-800">{regularUsers.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-users text-green-600"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border-r-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">کارمندان</p>
                      <p className="text-2xl font-black text-gray-800">{employees.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-user-tie text-blue-600"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border-r-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">امتیاز توزیع شده</p>
                      <p className="text-2xl font-black text-gray-800">{totalPointsAwarded}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-star text-yellow-600"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border-r-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">زباله جمع‌آوری شده</p>
                      <p className="text-2xl font-black text-gray-800">{totalWasteCollected} کیلو</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-recycle text-purple-600"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">
                    <i className="fas fa-clock text-green-600 ml-2"></i>
                    آخرین سوابق جمع‌آوری
                  </h3>
                  <div className="space-y-3">
                    {collectionRecords.slice(-5).reverse().map((record) => (
                      <div key={record.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{record.userName}</p>
                          <p className="text-xs text-gray-500">{record.wasteType} - {record.weight} کیلو</p>
                        </div>
                        <span className="text-green-600 font-bold text-sm">+{record.pointsAwarded}⭐</span>
                      </div>
                    ))}
                    {collectionRecords.length === 0 && <p className="text-gray-500 text-sm">رکوردی وجود ندارد</p>}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4">
                    <i className="fas fa-shopping-bag text-green-600 ml-2"></i>
                    آخرین خریدها
                  </h3>
                  <div className="space-y-3">
                    {purchases.slice(-5).reverse().map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{purchase.userName}</p>
                          <p className="text-xs text-gray-500">{purchase.productName}</p>
                        </div>
                        <span className="text-red-500 font-bold text-sm">-{purchase.points}⭐</span>
                      </div>
                    ))}
                    {purchases.length === 0 && <p className="text-gray-500 text-sm">خریدی ثبت نشده</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">
                <i className="fas fa-users text-green-600 ml-2"></i>
                مدیریت کاربران
              </h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-right p-4 font-bold text-gray-700">نام</th>
                        <th className="text-right p-4 font-bold text-gray-700">ایمیل</th>
                        <th className="text-right p-4 font-bold text-gray-700">تلفن</th>
                        <th className="text-right p-4 font-bold text-gray-700">امتیاز</th>
                        <th className="text-right p-4 font-bold text-gray-700">تاریخ عضویت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regularUsers.map((user) => (
                        <tr key={user.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-medium">{user.name}</td>
                          <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                          <td className="p-4 text-gray-600 text-sm">{user.phone}</td>
                          <td className="p-4">
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                              {user.points} ⭐
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 text-sm">{user.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {regularUsers.length === 0 && <p className="p-8 text-center text-gray-500">کاربری ثبت‌نام نکرده</p>}
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">
                <i className="fas fa-user-tie text-green-600 ml-2"></i>
                مدیریت کارمندان
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {employees.map((emp) => {
                  const empRecords = collectionRecords.filter((r) => r.employeeId === emp.id);
                  const totalPointsGiven = empRecords.reduce((sum, r) => sum + r.pointsAwarded, 0);
                  const totalWeight = empRecords.reduce((sum, r) => sum + r.weight, 0);
                  return (
                    <div key={emp.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user-tie text-xl text-blue-600"></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{emp.name}</h3>
                          <p className="text-sm text-gray-500">{emp.phone}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">جمع‌آوری</p>
                          <p className="font-bold text-gray-800">{empRecords.length}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">امتیاز داده</p>
                          <p className="font-bold text-green-600">{totalPointsGiven}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg">
                          <p className="text-xs text-gray-500">وزن (کیلو)</p>
                          <p className="font-bold text-purple-600">{totalWeight}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800">
                  <i className="fas fa-box text-green-600 ml-2"></i>
                  مدیریت محصولات
                </h2>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  <i className="fas fa-plus ml-2"></i>
                  افزودن محصول
                </button>
              </div>

              {showAddProduct && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">افزودن محصول جدید</h3>
                  <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="نام محصول"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="ایموجی (مثلاً 🛼)"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="دسته‌بندی"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="امتیاز مورد نیاز"
                      value={newProduct.points || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, points: parseInt(e.target.value) || 0 })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      required
                    />
                    <input
                      type="number"
                      placeholder="موجودی"
                      value={newProduct.stock || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="توضیحات"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                    />
                    <div className="md:col-span-2 flex gap-3">
                      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
                        ذخیره
                      </button>
                      <button type="button" onClick={() => setShowAddProduct(false)} className="border-2 border-gray-300 px-6 py-2 rounded-lg font-bold hover:bg-gray-50">
                        انصراف
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{product.image}</span>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <h3 className="font-bold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 font-bold">{product.points} امتیاز</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.stock} عدد</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collections Tab */}
          {activeTab === 'collections' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800">
                  <i className="fas fa-truck text-green-600 ml-2"></i>
                  روزهای جمع‌آوری
                </h2>
                <button
                  onClick={() => setShowAddDay(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  <i className="fas fa-plus ml-2"></i>
                  تعیین روز جدید
                </button>
              </div>

              {showAddDay && (
                <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">تعیین روز جمع‌آوری جدید</h3>
                  <form onSubmit={handleAddDay} className="grid md:grid-cols-3 gap-4">
                    <input
                      type="date"
                      value={newDay.date}
                      onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      required
                    />
                    <select
                      value={newDay.employeeId}
                      onChange={(e) => setNewDay({ ...newDay, employeeId: e.target.value })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      required
                    >
                      <option value="">انتخاب کارمند</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="منطقه"
                      value={newDay.area}
                      onChange={(e) => setNewDay({ ...newDay, area: e.target.value })}
                      className="border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      required
                    />
                    <div className="md:col-span-3 flex gap-3">
                      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
                        ذخیره
                      </button>
                      <button type="button" onClick={() => setShowAddDay(false)} className="border-2 border-gray-300 px-6 py-2 rounded-lg font-bold hover:bg-gray-50">
                        انصراف
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-right p-4 font-bold text-gray-700">تاریخ</th>
                        <th className="text-right p-4 font-bold text-gray-700">کارمند</th>
                        <th className="text-right p-4 font-bold text-gray-700">منطقه</th>
                        <th className="text-right p-4 font-bold text-gray-700">وضعیت</th>
                        <th className="text-right p-4 font-bold text-gray-700">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionDays.map((day) => (
                        <tr key={day.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-medium">{day.date}</td>
                          <td className="p-4 text-gray-600">{day.employeeName}</td>
                          <td className="p-4 text-gray-600">{day.area}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              day.status === 'completed' ? 'bg-green-100 text-green-700' :
                              day.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {day.status === 'completed' ? 'انجام شده' : day.status === 'scheduled' ? 'برنامه‌ریزی شده' : 'لغو شده'}
                            </span>
                          </td>
                          <td className="p-4">
                            {day.status === 'scheduled' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateCollectionDay(day.id, { status: 'completed' })}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                  title="تکمیل"
                                >
                                  <i className="fas fa-check-circle"></i>
                                </button>
                                <button
                                  onClick={() => updateCollectionDay(day.id, { status: 'cancelled' })}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                  title="لغو"
                                >
                                  <i className="fas fa-times-circle"></i>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {collectionDays.length === 0 && <p className="p-8 text-center text-gray-500">روزی تعیین نشده</p>}
              </div>
            </div>
          )}

          {/* Records Tab */}
          {activeTab === 'records' && (
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">
                <i className="fas fa-clipboard-list text-green-600 ml-2"></i>
                سوابق جمع‌آوری
              </h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-right p-4 font-bold text-gray-700">کاربر</th>
                        <th className="text-right p-4 font-bold text-gray-700">کارمند</th>
                        <th className="text-right p-4 font-bold text-gray-700">تاریخ</th>
                        <th className="text-right p-4 font-bold text-gray-700">نوع زباله</th>
                        <th className="text-right p-4 font-bold text-gray-700">وزن</th>
                        <th className="text-right p-4 font-bold text-gray-700">امتیاز</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionRecords.map((record) => (
                        <tr key={record.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-medium">{record.userName}</td>
                          <td className="p-4 text-gray-600">{record.employeeName}</td>
                          <td className="p-4 text-gray-600">{record.date}</td>
                          <td className="p-4 text-gray-600">{record.wasteType}</td>
                          <td className="p-4 text-gray-600">{record.weight} کیلو</td>
                          <td className="p-4">
                            <span className="text-green-600 font-bold">+{record.pointsAwarded}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {collectionRecords.length === 0 && <p className="p-8 text-center text-gray-500">رکوردی وجود ندارد</p>}
              </div>
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === 'purchases' && (
            <div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">
                <i className="fas fa-shopping-bag text-green-600 ml-2"></i>
                مدیریت خریدها
              </h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="text-right p-4 font-bold text-gray-700">کاربر</th>
                        <th className="text-right p-4 font-bold text-gray-700">محصول</th>
                        <th className="text-right p-4 font-bold text-gray-700">امتیاز</th>
                        <th className="text-right p-4 font-bold text-gray-700">تاریخ</th>
                        <th className="text-right p-4 font-bold text-gray-700">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase) => (
                        <tr key={purchase.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-medium">{purchase.userName}</td>
                          <td className="p-4 text-gray-600">{purchase.productName}</td>
                          <td className="p-4 text-red-500 font-bold">{purchase.points}-</td>
                          <td className="p-4 text-gray-600">{purchase.date}</td>
                          <td className="p-4">
                            <select
                              value={purchase.status}
                              onChange={(e) => updatePurchase(purchase.id, e.target.value as 'pending' | 'delivered')}
                              className={`px-3 py-1 rounded-full text-xs font-bold border-0 ${
                                purchase.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              <option value="pending">در انتظار</option>
                              <option value="delivered">تحویل شده</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {purchases.length === 0 && <p className="p-8 text-center text-gray-500">خریدی ثبت نشده</p>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
