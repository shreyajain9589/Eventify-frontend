import './App.css';
import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { setAuthToken } from './services/api';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

// Lazy loading pages
const Landing = lazy(() => import('./pages/Landing.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const EventDetails = lazy(() => import('./pages/EventDetails.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));
const UserAuth = lazy(() => import('./pages/UserAuth.jsx'));

// Page loader
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  const location = useLocation();

  // Hide navbar ONLY on admin login page
  const hideNavbarRoutes = ['/admin/login']; 
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Auto-set token once
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token');

    if (adminToken) setAuthToken(adminToken);
    else if (userToken) setAuthToken(userToken);
  }, []);

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">

        {/* Navbar only hidden on admin login */}
        {!shouldHideNavbar && <Navbar />}

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/checkout/:id" element={<Checkout />} />

                {/* ADMIN */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* USER AUTH */}
                <Route path="/auth" element={<UserAuth />} />
                <Route path="/login" element={<UserAuth />} />
              </Routes>
            </div>
          </Suspense>
        </main>

        {/* Footer hidden only on admin login page */}
        {!shouldHideNavbar && <Footer />}

        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;
