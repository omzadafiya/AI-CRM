import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Box, ClipboardList, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <ShoppingBag className="w-8 h-8" />
          <span>ShopAI CRM</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-primary transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/inventory" className="flex items-center gap-1 text-slate-600 hover:text-primary transition-colors">
            <Box className="w-5 h-5" />
            <span>Inventory</span>
          </Link>
          <Link to="/bookings" className="flex items-center gap-1 text-slate-600 hover:text-primary transition-colors">
            <ClipboardList className="w-5 h-5" />
            <span>Bookings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
