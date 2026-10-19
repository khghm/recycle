import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, PlusCircle, ClipboardList, UserCheck, Scale, Award, Package, Check, X, MapPin } from 'lucide-react';

export default function EmployeeDashboard() {
  const { currentUser, users, collectionDays, collectionRecords, addCollectionRecord } = useApp();
  const [activeTab, setActiveTab] = useState('schedule');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({ userId: '', wasteType: 'پلاستیک', weight: 0, pointsAwarded: 0 });
  const [message, setMessage] = useState('');

  if (!currentUser || currentUser.role !== 'employee') return <Navigate to="/login" />;

  const regularUsers = users.filter((u) => u.role === 'user');
  const myDays = collectionDays.filter((d) => d.employeeId === currentUser.id);
  const myRecords = collectionRecords.filter((r) => r.employeeId === currentUser.id);
  const totalPointsGiven = myRecords.reduce((sum, r) => sum + r.pointsAwarded, 0);
  const totalWeight = myRecords.reduce((sum, r) => sum + r.weight, 0);

  const pointsPerKg: Record<string, number> = { 'پلاستیک': 40, 'کاغذ': 50, 'شیشه': 50, 'فلزات': 60, 'پارچه': 30, 'الکترونیک': 100 };

  const handleWasteTypeChange = (type: string) => {
    const points = Math.round(newRecord.weight * (pointsPerKg[type] || 40));
    setNewRecord({ ...newRecord, wasteType: type, pointsAwarded: points });
  };

  const handleWeightChange = (weight: number) => {
    const points = Math.round(weight * (pointsPerKg[newRecord.wasteType] || 40));
    setNewRecord({ ...newRecord, weight, pointsAwarded: points });
  };

  const handleSubmitRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.id === newRecord.userId);
    if (!user) return;
    addCollectionRecord({
      userId: newRecord.userId, userName: user.name, employeeId: currentUser.id,
      employeeName: currentUser.name, date: new Date().toISOString().split('T')[0],
      wasteType: newRecord.wasteType, weight: newRecord.weight, pointsAwarded: newRecord.pointsAwarded, status: 'completed',
    });
    setMessage(`امتیاز ${newRecord.pointsAwarded} برای ${user.name} ثبت شد`);
    setNewRecord({ userId: '', wasteType: 'پلاستیک', weight: 0, pointsAwarded: 0 });
    setShowAddRecord(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'schedule', label: 'برنامه کاری', icon: Calendar },
    { id: 'collect', label: 'ثبت جمع‌آوری', icon: PlusCircle },
    { id: 'records', label: 'سوابق من', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-bl from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-8 mb-8 text-white"
        >
          <div className="absolute inset-0 noise"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-18 h-18 bg-white/15 rounded-2xl flex items-center justify-center p-4 backdrop-blur-sm">
                <UserCheck className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-black">{currentUser.name}</h1>
                <p className="text-white/70">کارمند جمع‌آوری زباله</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: myRecords.length, label: 'جمع‌آوری', icon: Package },
                { value: `${totalWeight} کیلو`, label: 'وزن کل', icon: Scale },
                { value: totalPointsGiven, label: 'امتیاز داده', icon: Award },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-white/70" />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

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

        {/* Schedule */}
        {activeTab === 'schedule' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              برنامه کاری شما
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {myDays.map((day) => (
                <div key={day.id} className={`bg-white rounded-2xl p-6 shadow-lg border-r-4 card-hover ${
                  day.status === 'completed' ? 'border-emerald-500' :
                  day.status === 'scheduled' ? 'border-blue-500' : 'border-red-500'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-black text-gray-900">{day.date}</span>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      day.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                      day.status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {day.status === 'completed' ? 'انجام شده' : day.status === 'scheduled' ? 'برنامه‌ریزی شده' : 'لغو شده'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{day.area}</span>
                  </div>
                </div>
              ))}
            </div>
            {myDays.length === 0 && (
              <div className="bg-white rounded-2xl p-16 text-center shadow-lg">
                <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">هنوز روزی برای شما تعیین نشده</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Collect */}
        {activeTab === 'collect' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                ثبت جمع‌آوری زباله
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddRecord(!showAddRecord)}
                className="flex items-center gap-2 bg-gradient-to-l from-emerald-500 to-green-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
              >
                {showAddRecord ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                {showAddRecord ? 'بستن' : 'ثبت جدید'}
              </motion.button>
            </div>

            <AnimatePresence>
              {showAddRecord && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <form onSubmit={handleSubmitRecord} className="space-y-5">
                      <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm">انتخاب کاربر</label>
                        <select value={newRecord.userId} onChange={(e) => setNewRecord({ ...newRecord, userId: e.target.value })} className="w-full border-2 border-gray-100 rounded-xl p-3.5 focus:border-emerald-500 focus:outline-none transition" required>
                          <option value="">کاربر را انتخاب کنید</option>
                          {regularUsers.map((user) => (<option key={user.id} value={user.id}>{user.name} - {user.phone}</option>))}
                        </select>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-bold mb-2 text-sm">نوع زباله</label>
                          <select value={newRecord.wasteType} onChange={(e) => handleWasteTypeChange(e.target.value)} className="w-full border-2 border-gray-100 rounded-xl p-3.5 focus:border-emerald-500 focus:outline-none transition">
                            {Object.keys(pointsPerKg).map((type) => (<option key={type} value={type}>{type} ({pointsPerKg[type]} امتیاز/کیلو)</option>))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-700 font-bold mb-2 text-sm">وزن (کیلوگرم)</label>
                          <input type="number" min="0.1" step="0.1" value={newRecord.weight || ''} onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)} className="w-full border-2 border-gray-100 rounded-xl p-3.5 focus:border-emerald-500 focus:outline-none transition" required />
                        </div>
                      </div>
                      <div className="bg-gradient-to-l from-emerald-50 to-green-50 rounded-2xl p-6 text-center border border-emerald-100">
                        <p className="text-gray-500 text-sm mb-1">امتیاز محاسبه شده:</p>
                        <p className="text-4xl font-black gradient-text">{newRecord.pointsAwarded}</p>
                        <p className="text-sm text-gray-500 mt-1">امتیاز</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-l from-emerald-500 to-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        ثبت و اعطای امتیاز
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4">جدول امتیاز هر نوع زباله</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(pointsPerKg).map(([type, points]) => (
                  <div key={type} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                    <p className="font-bold text-gray-800">{type}</p>
                    <p className="text-emerald-600 font-black text-lg">{points}</p>
                    <p className="text-[10px] text-gray-400">امتیاز/کیلو</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Records */}
        {activeTab === 'records' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-emerald-600" />
              سوابق جمع‌آوری شما
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-l from-emerald-50 to-green-50">
                    <tr>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">کاربر</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">تاریخ</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">نوع</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">وزن</th>
                      <th className="text-right p-4 font-bold text-gray-700 text-sm">امتیاز</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRecords.map((record) => (
                      <tr key={record.id} className="border-t border-gray-50 hover:bg-emerald-50/30 transition">
                        <td className="p-4 font-bold text-gray-800">{record.userName}</td>
                        <td className="p-4 text-gray-600">{record.date}</td>
                        <td className="p-4 text-gray-600">{record.wasteType}</td>
                        <td className="p-4 text-gray-600">{record.weight} کیلو</td>
                        <td className="p-4"><span className="text-emerald-600 font-black">+{record.pointsAwarded}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {myRecords.length === 0 && (
                <div className="p-16 text-center">
                  <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold">هنوز جمع‌آوری ثبت نکرده‌اید</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
