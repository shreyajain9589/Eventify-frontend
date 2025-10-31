import './App.css';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx';
import Checkout from './pages/Checkout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Navbar from './components/Navbar.jsx';
import UserAuth from './pages/UserAuth.jsx';
import Footer from './components/Footer.jsx';
import { setAuthToken } from './services/api';

function App() {
  // Set token for admin or user globally on app load
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    if (adminToken) setAuthToken(adminToken);
    else if (userToken) setAuthToken(userToken);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/events' element={<Events />} />
          <Route path='/events/:id' element={<EventDetails />} />
          <Route path='/checkout/:id' element={<Checkout />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/auth' element={<UserAuth />} />
          <Route path='/login' element={<UserAuth />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
