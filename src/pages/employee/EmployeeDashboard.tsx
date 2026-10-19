import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const { currentUser, users, collectionDays, collectionRecords, addCollectionRecord } = useApp();
  const [activeTab, setActiveTab] = useState('schedule');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    userId: '',
    wasteType: 'پلاستیک',
    weight: 0,
    pointsAwarded: 0,
  });
  const [message, setMessage] = useState('');

  if (!currentUser || currentUser.role !== 'employee') {
    return <Navigate to="/login" />;
  }

  const regularUsers = users.filter((u) => u.role === 'user');
  const myDays = collectionDays.filter((d) => d.employeeId === currentUser.id);
  const myRecords = collectionRecords.filter((r) => r.employeeId === currentUser.id);
  const totalPointsGiven = myRecords.reduce((sum, r) => sum + r.pointsAwarded, 0);
  const totalWeight = myRecords.reduce((sum, r) => sum + r.weight, 0);

  const pointsPerKg: Record<string, number> = {
    'پلاستیک': 40,
    'کاغذ': 50,
    'شیشه': 50,
    'فلزات': 60,
    'پارچه': 30,
    'الکترونیک': 100,
  };

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
      userId: newRecord.userId,
      userName: user.name,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      wasteType: newRecord.wasteType,
      weight: newRecord.weight,
      pointsAwarded: newRecord.pointsAwarded,
      status: 'completed',
    });

    setMessage(`امتیاز ${newRecord.pointsAwarded} برای ${user.name} ثبت شد ✅`);
    setNewRecord({ userId: '', wasteType: 'پلاستیک', weight: 0, pointsAwarded: 0 });
    setShowAddRecord(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'schedule', label: 'برنامه کاری', icon: 'fas fa-calendar-alt' },
    { id: 'collect', label: 'ثبت جمع‌آوری', icon: 'fas fa-plus-circle' },
    { id: 'records', label: 'سوابق من', icon: 'fas fa-clipboard-list' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Message */}
      {message && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-bold">
          {message}
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gradient-to-l from-green-600 to-emerald-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-user-tie text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black">{currentUser.name}</h1>
              <p className="opacity-80">کارمند جمع‌آوری زباله</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black">{myRecords.length}</p>
              <p className="text-xs opacity-80">جمع‌آوری انجام شده</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black">{totalWeight} کیلو</p>
              <p className="text-xs opacity-80">وزن کل</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black">{totalPointsGiven}</p>
              <p className="text-xs opacity-80">امتیاز توزیع شده</p>
            </div>
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

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-calendar-alt text-green-600 ml-2"></i>
              برنامه کاری شما
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {myDays.map((day) => (
                <div key={day.id} className={`bg-white rounded-xl p-5 shadow-sm border-r-4 ${
                  day.status === 'completed' ? 'border-green-500' :
                  day.status === 'scheduled' ? 'border-blue-500' : 'border-red-500'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-800">{day.date}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      day.status === 'completed' ? 'bg-green-100 text-green-700' :
                      day.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {day.status === 'completed' ? '✅ انجام شده' : day.status === 'scheduled' ? '📅 برنامه‌ریزی شده' : '❌ لغو شده'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <i className="fas fa-map-marker-alt text-green-500"></i>
                    <span>{day.area}</span>
                  </div>
                </div>
              ))}
            </div>
            {myDays.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">هنوز روزی برای شما تعیین نشده است</p>
              </div>
            )}
          </div>
        )}

        {/* Collect Tab */}
        {activeTab === 'collect' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                <i className="fas fa-plus-circle text-green-600 ml-2"></i>
                ثبت جمع‌آوری زباله
              </h2>
              <button
                onClick={() => setShowAddRecord(!showAddRecord)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
              >
                <i className={`fas fa-${showAddRecord ? 'minus' : 'plus'} ml-2`}></i>
                {showAddRecord ? 'بستن' : 'ثبت جدید'}
              </button>
            </div>

            {showAddRecord && (
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <form onSubmit={handleSubmitRecord} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">انتخاب کاربر</label>
                    <select
                      value={newRecord.userId}
                      onChange={(e) => setNewRecord({ ...newRecord, userId: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      required
                    >
                      <option value="">کاربر را انتخاب کنید</option>
                      {regularUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">نوع زباله</label>
                      <select
                        value={newRecord.wasteType}
                        onChange={(e) => handleWasteTypeChange(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                      >
                        {Object.keys(pointsPerKg).map((type) => (
                          <option key={type} value={type}>{type} ({pointsPerKg[type]} امتیاز/کیلو)</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">وزن (کیلوگرم)</label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={newRecord.weight || ''}
                        onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
                        className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-gray-600 text-sm">امتیاز محاسبه شده:</p>
                    <p className="text-3xl font-black text-green-600">{newRecord.pointsAwarded} ⭐</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                  >
                    <i className="fas fa-check ml-2"></i>
                    ثبت و اعطای امتیاز
                  </button>
                </form>
              </div>
            )}

            {/* Points Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">جدول امتیاز هر نوع زباله</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(pointsPerKg).map(([type, points]) => (
                  <div key={type} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="font-bold text-gray-800">{type}</p>
                    <p className="text-green-600 font-bold">{points} امتیاز/کیلو</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-clipboard-list text-green-600 ml-2"></i>
              سوابق جمع‌آوری شما
            </h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="text-right p-4 font-bold text-gray-700">کاربر</th>
                      <th className="text-right p-4 font-bold text-gray-700">تاریخ</th>
                      <th className="text-right p-4 font-bold text-gray-700">نوع</th>
                      <th className="text-right p-4 font-bold text-gray-700">وزن</th>
                      <th className="text-right p-4 font-bold text-gray-700">امتیاز</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRecords.map((record) => (
                      <tr key={record.id} className="border-t hover:bg-gray-50">
                        <td className="p-4 font-medium">{record.userName}</td>
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
              {myRecords.length === 0 && (
                <p className="p-8 text-center text-gray-500">هنوز جمع‌آوری ثبت نکرده‌اید</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
