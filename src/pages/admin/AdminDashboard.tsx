import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, UserCheck, Package, Truck, ClipboardList, ShoppingBag, Plus, Trash2, Check, X, Leaf, TrendingUp, Award, Recycle, Calendar, Bell, Clock, MapPin, Menu } from 'lucide-react';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import Breadcrumbs from '../../components/Breadcrumbs';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';

export default function AdminDashboard() {
  const { currentUser, users, products, collectionDays, collectionRequests, collectionRecords, purchases, addCollectionDay, addProduct, updateProduct, updateUser, deleteProduct, updatePurchase, updateCollectionDay, updateCollectionRequest } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddDay, setShowAddDay] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', points: 0, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', category: '', stock: 0 });
  const [newDay, setNewDay] = useState({ jYear: '', jMonth: '', jDay: '', hour: '', minute: '', employeeId: '', area: '' });
  const [editEmployeeData, setEditEmployeeData] = useState({ name: '', phone: '', address: '' });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; productId: string | null }>({ isOpen: false, productId: null });
  const [cancelConfirm, setCancelConfirm] = useState<{ isOpen: boolean; requestId: string | null }>({ isOpen: false, requestId: null });
  const [usersPage, setUsersPage] = useState(1);
  const [recordsPage, setRecordsPage] = useState(1);
  const { showToast } = useToast();

  const ITEMS_PER_PAGE = 10;

  if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/login" />;

  const employees = users.filter((u) => u.role === 'employee');
  const regularUsers = users.filter((u) => u.role === 'user');
  const totalPointsAwarded = collectionRecords.reduce((sum, r) => sum + r.pointsAwarded, 0);
  const totalWasteCollected = collectionRecords.reduce((sum, r) => sum + r.weight, 0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct, newProduct);
      setEditingProduct(null);
    } else {
      addProduct(newProduct);
    }
    setNewProduct({ name: '', description: '', points: 0, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', category: '', stock: 0 });
    setShowAddProduct(false);
  };

  const handleEditProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setNewProduct({
        name: product.name,
        description: product.description,
        points: product.points,
        image: product.image,
        category: product.category,
        stock: product.stock,
      });
      setEditingProduct(productId);
      setShowAddProduct(true);
    }
  };

  const handleEditDay = (dayId: string) => {
    const day = collectionDays.find((d) => d.id === dayId);
    if (day) {
      // Parse date format: "1403/01/25 - 09:00"
      const [datePart, timePart] = day.date.split(' - ');
      const [jYear, jMonth, jDay] = datePart.split('/');
      const [hour, minute] = timePart.split(':');
      setNewDay({ jYear, jMonth, jDay, hour, minute, employeeId: day.employeeId, area: day.area });
      setEditingDay(dayId);
      setShowAddDay(true);
    }
  };

  const handleUpdateDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDay) {
      const emp = employees.find((emp) => emp.id === newDay.employeeId);
      if (emp && newDay.jYear && newDay.jMonth && newDay.jDay && newDay.hour && newDay.minute) {
        const jDate = `${newDay.jYear}/${newDay.jMonth.padStart(2, '0')}/${newDay.jDay.padStart(2, '0')} - ${newDay.hour}:${newDay.minute}`;
        updateCollectionDay(editingDay, { date: jDate, employeeId: emp.id, employeeName: emp.name, area: newDay.area });
        setEditingDay(null);
        setNewDay({ jYear: '', jMonth: '', jDay: '', hour: '', minute: '', employeeId: '', area: '' });
        setShowAddDay(false);
      }
    }
  };

  const handleEditEmployee = (employeeId: string) => {
    const employee = users.find((u) => u.id === employeeId);
    if (employee) {
      setEditEmployeeData({ name: employee.name, phone: employee.phone, address: employee.address });
      setEditingEmployee(employeeId);
    }
  };

  const handleUpdateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      updateUser(editingEmployee, editEmployeeData);
      setEditingEmployee(null);
      setEditEmployeeData({ name: '', phone: '', address: '' });
    }
  };

  const handleAddDay = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((emp) => emp.id === newDay.employeeId);
    if (emp && newDay.jYear && newDay.jMonth && newDay.jDay && newDay.hour && newDay.minute) {
      const jDate = `${newDay.jYear}/${newDay.jMonth.padStart(2, '0')}/${newDay.jDay.padStart(2, '0')} - ${newDay.hour}:${newDay.minute}`;
      if (editingDay) {
        handleUpdateDay(e);
      } else {
        addCollectionDay({ date: jDate, employeeId: emp.id, employeeName: emp.name, area: newDay.area, status: 'scheduled' });
        setNewDay({ jYear: '', jMonth: '', jDay: '', hour: '', minute: '', employeeId: '', area: '' });
        setShowAddDay(false);
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: LayoutDashboard },
    { id: 'requests', label: 'درخواست‌ها', icon: Bell },
    { id: 'users', label: 'کاربران', icon: Users },
    { id: 'employees', label: 'کارمندان', icon: UserCheck },
    { id: 'products', label: 'محصولات', icon: Package },
    { id: 'collections', label: 'زمان‌بندی', icon: Truck },
    { id: 'records', label: 'سوابق', icon: ClipboardList },
    { id: 'purchases', label: 'خریدها', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="lg:hidden fixed top-24 right-4 z-40 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className={`lg:w-72 bg-white shadow-xl lg:min-h-screen p-6 border-l border-gray-100 fixed lg:relative inset-y-0 right-0 z-50 transform transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}>
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
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileSidebarOpen(false);
                }}
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
        <main className="flex-1 p-6 lg:p-8 lg:mr-0 mr-0">
          {/* Breadcrumbs */}
          <Breadcrumbs items={[{ label: 'پنل مدیریت' }, { label: tabs.find(t => t.id === activeTab)?.label || '' }]} />
          
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
                            <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1"><Award className="w-3 h-3" />+{record.pointsAwarded}</span>
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
                            <span className="text-red-500 font-black text-sm bg-red-50 px-3 py-1 rounded-lg flex items-center gap-1"><TrendingUp className="w-3 h-3" />-{purchase.points}</span>
                          </div>
                        ))}
                        {purchases.length === 0 && <p className="text-gray-400 text-sm text-center py-4">خریدی ثبت نشده</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Requests */}
              {activeTab === 'requests' && (
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                    درخواست‌های جمع‌آوری
                    {collectionRequests.filter(r => r.status === 'pending').length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {collectionRequests.filter(r => r.status === 'pending').length} جدید
                      </span>
                    )}
                  </h2>
                  <div className="space-y-4">
                    {collectionRequests.map((request) => (
                      <div key={request.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                              <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{request.userName}</h3>
                              <p className="text-xs text-gray-500">{request.userPhone} | {request.userAddress}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
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

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-emerald-600" />
                              <span className="font-bold text-gray-700">محصول: {request.productName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-amber-500" />
                              <span className="text-gray-600">امتیاز مورد نیاز: <span className="font-bold">{request.requiredPoints}</span></span>
                            </div>
                          </div>
                          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <h4 className="text-sm font-bold text-emerald-700 mb-2">برنامه جمع‌آوری:</h4>
                            <div className="space-y-1">
                              {request.wastePlan.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">{item.wasteType}</span>
                                  <span className="font-bold text-emerald-600">{item.weight} کیلو</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {request.scheduledDate && (
                          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="font-bold text-blue-700">زمان جمع‌آوری:</span>
                            </div>
                            <p className="text-blue-800 font-black text-lg">{request.scheduledDate}</p>
                            {request.employeeName && (
                              <p className="text-blue-700 text-sm mt-1">کارمند: {request.employeeName}</p>
                            )}
                          </div>
                        )}

                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setCancelConfirm({ isOpen: true, requestId: request.id })}
                              className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition"
                            >
                              لغو
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {collectionRequests.length === 0 && (
                      <div className="bg-white rounded-2xl p-16 text-center shadow-lg">
                        <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">درخواستی ثبت نشده</p>
                      </div>
                    )}
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
                          {regularUsers.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE).map((user) => (
                            <tr key={user.id} className="border-t border-gray-50 hover:bg-emerald-50/30 transition">
                              <td className="p-4 font-bold text-gray-800">{user.name}</td>
                              <td className="p-4 text-gray-500 text-sm">{user.email}</td>
                              <td className="p-4 text-gray-500 text-sm">{user.phone}</td>
                              <td className="p-4">
                                <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-black border border-amber-100">
                                  <span className="flex items-center gap-1"><Award className="w-3 h-3" />{user.points}</span>
                                </span>
                              </td>
                              <td className="p-4 text-gray-500 text-sm">{user.createdAt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {regularUsers.length === 0 ? (
                      <EmptyState icon={Users} title="کاربری ثبت‌نام نکرده" />
                    ) : (
                      <Pagination
                        currentPage={usersPage}
                        totalPages={Math.ceil(regularUsers.length / ITEMS_PER_PAGE)}
                        onPageChange={setUsersPage}
                      />
                    )}
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
                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <UserCheck className="w-7 h-7 text-white" />
                              </div>
                              <div>
                                <h3 className="font-black text-gray-900">{emp.name}</h3>
                                <p className="text-sm text-gray-500">{emp.phone}</p>
                              </div>
                            </div>
                            <button onClick={() => handleEditEmployee(emp.id)} className="p-2 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition" title="ویرایش">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
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

                          {/* Edit Employee Modal */}
                          <AnimatePresence>
                            {editingEmployee === emp.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-4"
                              >
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                  <h4 className="font-bold text-gray-900 mb-3">ویرایش اطلاعات کارمند</h4>
                                  <form onSubmit={handleUpdateEmployee} className="space-y-3">
                                    <input
                                      type="text"
                                      placeholder="نام"
                                      value={editEmployeeData.name}
                                      onChange={(e) => setEditEmployeeData({ ...editEmployeeData, name: e.target.value })}
                                      className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition"
                                      required
                                    />
                                    <input
                                      type="text"
                                      placeholder="شماره تلفن"
                                      value={editEmployeeData.phone}
                                      onChange={(e) => setEditEmployeeData({ ...editEmployeeData, phone: e.target.value })}
                                      className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition"
                                      required
                                    />
                                    <input
                                      type="text"
                                      placeholder="آدرس"
                                      value={editEmployeeData.address}
                                      onChange={(e) => setEditEmployeeData({ ...editEmployeeData, address: e.target.value })}
                                      className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition"
                                      required
                                    />
                                    <div className="flex gap-2">
                                      <button type="submit" className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 transition">بروزرسانی</button>
                                      <button type="button" onClick={() => { setEditingEmployee(null); setEditEmployeeData({ name: '', phone: '', address: '' }); }} className="flex-1 border-2 border-gray-200 px-4 py-2 rounded-xl font-bold hover:bg-gray-50 transition">انصراف</button>
                                    </div>
                                  </form>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                          <h3 className="font-black text-gray-900 mb-4">{editingProduct ? 'ویرایش محصول' : 'محصول جدید'}</h3>
                          <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
                            <input type="text" placeholder="نام محصول" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <input type="text" placeholder="ایموجی" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" />
                            <input type="text" placeholder="دسته‌بندی" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <input type="number" placeholder="امتیاز" value={newProduct.points || ''} onChange={(e) => setNewProduct({ ...newProduct, points: parseInt(e.target.value) || 0 })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <input type="number" placeholder="موجودی" value={newProduct.stock || ''} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            <input type="text" placeholder="توضیحات" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" />
                            <div className="md:col-span-2 flex gap-3">
                              <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition">{editingProduct ? 'بروزرسانی' : 'ذخیره'}</button>
                              <button type="button" onClick={() => { setShowAddProduct(false); setEditingProduct(null); setNewProduct({ name: '', description: '', points: 0, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', category: '', stock: 0 }); }} className="border-2 border-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition">انصراف</button>
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
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => handleEditProduct(product.id)} className="p-2 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition" title="ویرایش">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => setDeleteConfirm({ isOpen: true, productId: product.id })} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition" title="حذف">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                          <h3 className="font-black text-gray-900 mb-4">{editingDay ? 'ویرایش روز جمع‌آوری' : 'تعیین روز جمع‌آوری جدید (تاریخ شمسی)'}</h3>
                          <form onSubmit={handleAddDay} className="space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">سال</label>
                                <input type="number" placeholder="۱۴۰۳" value={newDay.jYear} onChange={(e) => setNewDay({ ...newDay, jYear: e.target.value })} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required min="1400" max="1410" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">ماه</label>
                                <input type="number" placeholder="۱ تا ۱۲" value={newDay.jMonth} onChange={(e) => setNewDay({ ...newDay, jMonth: e.target.value })} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required min="1" max="12" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">روز</label>
                                <input type="number" placeholder="۱ تا ۳۱" value={newDay.jDay} onChange={(e) => setNewDay({ ...newDay, jDay: e.target.value })} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required min="1" max="31" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">ساعت</label>
                                <input type="number" placeholder="۰۹" value={newDay.hour} onChange={(e) => setNewDay({ ...newDay, hour: e.target.value })} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required min="0" max="23" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">دقیقه</label>
                                <input type="number" placeholder="۰۰" value={newDay.minute} onChange={(e) => setNewDay({ ...newDay, minute: e.target.value })} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required min="0" max="59" />
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <select value={newDay.employeeId} onChange={(e) => setNewDay({ ...newDay, employeeId: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required>
                                <option value="">انتخاب کارمند</option>
                                {employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}
                              </select>
                              <input type="text" placeholder="منطقه" value={newDay.area} onChange={(e) => setNewDay({ ...newDay, area: e.target.value })} className="border-2 border-gray-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none transition" required />
                            </div>
                            <div className="flex gap-3">
                              <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition">{editingDay ? 'بروزرسانی' : 'ذخیره'}</button>
                              <button type="button" onClick={() => { setShowAddDay(false); setEditingDay(null); setNewDay({ jYear: '', jMonth: '', jDay: '', hour: '', minute: '', employeeId: '', area: '' }); }} className="border-2 border-gray-200 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition">انصراف</button>
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
                                  {day.status === 'completed' ? 'انجام شده' : day.status === 'scheduled' ? 'برنامه‌ریزی شده' : 'لغو شده'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  <button onClick={() => handleEditDay(day.id)} className="p-2 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition" title="ویرایش">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  {day.status === 'scheduled' && (
                                    <>
                                      <button onClick={() => updateCollectionDay(day.id, { status: 'completed' })} className="p-2 rounded-lg text-emerald-500 hover:bg-emerald-50 transition" title="تکمیل"><Check className="w-4 h-4" /></button>
                                      <button onClick={() => updateCollectionDay(day.id, { status: 'cancelled' })} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition" title="لغو"><X className="w-4 h-4" /></button>
                                    </>
                                  )}
                                </div>
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
                          {collectionRecords.slice((recordsPage - 1) * ITEMS_PER_PAGE, recordsPage * ITEMS_PER_PAGE).map((record) => (
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
                    {collectionRecords.length === 0 ? (
                      <EmptyState icon={ClipboardList} title="رکوردی وجود ندارد" />
                    ) : (
                      <Pagination
                        currentPage={recordsPage}
                        totalPages={Math.ceil(collectionRecords.length / ITEMS_PER_PAGE)}
                        onPageChange={setRecordsPage}
                      />
                    )}
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

      {/* Delete Product Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, productId: null })}
        onConfirm={() => {
          if (deleteConfirm.productId) {
            deleteProduct(deleteConfirm.productId);
            showToast('محصول با موفقیت حذف شد', 'success');
          }
        }}
        title="حذف محصول"
        message="آیا از حذف این محصول مطمئن هستید؟ این عمل قابل بازگشت نیست."
        confirmText="حذف"
        cancelText="انصراف"
        type="danger"
      />

      {/* Cancel Request Confirmation */}
      <ConfirmDialog
        isOpen={cancelConfirm.isOpen}
        onClose={() => setCancelConfirm({ isOpen: false, requestId: null })}
        onConfirm={() => {
          if (cancelConfirm.requestId) {
            updateCollectionRequest(cancelConfirm.requestId, { status: 'cancelled' });
            showToast('درخواست لغو شد', 'success');
          }
        }}
        title="لغو درخواست"
        message="آیا از لغو این درخواست مطمئن هستید؟"
        confirmText="لغو درخواست"
        cancelText="انصراف"
        type="warning"
      />
    </div>
  );
}
