import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  return (
    <section>
      <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white 
      rounded-lg p-12 mb-8">
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y:0, opacity:1 }} 
        transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4">
          Smart Event Booking Platform
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity:1 }} 
        transition={{ delay: 0.2 }} className="text-lg md:text-xl max-w-2xl">
          Browse events, secure tickets instantly, and get downloadable QR tickets. Beautiful animations and real-time seat updates.
        </motion.p>
        <div className="mt-6">
          <Link to="/events" className="bg-white text-indigo-600 px-5 py-2 rounded shadow mr-3">Browse Events</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 border rounded">
          <h3 className="font-semibold text-lg">About</h3>
          <p className="mt-2 text-sm">A modern booking experience with animated flows and admin management.</p>
        </div>
        <div className="p-6 border rounded">
          <h3 className="font-semibold text-lg">Speakers</h3>
          <p className="mt-2 text-sm">Add speaker grid and bios here (placeholder).</p>
        </div>
        <div className="p-6 border rounded">
          <h3 className="font-semibold text-lg">Partners</h3>
          <p className="mt-2 text-sm">Logos and partners carousel (soon).</p>
        </div>
      </div>
    </section>
  );
}
