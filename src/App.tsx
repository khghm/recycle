import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import HowItWorks from './pages/HowItWorks';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import UserDashboard from './pages/user/UserDashboard';

function AppRoutes() {
  const { currentUser } = useApp();
  const location = useLocation();
  const isDashboard = ['/admin', '/employee', '/user'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={currentUser ? <Navigate to={
            currentUser.role === 'admin' ? '/admin' :
            currentUser.role === 'employee' ? '/employee' : '/user'
          } /> : <Login />} />
          <Route path="/register" element={currentUser ? <Navigate to="/user" /> : <Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
