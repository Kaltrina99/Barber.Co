/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';
import { Search, Calendar, Clock, DollarSign, Scissors, X, AlertTriangle } from 'lucide-react';

interface UpcomingBookingsProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
}

export default function UpcomingBookings({ appointments, onCancelAppointment }: UpcomingBookingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Perform search matching either name, email, or telephone string
  const foundAppointments = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return appointments.filter(apt => 
      apt.clientPhone.toLowerCase().includes(query) ||
      apt.clientEmail.toLowerCase().includes(query) ||
      apt.clientName.toLowerCase().includes(query)
    );
  }, [searchQuery, appointments]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="py-20 bg-[#0a0a0a] text-[#e0e0e0] min-h-[500px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title & Explainer */}
        <div className="text-center space-y-3 font-sans">
          <h2 className="font-serif text-3xl font-extrabold text-white">
            Manage Your Bookings
          </h2>
          <p className="max-w-md mx-auto text-gray-400 text-sm font-sans font-light">
            Need to reschedule or check details? Enter your name, email, or telephone number to locate your active appointments.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white/[0.01] border border-white/10 p-6 rounded-2xl shadow-lg max-w-xl mx-auto gold-glow">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Enter Name, Email, or Phone Number"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHasSearched(false);
                }}
                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 focus:outline-none focus:border-amber-500 rounded-lg text-sm transition-all text-gray-200"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-sm transition cursor-pointer"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Search Results Display */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {hasSearched && searchQuery.trim() && foundAppointments.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-mono tracking-wider text-amber-500 uppercase">
                FOUND {foundAppointments.length} RESERVATION{foundAppointments.length > 1 ? 'S' : ''}
              </p>
              
              <div className="space-y-4">
                {foundAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`border rounded-xl p-5 relative overflow-hidden transition ${
                      apt.status === 'cancelled'
                        ? 'bg-black/40 border-white/5 opacity-60'
                        : 'bg-white/[0.02] border-white/10 shadow gold-glow-hover'
                    }`}
                  >
                    {/* Status indicator ribbon */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                      apt.status === 'booked' ? 'bg-amber-500' : 'bg-red-500/50'
                    }`} />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Appointment Details */}
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#0a0a0a] border border-white/10 text-gray-300">
                            ID: {apt.id}
                          </span>
                          {apt.status === 'cancelled' ? (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-red-950/20 text-red-500 border border-red-500/10">
                              Cancelled
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/20 text-emerald-400 border border-emerald-500/10">
                              Confirmed
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-serif text-lg font-bold text-white flex items-center gap-1.5 leading-none">
                            <Scissors className="w-4 h-4 text-amber-500" /> {apt.serviceName}
                          </h4>
                          <p className="text-xs text-gray-400 font-sans mt-0.5">
                            Barber Stylist: <span className="text-white font-medium">{apt.barberName}</span>
                          </p>
                        </div>

                        {/* Date & Time display */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                          <span className="flex items-center gap-1.5 text-gray-300">
                            <Calendar className="w-3.5 h-3.5 text-amber-500/80" /> {apt.date}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-300">
                            <Clock className="w-3.5 h-3.5 text-amber-500/80" /> {apt.time}
                          </span>
                          <span className="flex items-center gap-0.5 text-amber-400 font-bold font-serif">
                            ${apt.servicePrice}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      {apt.status === 'booked' && (
                        <div>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this booking? This slot will immediately open for other clients.')) {
                                onCancelAppointment(apt.id);
                              }
                            }}
                            className="w-full sm:w-auto px-4 py-2 hover:bg-red-950/25 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Cancel Session
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasSearched && searchQuery.trim() && foundAppointments.length === 0 && (
            <div className="bg-amber-500/5 border border-amber-500/10 p-8 rounded-xl text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-serif font-semibold text-white">No active appointments found</h4>
              <p className="text-xs text-gray-400">
                Double-check the spelling, email, or telephone number entered. (Tip: Try search term 'Alex' or '555-0199' to test with initial data.)
              </p>
            </div>
          )}

          {!searchQuery.trim() && hasSearched && (
            <p className="text-center text-xs text-gray-500">
              Please input an identifier in the field above to search.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
