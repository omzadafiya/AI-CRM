import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Phone, Calendar, User, Package } from 'lucide-react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold text-slate-800">Customer Bookings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col space-y-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <User className="bg-primary/10 text-primary w-10 h-10 p-2 rounded-lg" />
                <div className="">
                  <p className="font-semibold text-slate-800 tracking-tight">{booking.customerPhone}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {booking.status}
              </span>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Package className="w-4 h-4" />
                <span>{booking.productId?.name} {booking.productId ? `(Qty: ${booking.quantity})` : '(Product not found)'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Expires: {new Date(booking.expiresAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <span>WhatsApp: {booking.customerPhone}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition">Confirm</button>
              <button className="flex-1 border border-slate-200 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition text-slate-600">Cancel</button>
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center p-10 text-slate-500">Loading bookings...</p>}
      {!loading && bookings.length === 0 && <p className="text-center p-10 text-slate-500">No active bookings. AI is waiting for customers!</p>}
    </div>
  );
};

export default Bookings;
