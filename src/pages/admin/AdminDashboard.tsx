import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, UserCheck, Package, Truck, ClipboardList, ShoppingBag, Plus, Trash2, Check, X, Leaf, TrendingUp, Award, Recycle } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, users, products, collectionDays, collectionRecords, purchases, addCollectionDay, addProduct, deleteProduct, updatePurchase, updateCollectionDay } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddDay, setShowAddDay] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', points: 0, image: '📦', category: '', stock: 0 });
  const [newDay, setNewDay] = useState({ date: '', employeeId: '', area: '' });

  if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/login" />;

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
      addCollectionDay({ date: newDay.date, employeeId: emp.id, employeeName: emp.name, area: newDay.area, status: 'scheduled' });
      setNewDay({ date: '', employeeId: '', area: '' });
      setShowAddDay(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: LayoutDashboard },
    { id: 'users', label: 'کاربران', icon: Users },
    { id: 'employees', label: 'کارمندان', icon: UserCheck },
    { id: 'products', label: 'محصولات', icon: Package },
    { id: 'collections', label: 'جمع‌آوری', icon: Truck },
    { id: 'records', label: 'سوابق', icon: ClipboardList },
    { id: 'purchases', label: 'خریدها', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-72 bg-white shadow-xl lg:min-h-screen p-6 border-l border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-black text-gray-900 text-lg">{currentUser.name}</h3>
            <span className="inline-block text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold mt-1">مدیر سیستم</span>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-right px-4 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-l from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview */}
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                    </div>
                    نمای کلی سیستم
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {[
                      { label: 'کل کاربران', value: regularUsers.length, icon: Users, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50' },
                      { label: 'کارمندان', value: employees.length, icon: UserCheck, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50' },
                      { label: 'امتیاز توزیع شده', value: totalPointsAwarded, icon: Award, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
                      { label: 'زباله جمع‌آوری', value: `${totalWasteCollected} کیلو`, icon: Recycle, color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100 card-hover"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                          </div>
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                            <stat.icon className="w-7 h-7 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
                      <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                        <Recycle className="w-5 h-5 text-emerald-500" />
                        آخرین سوابق
                      </h3>
                      <div className="space-y-3">
                        {collectionRecords.slice(-5).reverse().map((record) => (
                          <div key={record.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{record.userName}</p>
                              <p className="text-xs text-gray-500">{record.wasteType} - {record.weight} کیلو</p>
                            </div>
                            <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-lg">+{record.pointsAwarded}⭐</span>
                          </div>
                        ))}
                        {collectionRecords.length === 0 && <p className="text-gray-400 text-sm text-center py-4">رکوردی وجود ندارد</p>}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
                      <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-500" />
                        آخرین خریدها
                      </h3>
                      <div className="space-y-3">
                        {purchases.slice(-5).reverse().map((purchase) => (
                          <div key={purchase.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{purchase.userName}</p>
                              <p className="text-xs text-gray-500">{purchase.productName}</p>
                            </div>
                            <span className="text-red-500 font-black text-sm bg-red-50 px-3 py-1 rounded-lg">-{purchase.points}⭐</span>
                          </div>
                        ))}
                        {purchases.length === 0 && <p className="text-gray-400 text-sm text-center py-4">خریدی ثبت نشده</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    مدیریت کاربران
                  </h2>
                  <div className="bg-white rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-l from-emerald-50 to-green-50">
                          <tr>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">نام</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">ایمیل</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">تلفن</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">امتیاز</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">عضویت</th>
                          </tr>
                        </thead>
                        <tbody>
                          {regularUsers.map((user) => (
                            <tr key={user.id} className="border-t border-gray-50 hover:bg-emerald-50/30 transition">
                              <td className="p-4 font-bold text-gray-800">{user.name}</td>
                              <td className="p-4 text-gray-500 text-sm">{user.email}</td>
                              <td className="p-4 text-gray-500 text-sm">{user.phone}</td>
                              <td className="p-4">
                                <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-black border border-amber-100">
                                  {user.points} ⭐
                                </span>
                              </td>
                              <td className="p-4 text-gray-500 text-sm">{user.createdAt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {regularUsers.length === 0 && <p className="p-8 text-center text-gray-400">کاربری ثبت‌نام نکرده</p>}
                  </div>
                </div>
              )}

              {/* Employees */}
              {activeTab === 'employees' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    مدیریت کارمندان
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    {employees.map((emp) => {
                      const empRecords = collectionRecords.filter((r) => r.employeeId === emp.id);
                      return (
                        <div key={emp.id} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100 card-hover">
                          <div className="flex items-center gap-4 mb-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <UserCheck className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h3 className="font-black text-gray-900">{emp.name}</h3>
                              <p className="text-sm text-gray-500">{emp.phone}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-emerald-50 p-3 rounded-xl text-center">
                              <p className="text-xs text-gray-500">جمع‌آوری</p>
                              <p className="font-black text-emerald-700 text-lg">{empRecords.length}</p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-xl text-center">
                              <p className="text-xs text-gray-500">امتیاز</p>
                              <p className="font-black text-amber-700 text-lg">{empRecords.reduce((s, r) => s + r.pointsAwarded, 0)}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-xl text-center">
                              <p className="text-xs text-gray-500">وزن</p>
                              <p className="font-black text-purple-700 text-lg">{empRecords.reduce((s, r) => s + r.weight, 0)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Products */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-emerald-600" />
                      </div>
                      مدیریت محصولات
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddProduct(!showAddProduct)}
                      className="flex items-center gap-2 bg-gradient-to-l from-emerald-500 to-green-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن محصول
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showAddProduct && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-6"
                      >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                          <h3 className="font-black text-gray-900 mb-4">محصول جدید</h3>
                          <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
                            <input type="text" placeholder="نام محصول" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <input type="text" placeholder="ایموجی" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" />
                            <input type="text" placeholder="دسته‌بندی" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <input type="number" placeholder="امتیاز" value={newProduct.points || ''} onChange={(e) => setNewProduct({ ...newProduct, points: parseInt(e.target.value) || 0 })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <input type="number" placeholder="موجودی" value={newProduct.stock || ''} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <input type="text" placeholder="توضیحات" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" />
                            <div className="md:col-span-2 flex gap-3">
                              <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition">ذخیره</button>
                              <button type="button" onClick={() => setShowAddProduct(false)} className="border-2 border-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition">انصراف</button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((product) => (
                      <div key={product.id} className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-100 border border-gray-100 card-hover">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-4xl">{product.image}</span>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h3 className="font-black text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-600 font-black">{product.points} امتیاز</span>
                          <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-lg font-bold">{product.stock} عدد</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections */}
              {activeTab === 'collections' && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Truck className="w-5 h-5 text-emerald-600" />
                      </div>
                      روزهای جمع‌آوری
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddDay(!showAddDay)}
                      className="flex items-center gap-2 bg-gradient-to-l from-emerald-500 to-green-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      روز جدید
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showAddDay && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-6"
                      >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                          <form onSubmit={handleAddDay} className="grid md:grid-cols-3 gap-4">
                            <input type="date" value={newDay.date} onChange={(e) => setNewDay({ ...newDay, date: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <select value={newDay.employeeId} onChange={(e) => setNewDay({ ...newDay, employeeId: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required>
                              <option value="">انتخاب کارمند</option>
                              {employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}
                            </select>
                            <input type="text" placeholder="منطقه" value={newDay.area} onChange={(e) => setNewDay({ ...newDay, area: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <div className="md:col-span-3 flex gap-3">
                              <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition">ذخیره</button>
                              <button type="button" onClick={() => setShowAddDay(false)} className="border-2 border-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition">انصراف</button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-l from-emerald-50 to-green-50">
                          <tr>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">تاریخ</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">کارمند</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">منطقه</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">وضعیت</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">عملیات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {collectionDays.map((day) => (
                            <tr key={day.id} className="border-t border-gray-50 hover:bg-emerald-50/30 transition">
                              <td className="p-4 font-bold text-gray-800">{day.date}</td>
                              <td className="p-4 text-gray-600">{day.employeeName}</td>
                              <td className="p-4 text-gray-600">{day.area}</td>
                              <td className="p-4">
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                                  day.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  day.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                  'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                  {day.status === 'completed' ? '✅ انجام شده' : day.status === 'scheduled' ? '📅 برنامه‌ریزی' : '❌ لغو'}
                                </span>
                              </td>
                              <td className="p-4">
                                {day.status === 'scheduled' && (
                                  <div className="flex gap-2">
                                    <button onClick={() => updateCollectionDay(day.id, { status: 'completed' })} className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 transition"><Check className="w-4 h-4" /></button>
                                    <button onClick={() => updateCollectionDay(day.id, { status: 'cancelled' })} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"><X className="w-4 h-4" /></button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {collectionDays.length === 0 && <p className="p-8 text-center text-gray-400">روزی تعیین نشده</p>}
                  </div>
                </div>
              )}

              {/* Records */}
              {activeTab === 'records' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-emerald-600" />
                    </div>
                    سوابق جمع‌آوری
                  </h2>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-l from-emerald-50 to-green-50">
                          <tr>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">کاربر</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">کارمند</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">تاریخ</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">نوع</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">وزن</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">امتیاز</th>
                          </tr>
                        </thead>
                        <tbody>
                          {collectionRecords.map((record) => (
                            <tr key={record.id} className="border-t border-gray-50 hover:bg-emerald-50/30 transition">
                              <td className="p-4 font-bold text-gray-800">{record.userName}</td>
                              <td className="p-4 text-gray-600">{record.employeeName}</td>
                              <td className="p-4 text-gray-600">{record.date}</td>
                              <td className="p-4 text-gray-600">{record.wasteType}</td>
                              <td className="p-4 text-gray-600">{record.weight} کیلو</td>
                              <td className="p-4"><span className="text-emerald-600 font-black">+{record.pointsAwarded}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {collectionRecords.length === 0 && <p className="p-8 text-center text-gray-400">رکوردی وجود ندارد</p>}
                  </div>
                </div>
              )}

              {/* Purchases */}
              {activeTab === 'purchases' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    </div>
                    مدیریت خریدها
                  </h2>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-l from-emerald-50 to-green-50">
                          <tr>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">کاربر</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">محصول</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">امتیاز</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">تاریخ</th>
                            <th className="text-right p-4 font-bold text-gray-700 text-sm">وضعیت</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchases.map((purchase) => (
                            <tr key={purchase.id} className="border-t border-gray-50 hover:bg-emerald-50/30 transition">
                              <td className="p-4 font-bold text-gray-800">{purchase.userName}</td>
                              <td className="p-4 text-gray-600">{purchase.productName}</td>
                              <td className="p-4 text-red-500 font-black">{purchase.points}-</td>
                              <td className="p-4 text-gray-600">{purchase.date}</td>
                              <td className="p-4">
                                <select
                                  value={purchase.status}
                                  onChange={(e) => updatePurchase(purchase.id, e.target.value as 'pending' | 'delivered')}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border-0 ${
                                    purchase.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
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
                    {purchases.length === 0 && <p className="p-8 text-center text-gray-400">خریدی ثبت نشده</p>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
