import './App.css';
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { setAuthToken } from './services/api';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const EventDetails = lazy(() => import('./pages/EventDetails.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const UserAuth = lazy(() => import('./pages/UserAuth.jsx'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  // Set token for admin or user globally on app load
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');
    if (adminToken) setAuthToken(adminToken);
    else if (userToken) setAuthToken(userToken);
  }, []);

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </main>

        <Footer />
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;
