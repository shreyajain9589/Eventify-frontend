import './App.css'
import React from 'react'
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

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/events' element={<Events />} />
          <Route path='/events/:id' element={<EventDetails />} />
          <Route path='/checkout/:id' element={<Checkout />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/auth' element={<UserAuth />} />
          {/* Keep /login for legacy links */}
          <Route path='/login' element={<UserAuth />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App;
