/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ClientBookingFlow from './components/ClientBookingFlow';
import UserProfileSection from './components/UserProfileSection';
import BarberDashboard from './components/BarberDashboard';
import { Barber, Service, Appointment, UserProfile } from './types';
import { 
  getStoredBarbers, saveStoredBarbers, 
  getStoredServices, saveStoredServices, 
  getStoredAppointments, saveStoredAppointments,
  getStoredReviews, getLoggedInUser, saveLoggedInUser,
  getStoredUsers, saveStoredUsers
} from './data';
import { 
  Clock, MapPin, Phone, MessageSquare, Scissors, Star, 
  ShieldCheck, Award, HeartHandshake, CheckCircle2 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'booking' | 'profile' | 'barber'>('booking');
  
  // High-fidelity state synchronization with LocalStorage
  const [barbers, setBarbers] = useState<Barber[]>(getStoredBarbers());
  const [services, setServices] = useState<Service[]>(getStoredServices());
  const [appointments, setAppointments] = useState<Appointment[]>(getStoredAppointments());
  const [reviews] = useState(getStoredReviews());

  // User Session & Directory Management
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getLoggedInUser());
  const [users, setUsers] = useState<UserProfile[]>(getStoredUsers());
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('barber_theme') || 'gold';
    }
    return 'gold';
  });

  const handleUpdateTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('barber_theme', newTheme);
  };

  const handleAddService = (newService: Service) => {
    setServices(prev => {
      const updated = [...prev, newService];
      saveStoredServices(updated);
      return updated;
    });
  };

  const handleUpdateService = (updatedService: Service) => {
    setServices(prev => {
      const updated = prev.map(s => s.id === updatedService.id ? updatedService : s);
      saveStoredServices(updated);
      return updated;
    });
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== serviceId);
      saveStoredServices(updated);
      return updated;
    });
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUsers(prev => {
      const updated = prev.map(u => u.email.toLowerCase() === updatedUser.email.toLowerCase() ? updatedUser : u);
      if (!prev.some(u => u.email.toLowerCase() === updatedUser.email.toLowerCase())) {
        updated.push(updatedUser);
      }
      saveStoredUsers(updated);
      return updated;
    });
    if (currentUser && currentUser.email.toLowerCase() === updatedUser.email.toLowerCase()) {
      setCurrentUser(updatedUser);
      saveLoggedInUser(updatedUser);
    }
  };

  const handleDeleteUser = (email: string) => {
    setUsers(prev => {
      const updated = prev.filter(u => u.email.toLowerCase() !== email.toLowerCase());
      saveStoredUsers(updated);
      return updated;
    });
    if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      setCurrentUser(null);
      saveLoggedInUser(null);
      setActiveTab('booking');
    }
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    saveLoggedInUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveLoggedInUser(null);
    setActiveTab('booking');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === updatedProfile.email.toLowerCase());
    if (idx !== -1) {
      users[idx] = updatedProfile;
    } else {
      users.push(updatedProfile);
    }
    saveStoredUsers(users);

    setCurrentUser(updatedProfile);
    saveLoggedInUser(updatedProfile);
  };

  // Watchers to trigger immediate updates to client booking forms from the dashboard
  useEffect(() => {
    saveStoredBarbers(barbers);
  }, [barbers]);

  useEffect(() => {
    saveStoredServices(services);
  }, [services]);

  useEffect(() => {
    saveStoredAppointments(appointments);
  }, [appointments]);

  // Appointment Actions
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  const handleCancelAppointment = (aptId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === aptId ? { ...apt, status: 'cancelled' } : apt
    ));
  };

  const handleUpdateAppointmentStatus = (aptId: string, status: 'pending' | 'booked' | 'completed' | 'cancelled') => {
    setAppointments(prev => prev.map(apt => 
      apt.id === aptId ? { ...apt, status } : apt
    ));
  };

  const handleUpdateAppointment = (updatedApt: Appointment) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === updatedApt.id ? updatedApt : apt
    ));
  };

  const handleUpdateBarber = (updatedBarber: Barber) => {
    setBarbers(prev => prev.map(b => b.id === updatedBarber.id ? updatedBarber : b));
  };

  const handleAddBarber = (newBarber: Barber) => {
    setBarbers(prev => [...prev, newBarber]);
  };

  // Safe smooth navigation scroll
  const handleScrollToBooking = () => {
    const el = document.getElementById('booking-portal-root');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Prime Header navigation */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} currentUser={currentUser} />

      <main className="flex-grow">
        {activeTab === 'booking' && (
          <div className="animate-fade-in" id="landing-page-root">
            {/* 1. Cinematic Hero Slider */}
            <HeroSection onBookNowClick={handleScrollToBooking} />

            {/* 2. Value Propositions Segment */}
            <section className="py-16 bg-[#0a0a0a] border-y border-white/5" id="shop-philosophy">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left font-sans">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 gold-glow-hover transition-all duration-300">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg w-12 h-12 flex items-center justify-center mx-auto sm:mx-0">
                      <Scissors className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wide">Elite Scissorcraft</h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                      No shortcuts. Every trim and skin fade is custom built to balance bone structure and natural hair movement.
                    </p>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 gold-glow-hover transition-all duration-300">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg w-12 h-12 flex items-center justify-center mx-auto sm:mx-0">
                      <Clock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wide">Punctual & Disciplined</h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                      We value your time. No endless waiting rooms. Our digital workspace lets you choose your desk hour with zero overlap.
                    </p>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 gold-glow-hover transition-all duration-300">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg w-12 h-12 flex items-center justify-center mx-auto sm:mx-0">
                      <Award className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wide">Premium Sanitization</h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                      High standards of salon cleanliness. Triple sanitizing fluids, organic peppermint towels, and disposable shaving blades.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Team Profiles Showroom */}
            <section className="py-20 bg-gradient-to-b from-[#0a0a0a] to-[#050505]" id="barbers-showcase">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center space-y-3 mb-12">
                  <span className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs tracking-widest uppercase">
                    THE STYLING GUILD
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                    Meet the Masters of Grooming
                  </h2>
                  <p className="max-w-md mx-auto text-gray-400 text-xs sm:text-sm font-light">
                    Every barber represents years of rigorous training, master-level straight razor precision, and customer styling care.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {barbers.map((barber) => (
                    <div 
                      key={barber.id} 
                      className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-amber-500/40 relative group transition duration-300 gold-glow-hover"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={barber.avatar} 
                            referrerPolicy="no-referrer"
                            alt={barber.name} 
                            className="w-16 h-16 rounded-full object-cover border border-amber-500/20 shadow-lg object-top" 
                          />
                          <div>
                            <h3 className="font-serif font-bold text-white text-lg leading-tight group-hover:text-amber-400 transition">
                              {barber.name}
                            </h3>
                            <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest block">{barber.role}</span>
                            
                            <div className="flex items-center mt-1 text-xs gap-1">
                              <span className="text-amber-400 font-bold leading-none">★ {barber.rating}</span>
                              <span className="text-gray-500">({barber.reviewsCount} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed font-light">
                          {barber.bio}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-850/60 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-gray-500">AVAILABLE TODAY</span>
                        <button
                          onClick={handleScrollToBooking}
                          className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 uppercase transition"
                        >
                          Book Slot →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Luxury Price Menu & Tariff Cards */}
            <section className="py-20 bg-[#050505] border-t border-white/5" id="services-section">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center space-y-3 mb-12">
                  <span className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs tracking-widest uppercase">
                    SERVICE MENU & TARIFFS
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                    Traditional Treaties & Combos
                  </h2>
                  <p className="max-w-md mx-auto text-gray-400 text-xs sm:text-sm font-light">
                    Clear transparent pricing. Each treatment incorporates signature hot organic wash oils and hydrating skin prep.
                  </p>
                </div>

                {/* Styled Menu Grid with Relational Barber Qualification Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {services.map((service) => {
                    const qualifyingBarbers = barbers.filter((b) => b.services.includes(service.id));
                    
                    return (
                      <div 
                        key={service.id} 
                        className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/30 hover:shadow-lg transition duration-300 gold-glow-hover"
                      >
                        <div className="space-y-4">
                          {/* Upper row */}
                          <div className="flex justify-between items-start gap-3">
                            <div className="space-y-1">
                              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                                {service.category}
                              </span>
                              <h4 className="font-serif text-base font-bold text-white tracking-wide">
                                {service.name}
                              </h4>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-lg font-serif font-bold text-amber-400 block">${service.price}</span>
                              <span className="text-[10px] font-mono text-gray-500">{service.duration} mins</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-400 leading-relaxed font-sans font-light">
                            {service.description}
                          </p>

                          {/* Dynamic Barber Relational List & Bios */}
                          <div className="pt-3 border-t border-white/5 space-y-2">
                            <span className="text-[9px] font-mono tracking-widest text-amber-500/80 uppercase block font-semibold">
                              EXPERTS QUALIFIED FOR THIS TREATMENT:
                            </span>
                            <div className="grid grid-cols-1 gap-2">
                              {qualifyingBarbers.map((barber) => (
                                <div key={barber.id} className="flex items-start gap-3 bg-black/40 p-2.5 border border-white/5 rounded-xl">
                                  <img 
                                    src={barber.avatar} 
                                    referrerPolicy="no-referrer"
                                    alt={barber.name} 
                                    className="w-10 h-10 object-cover object-top rounded-full border border-white/10" 
                                  />
                                  <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between gap-1 leading-none mb-1">
                                      <span className="text-xs text-white font-bold block truncate font-serif">
                                        {barber.name}
                                      </span>
                                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                                        ★ {barber.rating}
                                      </span>
                                    </div>
                                    <p className="text-[9px] font-mono text-[#a0a0a0] uppercase tracking-wider leading-none">
                                      Specialist: {barber.role}
                                    </p>
                                    <p className="text-[11px] text-gray-400 font-light leading-relaxed mt-1">
                                      {barber.bio}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-2 flex justify-end">
                          <button
                            onClick={handleScrollToBooking}
                            className="px-4 py-1.5 rounded-lg border border-gray-800 text-gray-300 hover:text-white hover:border-amber-500/40 hover:bg-amber-600/5 text-xs font-mono font-medium tracking-wide transition uppercase cursor-pointer"
                          >
                            Book Treatment
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
 
             {/* 5. Client Testimonials Slider */}
             <section className="py-16 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5" id="reviews-slider">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 
                 <div className="text-center space-y-2 mb-10">
                   <h3 className="font-serif text-2xl font-bold text-white">Gentlemen's Agreements</h3>
                   <p className="text-xs text-gray-400 font-sans font-light">Direct extracts from our verified visitor record book.</p>
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                   {reviews.map((review) => (
                     <div key={review.id} className="bg-white/[0.01] border border-white/5 rounded-xl p-5 space-y-4 gold-glow-hover transition-all duration-300">
                       {/* Rating stars */}
                       <div className="flex gap-1">
                         {[1, 2, 3, 4, 5].map((s) => (
                           <Star key={s} className="w-4 h-4 text-amber-500 fill-amber-500" />
                         ))}
                       </div>
                       
                       <p className="text-xs text-gray-400 leading-relaxed italic font-light">
                         "{review.comment}"
                       </p>
 
                       <div className="flex items-center justify-between text-[11px] font-mono border-t border-gray-850 pt-3 text-gray-500">
                         <span className="text-gray-300 font-medium font-sans">{review.clientName}</span>
                         <span>{review.date}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </section>
 
             {/* 6. Active Custom Scheduling Portal Wizard */}
             <ClientBookingFlow 
               barbers={barbers} 
               services={services} 
               appointments={appointments} 
               onAddAppointment={handleAddAppointment} 
               onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
               currentUser={currentUser}
             />
           </div>
         )}
 
         {/* Dynamic Guest Account Profile Dashboard */}
         {activeTab === 'profile' && (
           <UserProfileSection 
             currentUser={currentUser}
             onLogin={handleLogin}
             onLogout={handleLogout}
             onUpdateProfile={handleUpdateProfile}
             appointments={appointments}
             barbers={barbers}
             onCancelAppointment={handleCancelAppointment}
           />
         )}

        {/* Barber Workspace Portal */}
        {activeTab === 'barber' && (
          <BarberDashboard 
            barbers={barbers}
            services={services}
            appointments={appointments}
            onUpdateBarber={handleUpdateBarber}
            onAddBarber={handleAddBarber}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onUpdateAppointment={handleUpdateAppointment}
            currentUser={currentUser}
            onLogin={handleUpdateProfile}
             users={users}
             onUpdateUser={handleUpdateUser}
             onDeleteUser={handleDeleteUser}
             onAddService={handleAddService}
             onUpdateService={handleUpdateService}
             onDeleteService={handleDeleteService}
             currentTheme={theme}
             onUpdateTheme={handleUpdateTheme}
          />
        )}
      </main>

      {/* Traditional Clean Barber Co Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-12 text-gray-400 font-sans tracking-wide text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 items-start text-center sm:text-left">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <span className="font-serif text-lg font-bold tracking-widest text-[#e0e0e0] flex items-center justify-center sm:justify-start gap-2">
              <Scissors className="w-5 h-5 text-amber-500" /> BARBER&nbsp;CO
            </span>
            <p className="text-gray-400 font-light max-w-xs leading-relaxed leading-5">
              Providing premium haircuts, luxury shaves, and state-of-the-art scalp care under the banner of absolute convenience.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-gray-300 uppercase tracking-widest text-[11px]">BUSINESS HOURS</h4>
            <p className="text-gray-400 font-mono font-light">Monday — Friday: 09:00 - 18:00</p>
            <p className="text-gray-400 font-mono font-light">Saturdays: 10:00 - 16:00</p>
            <p className="text-amber-500 font-mono leading-none">Sundays: Closed for Rest</p>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-gray-300 uppercase tracking-widest text-[11px]">STUDIO LOCATION</h4>
            <p className="text-gray-400 font-light flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" /> 104 Piccadilly Circus, London, UK
            </p>
            <p className="text-gray-400 font-mono font-light flex items-center justify-center sm:justify-start gap-1.5">
              <Phone className="w-4 h-4 text-gray-500" /> +44 (20) 7946-0130
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-white/5 text-center text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Barber Co Ltd. Handcrafted Traditional Barber Shop. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-500 transition duration-150">Privacy Notice</a>
            <a href="#" className="hover:text-amber-500 transition duration-150">Terms of Registry</a>
            <a href="#" className="hover:text-amber-500 transition duration-150">Site License</a>
          </div>
        </div>
      </footer>

      {/* Dynamic Theme Stylesheet Override */}
      <style>{`
        :root {
          ${theme === 'emerald' ? `
            --color-amber-50: #EEFDF6;
            --color-amber-100: #D1FAE5;
            --color-amber-200: #A7F3D0;
            --color-amber-300: #6EE7B7;
            --color-amber-400: #34D399;
            --color-amber-500: #10B981;
            --color-amber-600: #059669;
            --color-amber-700: #047857;
            --color-amber-800: #065F46;
            --color-amber-900: #064E3B;
            --color-amber-950: #022C22;
            --color-slate-900: #052415;
            --color-slate-950: #03170d;
            
            --theme-glow: rgba(16, 185, 129, 0.15);
          ` : theme === 'slate' ? `
            --color-amber-50: #EFF6FF;
            --color-amber-100: #DBEAFE;
            --color-amber-200: #BFDBFE;
            --color-amber-300: #93C5FD;
            --color-amber-400: #60A5FA;
            --color-amber-500: #3B82F6;
            --color-amber-600: #2563EB;
            --color-amber-700: #1D4ED8;
            --color-amber-800: #1E40AF;
            --color-amber-900: #1E3A8A;
            --color-amber-950: #172554;
            --color-slate-900: #0f172a;
            --color-slate-950: #020617;
            
            --theme-glow: rgba(59, 130, 246, 0.15);
          ` : theme === 'crimson' ? `
            --color-amber-50: #FEF2F2;
            --color-amber-100: #FEE2E2;
            --color-amber-200: #FECACA;
            --color-amber-300: #FCA5A5;
            --color-amber-400: #F87171;
            --color-amber-500: #EF4444;
            --color-amber-600: #DC2626;
            --color-amber-700: #B91C1C;
            --color-amber-800: #991B1B;
            --color-amber-900: #7F1D1D;
            --color-amber-950: #450A0A;
            --color-slate-900: #240303;
            --color-slate-950: #110101;
            
            --theme-glow: rgba(239, 68, 68, 0.15);
          ` : theme === 'cyberpunk' ? `
            --color-amber-50: #FDF2F8;
            --color-amber-100: #FCE7F3;
            --color-amber-200: #FBCFE8;
            --color-amber-300: #F9A8D4;
            --color-amber-400: #F472B6;
            --color-amber-500: #EC4899;
            --color-amber-600: #DB2777;
            --color-amber-700: #BE185D;
            --color-amber-800: #9D174D;
            --color-amber-900: #831843;
            --color-amber-950: #500724;
            --color-slate-900: #160926;
            --color-slate-950: #090312;
            
            --theme-glow: rgba(236, 72, 153, 0.2);
          ` : `
            /* classic gold unchanged */
            --color-amber-50: #FAF8F2;
            --color-amber-100: #F4ECCF;
            --color-amber-200: #EADCA3;
            --color-amber-300: #DECA72;
            --color-amber-400: #C5A059;
            --color-amber-500: #C5A059;
            --color-amber-600: #B48E47;
            --color-amber-700: #9F7E3E;
            --color-amber-800: #7F6432;
            --color-amber-900: #5F4B25;
            --color-amber-950: #302613;
            --color-slate-900: #0d0d0d;
            --color-slate-950: #050505;
            
            --theme-glow: rgba(197, 160, 89, 0.1);
          `}
        }

        /* Body backgrounds override */
        body, .bg-\\[\\#050505\\], .bg-\\[\\#050505\\]\\/95, .min-h-screen {
          background-color: var(--color-slate-950) !important;
        }
        .bg-\\[\\#0a0a0a\\], .bg-\\[\\#0b0b0b\\], .bg-white\\/\\[0\\.01\\], .bg-white\\/\\[0\\.02\\] {
          background-color: var(--color-slate-900) !important;
        }
        ::selection {
          background-color: var(--color-amber-500) !important;
          color: var(--color-slate-950) !important;
        }
        .gold-glow {
          box-shadow: 0 0 20px var(--theme-glow) !important;
        }
        .gold-glow-hover:hover {
          box-shadow: 0 0 30px var(--theme-glow) !important;
          border-color: var(--color-amber-500) !important;
        }
        .gold-text-shimmer {
          background: linear-gradient(135deg, #FFF 0%, var(--color-amber-500) 50%, var(--color-amber-600) 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
      `}</style>

    </div>
  );
}
