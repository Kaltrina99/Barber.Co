/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Barber, Service, Appointment, UserProfile } from '../types';
import { 
  User, Check, Clock, ChevronRight, ChevronLeft, Calendar as CalendarIcon, 
  Sparkles, DollarSign, CalendarCheck, Phone, Mail, Award, AlertCircle, ShieldCheck
} from 'lucide-react';

interface ClientBookingFlowProps {
  barbers: Barber[];
  services: Service[];
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointmentStatus: (id: string, status: 'pending' | 'booked' | 'completed' | 'cancelled') => void;
  // Trigger to scroll or open from external button
  bookingContainerId?: string;
  currentUser?: UserProfile | null;
}

export default function ClientBookingFlow({ 
  barbers, 
  services, 
  appointments, 
  onAddAppointment,
  onUpdateAppointmentStatus,
  bookingContainerId = 'booking-portal-root',
  currentUser = null
}: ClientBookingFlowProps) {
  
  // Multi-step form states:
  // Step 1: Barber Selection
  // Step 2: Service Selection (filtered by selected barber services)
  // Step 3: Date & Time Picker
  // Step 4: Client Info
  // Step 5: Success Receipt
  const [step, setStep] = useState<number>(1);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Client Form Details
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [bookingSuccessReceipt, setBookingSuccessReceipt] = useState<Appointment | null>(null);

  const isSuperAdmin = useMemo(() => {
    if (!currentUser || !currentUser.email) return false;
    return currentUser.email.toLowerCase() === 'kaltrina99a@gmail.com';
  }, [currentUser]);

  const isUserAdmin = useMemo(() => {
    if (!currentUser || !currentUser.email) return false;
    const emailLower = currentUser.email.toLowerCase();
    return emailLower === 'kaltrina99a@gmail.com' || emailLower.includes('google') || emailLower.includes('kale') || emailLower.includes('kaltrina') || emailLower.includes('kal');
  }, [currentUser]);

  // Month-view calendar selectors (May = 4, June = 5)
  const [calMonth, setCalMonth] = useState<number>(4);

  const calMonthName = useMemo(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[calMonth];
  }, [calMonth]);

  const monthWeeks = useMemo(() => {
    const calYear = 2026;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstWeekday = new Date(calYear, calMonth, 1).getDay();

    const cells = [];
    // Padding
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }
    // Real Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = d.toString().padStart(2, '0');
      const monthStr = (calMonth + 1).toString().padStart(2, '0');
      const yyyymmdd = `2026-${monthStr}-${dayStr}`;
      
      const dateVal = new Date(`${yyyymmdd}T00:00:00`);
      const isSunday = dateVal.getDay() === 0;
      
      const baseToday = new Date('2026-05-20T00:00:00');
      const maxFutureDate = new Date('2026-05-20T00:00:00');
      maxFutureDate.setDate(baseToday.getDate() + 13); // 13 further days (14 total)
      
      const isPast = dateVal < baseToday;
      const isTooFar = dateVal > maxFutureDate;
      const isSelectable = !isPast && !isTooFar && !isSunday;

      cells.push({
        dayNum: d,
        yyyymmdd,
        isSunday,
        isPast,
        isTooFar,
        isSelectable
      });
    }

    // Convert flat array to standard 2D week rows
    const weeksObj = [];
    let currentWeek = [];
    for (let i = 0; i < cells.length; i++) {
      currentWeek.push(cells[i]);
      if (currentWeek.length === 7) {
        weeksObj.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksObj.push(currentWeek);
    }
    return weeksObj;
  }, [calMonth]);

  // Prefill contact details if guest is logged in
  React.useEffect(() => {
    if (currentUser) {
      setClientName(currentUser.name);
      setClientEmail(currentUser.email);
      setClientPhone(currentUser.phone);
      if (currentUser.stylePreferences && !notes) {
        setNotes(currentUser.stylePreferences);
      }
    }
  }, [currentUser]);

  // Generate next 14 booking days starting from Today (excluding Sundays maybe, or showing all days)
  const availableDates = useMemo(() => {
    const dates = [];
    // Anchor current date to the provided local time: 2026-05-20
    const today = new Date('2026-05-20T10:35:09Z'); 
    
    for (let i = 0; i < 14; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      
      const dayOfWeek = nextDay.toLocaleDateString('en-US', { weekday: 'long' });
      const dayOfMonth = nextDay.getDate();
      const monthName = nextDay.toLocaleDateString('en-US', { month: 'short' });
      const yyyymmdd = nextDay.toISOString().split('T')[0];
      
      dates.push({
        weekday: dayOfWeek,
        dayOfMonth,
        monthName,
        yyyymmdd,
        isSunday: dayOfWeek === 'Sunday'
      });
    }
    return dates;
  }, []);

  // Set default date to today or first available non-Sunday
  useState(() => {
    const firstNonSunday = availableDates.find(d => !d.isSunday);
    if (firstNonSunday) {
      setSelectedDate(firstNonSunday.yyyymmdd);
    }
  });

  // Calculate dynamic slots for the selected Barber on the selected Date
  const availableTimeSlots = useMemo(() => {
    if (!selectedBarber) return [];
    
    // Barber hours: start and end
    const { start, end } = selectedBarber.workingHours;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const slots: string[] = [];
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const formattedHour = currentHour.toString().padStart(2, '0');
      const formattedMin = currentMin.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMin}`);
      
      // Advance by 30 minutes
      currentMin += 30;
      if (currentMin >= 60) {
        currentHour += 1;
        currentMin = 0;
      }
    }
    
    return slots;
  }, [selectedBarber]);

  // Find standard booked slots on selected barber on selected date to flag as taken
  const bookedSlots = useMemo(() => {
    if (!selectedBarber || !selectedDate) return new Set<string>();
    
    const matchedAppointments = appointments.filter(apt => 
      apt.barberId === selectedBarber.id && 
      apt.date === selectedDate && 
      (apt.status === 'booked' || apt.status === 'pending')
    );
    
    return new Set(matchedAppointments.map(apt => apt.time));
  }, [selectedBarber, selectedDate, appointments]);

  // Services offered by the active barber explicitly
  const filteredServices = useMemo(() => {
    if (!selectedBarber) return [];
    return services.filter(service => selectedBarber.services.includes(service.id));
  }, [selectedBarber, services]);

  // Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!clientName.trim()) errors.clientName = 'Full Name is required';
    if (!clientEmail.trim() || !/\S+@\S+\.\S+/.test(clientEmail)) errors.clientEmail = 'Please provide a valid email';
    if (!clientPhone.trim() || clientPhone.length < 5) errors.clientPhone = 'Valid contact phone is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) return;

    // Create unique ID
    const appointmentId = 'APT-' + Math.floor(100000 + Math.random() * 900000);

    const newAppointment: Appointment = {
      id: appointmentId,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      date: selectedDate,
      time: selectedTime,
      clientName,
      clientEmail,
      clientPhone,
      notes: notes.trim() || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
      clientUserEmail: currentUser ? currentUser.email : undefined
    };

    onAddAppointment(newAppointment);
    setBookingSuccessReceipt(newAppointment);
    setStep(5);
  };

  const restartBooking = () => {
    setSelectedBarber(null);
    setSelectedService(null);
    setSelectedTime('');
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');
    setFormErrors({});
    setBookingSuccessReceipt(null);
    setStep(1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <section id={bookingContainerId} className="py-20 bg-[#0a0a0a] text-[#e0e0e0] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator Panel */}
        {step < 5 && (
          <div className="mb-10 text-center" id="booking-header">
            <h2 className="font-serif text-3xl font-extrabold text-white tracking-tight">
              Design Your Experience
            </h2>
            <p className="mt-2 text-gray-400 font-sans text-sm font-light max-w-lg mx-auto">
              Follow our simple scheduling wizard to reserve your curated grooming session.
            </p>
            
            {/* Multi-step progress bar */}
            <div className="flex items-center justify-center mt-8 space-x-1 sm:space-x-4 max-w-md mx-auto" id="progress-indicator">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-semibold select-none border transition-all duration-300 ${
                    step === num
                      ? 'bg-amber-500 text-black border-amber-500 ring-4 ring-amber-500/10'
                      : step > num
                        ? 'bg-amber-600/20 text-amber-400 border-amber-500/35'
                        : 'bg-black/60 text-gray-500 border-white/5'
                  }`}>
                    {step > num ? <Check className="w-4.5 h-4.5" /> : num}
                  </span>
                  {num < 4 && (
                    <div className={`w-8 sm:w-16 h-0.5 ml-1 sm:ml-4 rounded transition-all duration-500 ${
                      step > num ? 'bg-amber-500/50' : 'bg-white/5'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Card Body container */}
        <div className="bg-white/[0.01] border border-white/10 rounded-2xl shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-between gold-glow" id="booking-wizard-card">
          
          <div className="p-6 sm:p-10 flex-grow">
            {/* STEP 1: SELECT BARBER */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in" id="step-1-container">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-serif font-bold text-white tracking-wide uppercase">
                    Select Your Stylist
                  </h3>
                  <p className="text-xs text-amber-500 font-mono tracking-wider">
                    EACH BRINGS UNIQUE MASTERY TO THE CHAIR
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4" id="barber-cards-grid">
                  {barbers.map((barber) => (
                    <div
                      key={barber.id}
                      onClick={() => {
                        setSelectedBarber(barber);
                        setSelectedService(null); // Reset service when barber changes
                        setStep(2);
                      }}
                      className={`group border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 relative duration-300 ${
                        selectedBarber?.id === barber.id
                          ? 'border-amber-500 bg-amber-600/5 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/35'
                          : 'border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.02]'
                      }`}
                      id={`barber-card-${barber.id}`}
                    >
                      {/* Barber Photo */}
                      <div className="h-56 relative overflow-hidden bg-black">
                        <img
                          src={barber.avatar}
                          referrerPolicy="no-referrer"
                          alt={barber.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-transparent" />
                        
                        <div className="absolute top-3 right-3 bg-black/80 border border-amber-500/30 px-2 py-1 rounded-md flex items-center gap-1.5 shadow-md">
                          <span className="text-[11px] font-mono text-amber-400 font-bold leading-none">
                            ★ {barber.rating}
                          </span>
                          <span className="text-[9px] text-gray-400 font-sans tracking-wide leading-none">
                            ({barber.reviewsCount})
                          </span>
                        </div>
                      </div>

                      {/* Barber Card Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="font-serif text-base font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors">
                            {barber.name}
                          </h4>
                          <span className="text-[11px] font-mono text-amber-500/90 uppercase tracking-widest">{barber.role}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-sans font-light line-clamp-3">
                          {barber.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SELECT SERVICE */}
            {step === 2 && selectedBarber && (
              <div className="space-y-6 animate-fade-in" id="step-2-container">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedBarber.avatar} 
                      referrerPolicy="no-referrer"
                      alt={selectedBarber.name} 
                      className="w-12 h-12 rounded-full object-cover border border-amber-500/40" 
                    />
                    <div>
                      <h4 className="text-sm font-serif font-bold text-white">{selectedBarber.name}</h4>
                      <p className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">{selectedBarber.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep(1)} 
                    className="text-xs text-gray-400 hover:text-amber-400 underline transition duration-150"
                  >
                    Change Stylist
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-base font-serif font-bold text-white tracking-wide uppercase">
                    Choose A Ritual
                  </h3>
                  <p className="text-xs text-gray-400">
                    Pricing and duration are adjusted automatically to ensure optimal finish
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1" id="services-choices-grid">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        setStep(3);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer hover:border-amber-500/50 hover:bg-white/[0.02] active:scale-[0.99] transition-all duration-150 ${
                        selectedService?.id === service.id
                          ? 'border-amber-500 bg-amber-600/5'
                          : 'border-white/5 bg-white/[0.01]'
                      }`}
                      id={`booking-service-${service.id}`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1.5 flex-grow">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                            {service.category}
                          </span>
                          <h4 className="font-serif text-sm font-bold text-white group-hover:text-amber-400">
                            {service.name}
                          </h4>
                          <p className="text-[12px] text-gray-400 font-sans font-light leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="block text-sm font-serif font-bold text-amber-400">${service.price}</span>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                            <Clock className="w-3 h-3" /> {service.duration}m
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredServices.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-500 italic">
                      No services currently listed for this barber. Please select another stylist.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: DATE & TIME SELECTOR */}
            {step === 3 && selectedBarber && selectedService && (
              <div className="space-y-6 animate-fade-in" id="step-3-container">
                {/* Compact Header Summary */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5 text-xs">
                  <div className="flex items-center space-x-2">
                    <img src={selectedBarber.avatar} referrerPolicy="no-referrer" alt="" className="w-8 h-8 rounded-full object-cover border border-amber-500/20" />
                    <div>
                      <span className="block text-white font-serif font-bold">{selectedBarber.name}</span>
                      <span className="text-[10px] text-gray-400">{selectedBarber.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-amber-400 font-bold">{selectedService.name}</span>
                    <span className="text-[10px] text-gray-400">${selectedService.price} • {selectedService.duration} min</span>
                  </div>
                  <button onClick={() => setStep(2)} className="text-gray-400 hover:text-amber-400 underline scrollbar-none">
                    Change Service
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-base font-serif font-bold text-white tracking-wide uppercase">
                    Select Day & Hour
                  </h3>
                  <p className="text-xs text-gray-400">
                    Showing available appointments over the next two weeks
                  </p>
                </div>

                {/* Interactive Monthly Grid Calendar */}
                 <div className="space-y-4">
                   <div className="flex items-center justify-between bg-black/40 px-3.5 py-2.5 border border-white/5 rounded-xl">
                     <label className="text-xs font-mono tracking-wider text-gray-400 flex items-center gap-1.5 uppercase font-semibold">
                       <CalendarIcon className="w-3.5 h-3.5 text-amber-500" /> Interactive Date Deck
                     </label>
                     
                     <div className="flex items-center gap-2">
                       <button
                         type="button"
                         disabled={calMonth === 4}
                         onClick={() => setCalMonth(4)}
                         className={`p-1.5 border border-white/5 rounded-lg transition ${
                           calMonth === 4 
                             ? 'opacity-20 cursor-not-allowed' 
                             : 'hover:bg-amber-500 hover:text-black cursor-pointer text-gray-400'
                         }`}
                       >
                         <ChevronLeft className="w-4 h-4" />
                       </button>
                       <span className="text-xs font-mono uppercase tracking-widest text-[#e0e0e0] font-bold min-w-[100px] text-center">
                         {calMonthName} 2026
                       </span>
                       <button
                         type="button"
                         disabled={calMonth === 5}
                         onClick={() => setCalMonth(5)}
                         className={`p-1.5 border border-white/5 rounded-lg transition ${
                           calMonth === 5 
                             ? 'opacity-20 cursor-not-allowed' 
                             : 'hover:bg-amber-500 hover:text-black cursor-pointer text-gray-400'
                         }`}
                       >
                         <ChevronRight className="w-4 h-4" />
                       </button>
                     </div>
                   </div>

                   {/* Grid Desk */}
                   <div className="bg-black/20 border border-white/5 p-4 rounded-xl space-y-3">
                     {/* Weekdays indicator */}
                     <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                       <span>Sun</span>
                       <span>Mon</span>
                       <span>Tue</span>
                       <span>Wed</span>
                       <span>Thu</span>
                       <span>Fri</span>
                       <span>Sat</span>
                     </div>

                     {/* Month Matrix */}
                     <div className="space-y-1">
                       {monthWeeks.map((week, wIdx) => (
                         <div key={wIdx} className="grid grid-cols-7 gap-1">
                           {week.map((cell, cIdx) => {
                             if (!cell) {
                               return <div key={`empty-${cIdx}`} className="aspect-square opacity-0" />;
                             }

                             const isSelected = selectedDate === cell.yyyymmdd;
                             
                             // Count appointments on this day for Admin visual highlights
                             const dayApts = appointments.filter(a => a.date === cell.yyyymmdd);
                             const pendingApts = dayApts.filter(a => a.status === 'pending');
                             const bookedApts = dayApts.filter(a => a.status === 'booked');
                             
                             return (
                               <button
                                 key={cell.yyyymmdd}
                                 type="button"
                                 disabled={!cell.isSelectable}
                                 onClick={() => {
                                   setSelectedDate(cell.yyyymmdd);
                                   setSelectedTime(''); // Reset selected time
                                 }}
                                 className={`aspect-square sm:p-2 flex flex-col items-center justify-center text-center rounded-lg select-none transition-all duration-150 relative cursor-pointer ${
                                   isSelected
                                     ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-lg shadow-amber-500/10 z-10 scale-105'
                                     : cell.isSunday
                                       ? 'bg-red-950/5 border border-red-950/10 text-red-650 opacity-30 cursor-not-allowed'
                                       : !cell.isSelectable
                                         ? 'opacity-20 text-gray-650 cursor-not-allowed text-[11px]'
                                         : 'border border-white/5 bg-black hover:border-amber-500/30 text-gray-200'
                                 }`}
                               >
                                 <span className="text-sm font-serif font-bold leading-none">
                                   {cell.dayNum}
                                 </span>
                                 {cell.isSunday ? (
                                   <span className="text-[7.5px] font-mono leading-none text-red-500 mt-0.5 uppercase tracking-tighter opacity-80 scale-90">
                                     Closed
                                   </span>
                                 ) : isUserAdmin && dayApts.length > 0 ? (
                                   <div className="flex gap-1 mt-1">
                                     {pendingApts.length > 0 && (
                                       <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse animate-bounce" title={`${pendingApts.length} pending`} />
                                     )}
                                     {bookedApts.length > 0 && (
                                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title={`${bookedApts.length} approved`} />
                                     )}
                                   </div>
                                 ) : cell.isSelectable && !isSelected ? (
                                   <span className="w-1 h-1 rounded-full bg-amber-500/60 mt-1 block" />
                                 ) : null}
                               </button>
                             );
                           })}
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Admin Calendar Action Deck */}
                   {isUserAdmin && selectedDate && (
                     <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-3 animate-fade-in text-left">
                       <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                           <h4 className="font-serif text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                             <ShieldCheck className="w-4 h-4 text-amber-500" /> Admin Calendar Dispatch Desk
                           </h4>
                         </div>
                         <span className="text-[10px] font-mono text-[#a0a0a0] uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                           Selected Date: {selectedDate}
                         </span>
                       </div>

                       {/* Appointments list for the selected date on any stylist */}
                       {appointments.filter(a => a.date === selectedDate).length === 0 ? (
                         <p className="text-gray-500 text-xs italic font-light font-sans py-1">
                           No customer reservations scheduled on {selectedDate}.
                         </p>
                       ) : (
                         <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                           {appointments
                             .filter(a => a.date === selectedDate)
                             .sort((a,b) => a.time.localeCompare(b.time))
                             .map((apt) => (
                               <div 
                                 key={apt.id} 
                                 className="bg-black/80 border border-white/5 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                               >
                                 <div className="space-y-1">
                                   <div className="flex items-center gap-2 flex-wrap">
                                     <span className="font-mono text-amber-400 font-bold">{apt.time}</span>
                                     <span className="text-[#808080] font-mono text-[10px]">ID: {apt.id}</span>
                                     <span className="text-[10px] font-mono font-semibold uppercase px-1 rounded bg-[#101010] text-[#a0a0a0]">
                                       Stylist: {apt.barberName}
                                     </span>
                                     {apt.status === 'pending' && (
                                       <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                                         PENDING
                                       </span>
                                     )}
                                     {apt.status === 'booked' && (
                                       <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                         APPROVED
                                       </span>
                                     )}
                                     {apt.status === 'completed' && (
                                       <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#013220]/20 border border-emerald-555/10 text-emerald-400">
                                         COMPLETED
                                       </span>
                                     )}
                                     {apt.status === 'cancelled' && (
                                       <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-red-500/10 border border-red-550/20 text-red-400">
                                         CANCELLED
                                       </span>
                                     )}
                                   </div>
                                   <div className="font-serif font-bold text-white text-sm">
                                     {apt.clientName}
                                   </div>
                                   <div className="text-[11px] text-[#b0b0b0]" style={{ wordBreak: 'break-all' }}>
                                     {apt.serviceName} (${apt.servicePrice}) • Phone: {apt.clientPhone}
                                   </div>
                                 </div>

                                 {/* Admin Calendar Action Buttons */}
                                 <div className="flex items-center gap-1.5 flex-shrink-0">
                                   {apt.status === 'pending' && (
                                     <button
                                       type="button"
                                       onClick={() => {
                                         if (confirm(`Approve reservation ${apt.id} for ${apt.clientName}?`)) {
                                           onUpdateAppointmentStatus(apt.id, 'booked');
                                         }
                                       }}
                                       className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded font-mono text-[9px] uppercase cursor-pointer transition"
                                     >
                                       Approve
                                     </button>
                                   )}
                                   {(apt.status === 'pending' || apt.status === 'booked') && (
                                     <button
                                       type="button"
                                       onClick={() => {
                                         if (confirm(`Cancel reservation ${apt.id} for ${apt.clientName}?`)) {
                                           onUpdateAppointmentStatus(apt.id, 'cancelled');
                                         }
                                       }}
                                       className="px-2 py-1 bg-[#150a0a] hover:bg-red-950/40 text-red-400 hover:text-red-305 rounded border border-red-500/10 font-mono text-[9px] uppercase cursor-pointer transition"
                                     >
                                       Cancel
                                     </button>
                                   )}
                                 </div>
                               </div>
                             ))}
                         </div>
                       )}
                     </div>
                   )}
                 </div>

                {/* Time Slots Grid */}
                {selectedDate && (
                  <div className="space-y-3" id="time-slots-container">
                    <label className="text-xs font-mono tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> AVAILABLE APPOINTMENT HOURS
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2" id="time-grid">
                      {availableTimeSlots.map((timeStr) => {
                        const isBooked = bookedSlots.has(timeStr);
                        const isSelected = selectedTime === timeStr;
                        
                        return (
                          <button
                            key={timeStr}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setSelectedTime(timeStr)}
                            className={`py-2 px-1 rounded-lg border text-xs text-center font-mono font-medium transition-all duration-150 cursor-pointer ${
                              isBooked
                                ? 'opacity-30 line-through bg-black border-white/5 text-gray-600 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-amber-500 text-black border-amber-500 font-bold ring-2 ring-amber-500/20 shadow-inner'
                                  : 'border-white/5 bg-black text-[#e0e0e0] hover:border-white/20 hover:text-white'
                            }`}
                          >
                            {timeStr}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-2 font-mono">
                      <div className="flex items-center gap-1.5 flex-row">
                        <span className="w-2.5 h-2.5 rounded-full bg-black border border-white/10 block animate-pulse" /> Available
                      </div>
                      <div className="flex items-center gap-1.5 flex-row">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-950/20 opacity-40 border border-red-500/20 block" /> Booked / Unavailable
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: CLIENT CONTACT INFO FORM */}
            {step === 4 && selectedBarber && selectedService && selectedDate && selectedTime && (
              <div className="space-y-6 animate-fade-in" id="step-4-container">
                {/* Horizontal Quick Summary Ribbon */}
                <div className="bg-black/60 border border-white/10 p-4 rounded-xl flex flex-wrap gap-x-6 gap-y-2 text-xs divide-x divide-white/5">
                  <div className="space-y-1">
                    <span className="uppercase text-[9px] text-gray-500 font-mono tracking-wider block">STYLIST</span>
                    <span className="text-white font-bold">{selectedBarber.name}</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    <span className="uppercase text-[9px] text-gray-500 font-mono tracking-wider block">RITUAL</span>
                    <span className="text-white font-bold">{selectedService.name}</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    <span className="uppercase text-[9px] text-gray-500 font-mono tracking-wider block">RESERVATION</span>
                    <span className="text-amber-400 font-mono font-bold">{selectedDate} at {selectedTime}</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    <span className="uppercase text-[9px] text-gray-500 font-mono tracking-wider block">PRICE</span>
                    <span className="text-amber-400 font-bold font-serif">${selectedService.price}</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-base font-serif font-bold text-white tracking-wide uppercase">
                    Your Contact Portfolio
                  </h3>
                  <p className="text-xs text-gray-400">
                    We send confirmation notifications exclusively via email
                  </p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4 max-w-xl mx-auto" id="booking-contact-form">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="client-name-input" className="text-xs font-mono text-gray-400 uppercase tracking-widest block">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <input
                        id="client-name-input"
                        type="text"
                        placeholder="e.g. Liam Patterson"
                        value={clientName}
                        onChange={(e) => {
                          setClientName(e.target.value);
                          if (formErrors.clientName) setFormErrors({ ...formErrors, clientName: '' });
                        }}
                        className={`w-full py-3 px-4 bg-black border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                          formErrors.clientName ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500'
                        }`}
                      />
                    </div>
                    {formErrors.clientName && (
                      <p className="text-[11px] text-red-400 font-sans flex items-center gap-1.5 bg-red-950/10 p-1.5 rounded border border-red-500/10">
                        <AlertCircle className="w-3.5 h-3.5" /> {formErrors.clientName}
                      </p>
                    )}
                  </div>

                  {/* Two columns: Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="client-email-input" className="text-xs font-mono text-gray-400 uppercase tracking-widest block">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          id="client-email-input"
                          type="email"
                          placeholder="liampatterson@gmail.com"
                          value={clientEmail}
                          onChange={(e) => {
                            setClientEmail(e.target.value);
                            if (formErrors.clientEmail) setFormErrors({ ...formErrors, clientEmail: '' });
                          }}
                          className={`w-full py-3 px-4 bg-black border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                            formErrors.clientEmail ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {formErrors.clientEmail && (
                        <p className="text-[11px] text-red-400 font-sans flex items-center gap-1.5 bg-red-950/10 p-1.5 rounded border border-red-500/10 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.clientEmail}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label htmlFor="client-phone-input" className="text-xs font-mono text-gray-400 uppercase tracking-widest block">
                        Telephone Number *
                      </label>
                      <div className="relative">
                        <input
                          id="client-phone-input"
                          type="tel"
                          placeholder="e.g. (555) 012-3456"
                          value={clientPhone}
                          onChange={(e) => {
                            setClientPhone(e.target.value);
                            if (formErrors.clientPhone) setFormErrors({ ...formErrors, clientPhone: '' });
                          }}
                          className={`w-full py-3 px-4 bg-black border rounded-lg text-sm transition-all focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                            formErrors.clientPhone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {formErrors.clientPhone && (
                        <p className="text-[11px] text-red-400 font-sans flex items-center gap-1.5 bg-red-950/10 p-1.5 rounded border border-red-500/10 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {formErrors.clientPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes / Special Requests */}
                  <div className="space-y-1.5">
                    <label htmlFor="client-notes-input" className="text-xs font-mono text-gray-400 uppercase tracking-widest block">
                      Styling Notes / Special Requests (Optional)
                    </label>
                    <textarea
                      id="client-notes-input"
                      rows={3}
                      placeholder="e.g. Scissor work only on top, slight fade on goatee..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full py-3 px-4 bg-black border border-white/10 rounded-lg text-sm transition-all focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-gray-200 placeholder:text-gray-600 resize-none text-gray-200"
                    />
                  </div>

                  <input type="submit" className="hidden" /> {/* Hidden submit hook for triggers */}
                </form>
              </div>
            )}

            {/* STEP 5: BOOKING SUCCESS RECEIPT */}
            {step === 5 && bookingSuccessReceipt && (
              <div className="text-center py-6 space-y-6 max-w-lg mx-auto animate-fade-in" id="step-5-receipt">
                <div className="p-3 bg-semibold bg-emerald-500/10 text-emerald-400 rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-md">
                  <CalendarCheck className="w-8 h-8 stroke-[2.2]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-black text-white tracking-wide">
                    Appointment Secured
                  </h3>
                  <p className="text-xs text-gray-400 font-sans font-light">
                    Your styling appointment has been logged successfully inside our schedule database.
                  </p>
                </div>

                {/* Aesthetic Paper Invoice Receipt Card */}
                <div className="bg-black border border-white/10 rounded-2xl p-6 text-left space-y-4 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                  
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
                    <span className="font-mono text-gray-500">APPOINTMENT ID</span>
                    <span className="font-mono text-amber-400 font-semibold">{bookingSuccessReceipt.id}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 pt-1 text-sm">
                    <div>
                      <span className="block text-[10px] font-mono text-gray-500 tracking-wider">STYLIST</span>
                      <span className="font-serif font-bold text-white">{bookingSuccessReceipt.barberName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-gray-500 tracking-wider text-right">SERVICE</span>
                      <span className="font-bold text-white text-right block">{bookingSuccessReceipt.serviceName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-gray-500 tracking-wider">DATE & TIME</span>
                      <span className="font-mono text-amber-400 leading-relaxed font-bold">
                        {bookingSuccessReceipt.date} at {bookingSuccessReceipt.time}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-gray-500 tracking-wider text-right">EST. PRICE</span>
                      <span className="font-bold text-amber-500 text-right block font-serif">${bookingSuccessReceipt.servicePrice}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-gray-400">
                    <p className="flex items-center gap-1.5 font-light">
                      <User className="w-3.5 h-3.5 text-gray-500" /> Client: <span className="text-white font-medium">{bookingSuccessReceipt.clientName}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-light">
                      <Phone className="w-3.5 h-3.5 text-gray-500" /> Phone: <span className="text-white font-medium">{bookingSuccessReceipt.clientPhone}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={restartBooking}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95 cursor-pointer"
                  >
                    Book Another Ritual
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Persistent CARD FOOTER CONTROLS - (Only for non-success step) */}
          {step < 5 && (
            <div className="p-6 bg-black/75 py-4 px-6 sm:px-10 border-t border-white/10 flex items-center justify-between animate-fade-in" id="booking-footer-controls">
              
              {/* Back Button */}
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  type="button"
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.04] transition duration-150 flex items-center gap-1.5 select-none cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> BACK
                </button>
              ) : (
                <div className="w-10 h-10" /> // Spacer for alignment
              )}

              {/* Next/Submit Button */}
              {step < 4 ? (
                <button
                  type="button"
                  id={`booking-forward-btn-step-${step}`}
                  disabled={
                    (step === 1 && !selectedBarber) ||
                    (step === 2 && !selectedService) ||
                    (step === 3 && (!selectedDate || !selectedTime))
                  }
                  onClick={() => setStep(step + 1)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 select-none transition duration-150 cursor-pointer ${
                    ((step === 1 && !selectedBarber) ||
                     (step === 2 && !selectedService) ||
                     (step === 3 && (!selectedDate || !selectedTime)))
                      ? 'bg-[#1a1a1a] text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95 font-bold'
                  }`}
                >
                  NEXT <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  className="px-6 py-3 rounded-lg font-bold text-xs bg-amber-500 text-black hover:bg-amber-400 flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition duration-150 active:scale-95 cursor-pointer"
                  id="booking-submit-btn"
                >
                  CONFIRM BOOKING <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
