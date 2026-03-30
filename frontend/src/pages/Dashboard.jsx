import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Box, ClipboardList, TrendingUp, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBookings: 0,
    pendingBookings: 0,
    inquiriesToday: 0,
    activeChats: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stats');
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Welcome, Shopkeeper!</h1>
        <p className="text-slate-500 text-lg">Your AI Inventory Assistant is active and chatting with customers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <Zap className="bg-amber-100 text-amber-600 w-12 h-12 p-3 rounded-2xl" />
            <TrendingUp className="text-emerald-500 w-5 h-5" />
          </div>
          <p className="text-slate-500 text-sm font-medium">AI Inquiries Today</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stats.inquiriesToday}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <ClipboardList className="bg-primary/10 text-primary w-12 h-12 p-3 rounded-2xl" />
            <TrendingUp className="text-emerald-500 w-5 h-5" />
          </div>
          <p className="text-slate-500 text-sm font-medium">New Reservations</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stats.pendingBookings}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <Box className="bg-slate-100 text-slate-600 w-12 h-12 p-3 rounded-2xl" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Products</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stats.totalProducts}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
          <div className="flex justify-between items-start mb-4">
            <MessageCircle className="bg-emerald-100 text-emerald-600 w-12 h-12 p-3 rounded-2xl" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Active Chats</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stats.activeChats}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Quick Stock Scan</h2>
          <p className="text-slate-500 mb-6 leading-relaxed">View and manage your entire inventory collection. Keep stock updated so the AI can provide accurate responses to customers.</p>
          <Link to="/inventory" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
             <Box className="w-5 h-5" />
             <span>Manage Inventory</span>
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">Reservation Feed</h2>
          <p className="text-slate-500 mb-6 leading-relaxed">See which products customers have booked via WhatsApp. Confirm or cancel bookings as items are collected in-store.</p>
          <Link to="/bookings" className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-95">
             <ClipboardList className="w-5 h-5" />
             <span>View Bookings</span>
          </Link>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
        <div className="flex-1 space-y-4">
          <div className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2">Live AI Assistant</div>
          <h2 className="text-4xl font-extrabold tracking-tight">Auto-Pilot Mode Active</h2>
          <p className="text-slate-400 text-lg">Mistral AI is currently processing incoming messages from WhatsApp. It can book, check stock, and answer queries 24/7 without your intervention.</p>
          <div className="flex gap-4 pt-4">
            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition">View AI Logs</button>
            <button className="border border-white/20 px-6 py-3 rounded-xl font-bold hover:border-white/50 transition">Assistant Settings</button>
          </div>
        </div>
        <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl absolute bottom-0 right-0 -mb-20 -mr-20"></div>
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full max-w-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse"></div>
              <div className="bg-white/10 rounded-xl p-3 text-sm italic">"Customer: Does this come in Red?"</div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-primary rounded-xl p-3 text-sm">"AI: Yes, we have 5 units in Red (Size 10)!"</div>
              <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
