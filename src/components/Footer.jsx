import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-6 shadow-lg mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Logo & Info */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-xl font-bold">Eventify</h2>
          <p className="text-sm text-indigo-100">© 2025 Eventify. All rights reserved.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-6 text-center md:text-right">
          <Link to="/events" className="hover:text-yellow-200 transition font-medium">
            Events
          </Link>
          <Link to="/auth" className="hover:text-yellow-200 transition font-medium">
            Login/Register
          </Link>
          <Link to="/" className="hover:text-yellow-200 transition font-medium">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
