/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Barber, Service, Appointment, UserProfile } from '../types';
import { 
  Building, User, Settings2, DollarSign, Calendar, Clock, Plus, Trash2, 
  UserPlus, Mail, Phone, Edit, Activity, Scissors, CheckCircle, ShieldAlert, Sparkles, LogOut, Check, ChevronLeft, ChevronRight
} from 'lucide-react';

interface BarberDashboardProps {
  barbers: Barber[];
  services: Service[];
  appointments: Appointment[];
  onUpdateBarber: (updatedBarber: Barber) => void;
  onAddBarber: (newBarber: Barber) => void;
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointmentStatus: (id: string, status: 'pending' | 'booked' | 'completed' | 'cancelled') => void;
  onUpdateAppointment?: (appointment: Appointment) => void;
  currentUser?: UserProfile | null;
  onLogin?: (user: UserProfile) => void;
  users?: UserProfile[];
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onDeleteUser?: (email: string) => void;
  onAddService?: (newService: Service) => void;
  onUpdateService?: (updatedService: Service) => void;
  onDeleteService?: (id: string) => void;
  currentTheme?: string;
  onUpdateTheme?: (theme: string) => void;
}

export default function BarberDashboard({
  barbers,
  services,
  appointments,
  onUpdateBarber,
  onAddBarber,
  onAddAppointment,
  onUpdateAppointmentStatus,
  onUpdateAppointment,
  currentUser = null,
  onLogin,
  users = [],
  onUpdateUser,
  onDeleteUser,
  onAddService,
  onUpdateService,
  onDeleteService,
  currentTheme = 'gold',
  onUpdateTheme
}: BarberDashboardProps) {

  const isSuperAdmin = useMemo(() => {
    if (!currentUser || !currentUser.email) return false;
    return currentUser.email.toLowerCase() === 'kaltrina99a@gmail.com';
  }, [currentUser]);

  const isUserAdmin = useMemo(() => {
    if (!currentUser || !currentUser.email) return false;
    const emailLower = currentUser.email.toLowerCase();
    return emailLower === 'kaltrina99a@gmail.com' || emailLower.includes('google') || emailLower.includes('kale') || emailLower.includes('kaltrina') || emailLower.includes('kal');
  }, [currentUser]);

  // Quick administrator sign-in/reg fields inside lock screen
  const [quickEmail, setQuickEmail] = useState('');
  const [quickName, setQuickName] = useState('');
  const [quickError, setQuickError] = useState('');

  const handleQuickCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError('');
    if (!quickEmail.trim()) {
      setQuickError('Please enter an authorized email.');
      return;
    }
    const emailLower = quickEmail.toLowerCase();
    const isSuper = emailLower === 'kaltrina99a@gmail.com';
    const matches = isSuper || emailLower.includes('google') || emailLower.includes('kale') || emailLower.includes('kaltrina') || emailLower.includes('kal');
    if (!matches) {
      setQuickError('The entered email does not contain authorized keywords "google" or "kale", and is not the Superadmin email kaltrina99a@gmail.com. Please try again.');
      return;
    }

    if (onLogin) {
      onLogin({
        email: quickEmail.trim(),
        name: quickName.trim() || (isSuper ? 'Kaltrina (Superadmin)' : 'Admin Master'),
        phone: '555-8888',
        password: 'adminpassword',
        createdAt: new Date().toISOString()
      });
    }
  };

  // Selected Barber Context State - If null, show Barber Identity Selection
  const [activeBarberId, setActiveBarberId] = useState<string | null>(null);

  // Mode/Sub-tab states inside Barber portal:
  const [portalTab, setPortalTab] = useState<string>('schedule');

  // Superadmin Configuration states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormName, setServiceFormName] = useState('');
  const [serviceFormPrice, setServiceFormPrice] = useState<number>(0);
  const [serviceFormDuration, setServiceFormDuration] = useState<number>(30);
  const [serviceFormBio, setServiceFormBio] = useState('');
  const [serviceFormCategory, setServiceFormCategory] = useState<'Hair' | 'Beard' | 'Grooming' | 'Combo'>('Hair');
  const [showServiceForm, setShowServiceForm] = useState(false);

  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormPhone, setUserFormPhone] = useState('');
  const [userFormPrefs, setUserFormPrefs] = useState('');
  const [userFormBarber, setUserFormBarber] = useState('');
  const [userFormNotif, setUserFormNotif] = useState<'email' | 'sms' | 'none'>('email');
  const [showUserForm, setShowUserForm] = useState(false);

  // New Barber Registration Form state
  const [showAddBarberForm, setShowAddBarberForm] = useState(false);
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberRole, setNewBarberRole] = useState('Senior Stylist');
  const [newBarberBio, setNewBarberBio] = useState('');
  const [newBarberAvatar, setNewBarberAvatar] = useState('');
  const [newBarberHoursStart, setNewBarberHoursStart] = useState('09:00');
  const [newBarberHoursEnd, setNewBarberHoursEnd] = useState('18:00');

  // Walk-In Booking Form states
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinServiceId, setWalkinServiceId] = useState('');
  const [walkinDate, setWalkinDate] = useState('');
  const [walkinTime, setWalkinTime] = useState('');
  const [walkinNotes, setWalkinNotes] = useState('');
  const [walkinError, setWalkinError] = useState('');
  const [walkinSuccess, setWalkinSuccess] = useState(false);

  // Edit Active Barber fields
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editStartHour, setEditStartHour] = useState('');
  const [editEndHour, setEditEndHour] = useState('');
  const [editServices, setEditServices] = useState<string[]>([]);
  const [saveToast, setSaveToast] = useState(false);

  // Google Authentication Overlay states
  const [showGooglePickerAdmin, setShowGooglePickerAdmin] = useState(false);
  const [isGoogleLoadingAdmin, setIsGoogleLoadingAdmin] = useState(false);

  // Calendar View mode states
  const [scheduleViewMode, setScheduleViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarViewMode, setCalendarViewMode] = useState<'day' | 'week' | 'month'>('month');
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date(2026, 4, 20)); // May 20, 2026 starting anchor
  const [selectedAptIdInCalendar, setSelectedAptIdInCalendar] = useState<string | null>(null);

  // Superadmin scheduling notification states
  const [reassigningAptId, setReassigningAptId] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<{
    clientName: string;
    clientEmail: string;
    type: 'reassigned' | 'cancelled' | 'booked';
    barberName: string;
    show: boolean;
  } | null>(null);

  const isSameDayStr = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const padZero = (n: number) => String(n).padStart(2, '0');

  const getAppointmentsForDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = padZero(d.getMonth() + 1);
    const dd = padZero(d.getDate());
    const matchStr = `${yyyy}-${mm}-${dd}`;
    return barberAppointments.filter(apt => apt.date === matchStr);
  };

  const getDaysInMonthGrid = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    
    const numDays = new Date(year, month + 1, 0).getDate();
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    const prevMonthNum = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthNum - i),
        isCurrentMonth: false
      });
    }
    
    for (let i = 1; i <= numDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    const trailingCount = 42 - days.length;
    for (let i = 1; i <= trailingCount; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const currentDay = date.getDay();
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const diff = i - currentDay;
      const d = new Date(date);
      d.setDate(date.getDate() + diff);
      days.push(d);
    }
    return days;
  };


  const handleGoogleAccountSelectAdmin = (googleEmail: string, googleName: string) => {
    setIsGoogleLoadingAdmin(true);
    setShowGooglePickerAdmin(false);
    setQuickError('');

    setTimeout(() => {
      if (onLogin) {
        onLogin({
          email: googleEmail,
          name: googleName,
          phone: '555-8888',
          password: 'adminpassword',
          createdAt: new Date().toISOString()
        });
      }
      setIsGoogleLoadingAdmin(false);
    }, 1000);
  };

  // Memoized current Barber Object

  const currentBarber = useMemo(() => {
    if (activeBarberId === 'superadmin_hq') {
      return {
        id: 'superadmin_hq',
        name: 'Superadmin H.Q.',
        role: 'Global Shop Controller',
        rating: 5.0,
        reviewsCount: 999,
        bio: 'Comprehensive dashboard to configure brand-wide themes, adjust team directory roster, edit tariff items, and configure guest accounts.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        services: [],
        workingHours: {
          start: '00:00',
          end: '23:59'
        }
      };
    }
    return barbers.find(b => b.id === activeBarberId) || null;
  }, [activeBarberId, barbers]);

  // Load Active Barber state into fields
  const handleSelectBarber = (barberId: string) => {
    if (barberId === 'superadmin_hq') {
      setActiveBarberId('superadmin_hq');
      setPortalTab('super_schedule');
      return;
    }
    const barber = barbers.find(b => b.id === barberId);
    if (barber) {
      setActiveBarberId(barberId);
      setEditName(barber.name);
      setEditRole(barber.role);
      setEditBio(barber.bio);
      setEditAvatar(barber.avatar);
      setEditStartHour(barber.workingHours.start);
      setEditEndHour(barber.workingHours.end);
      setEditServices(barber.services);
      setPortalTab('schedule');
    }
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBarber) return;

    const updated: Barber = {
      ...currentBarber,
      name: editName.trim() || currentBarber.name,
      role: editRole.trim() || currentBarber.role,
      bio: editBio.trim() || currentBarber.bio,
      avatar: editAvatar.trim() || currentBarber.avatar,
      workingHours: {
        start: editStartHour || currentBarber.workingHours.start,
        end: editEndHour || currentBarber.workingHours.end,
      },
      services: editServices,
    };

    onUpdateBarber(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Add Walk-in submission
  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWalkinError('');
    setWalkinSuccess(false);

    if (!currentBarber) return;
    if (!walkinName.trim() || !walkinServiceId || !walkinDate || !walkinTime) {
      setWalkinError('Please complete all required fields');
      return;
    }

    // Double-booking check
    const isDoubleBooked = appointments.some(apt => 
      apt.barberId === currentBarber.id && 
      apt.date === walkinDate && 
      apt.time === walkinTime &&
      apt.status === 'booked'
    );

    if (isDoubleBooked) {
      setWalkinError(`You are already booked on ${walkinDate} at ${walkinTime}. Please select another hour.`);
      return;
    }

    const serviceObj = services.find(s => s.id === walkinServiceId);
    if (!serviceObj) return;

    const newApt: Appointment = {
      id: 'WK-' + Math.floor(100000 + Math.random() * 900000),
      barberId: currentBarber.id,
      barberName: currentBarber.name,
      serviceId: serviceObj.id,
      serviceName: serviceObj.name,
      servicePrice: serviceObj.price,
      date: walkinDate,
      time: walkinTime,
      clientName: walkinName + ' (Walk-In)',
      clientEmail: 'walkin@shop.com',
      clientPhone: walkinPhone || '000-walkin',
      notes: walkinNotes.trim() ? `[Walk-In] ${walkinNotes}` : '[Walk-In]',
      status: 'booked',
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newApt);
    setWalkinSuccess(true);
    
    // Clear walkin fields
    setWalkinName('');
    setWalkinPhone('');
    setWalkinNotes('');
    setWalkinTime('');
    
    setTimeout(() => {
      setWalkinSuccess(false);
      setPortalTab('schedule');
    }, 2000);
  };

  // Superadmin Form Submission Handlers
  const handleServiceFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormName.trim()) return;

    const serviceData: Service = {
      id: editingServiceId || 'ser_' + Math.random().toString(36).substring(2, 9),
      name: serviceFormName.trim(),
      price: Number(serviceFormPrice),
      duration: Number(serviceFormDuration),
      description: serviceFormBio.trim(),
      category: serviceFormCategory
    };

    if (editingServiceId && onUpdateService) {
      onUpdateService(serviceData);
    } else if (onAddService) {
      onAddService(serviceData);
    }

    // Reset Form
    setShowServiceForm(false);
    setEditingServiceId(null);
    setServiceFormName('');
    setServiceFormPrice(0);
    setServiceFormDuration(30);
    setServiceFormBio('');
    setServiceFormCategory('Hair');
  };

  const handleEditServiceClick = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceFormName(service.name);
    setServiceFormPrice(service.price);
    setServiceFormDuration(service.duration);
    setServiceFormBio(service.description);
    setServiceFormCategory(service.category);
    setShowServiceForm(true);
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserEmail) return;

    const userData: UserProfile = {
      email: editingUserEmail,
      name: userFormName.trim(),
      phone: userFormPhone.trim(),
      stylePreferences: userFormPrefs.trim(),
      preferredBarberId: userFormBarber || undefined,
      notificationType: userFormNotif,
      createdAt: new Date().toISOString()
    };

    if (onUpdateUser) {
      onUpdateUser(userData);
    }

    setShowUserForm(false);
    setEditingUserEmail(null);
    setUserFormName('');
    setUserFormPhone('');
    setUserFormPrefs('');
    setUserFormBarber('');
  };

  const handleEditUserClick = (user: UserProfile) => {
    setEditingUserEmail(user.email);
    setUserFormName(user.name);
    setUserFormPhone(user.phone || '');
    setUserFormPrefs(user.stylePreferences || '');
    setUserFormBarber(user.preferredBarberId || '');
    setUserFormNotif(user.notificationType || 'email');
    setShowUserForm(true);
  };

  // Add Barber Submit
  const handleAddBarberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarberName.trim()) return;

    const newId = 'b-' + Date.now();
    const parsedBarber: Barber = {
      id: newId,
      name: newBarberName.trim(),
      role: newBarberRole,
      rating: 5.0,
      reviewsCount: 1,
      bio: newBarberBio.trim() || 'A professional stylist committed to exceptional service standards and modern hair grooming.',
      avatar: newBarberAvatar.trim() || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80',
      services: services.slice(0, 3).map(s => s.id), // default assign first 3 services
      workingHours: {
        start: newBarberHoursStart,
        end: newBarberHoursEnd
      }
    };

    onAddBarber(parsedBarber);
    
    // Reset Form
    setNewBarberName('');
    setNewBarberBio('');
    setNewBarberAvatar('');
    setShowAddBarberForm(false);
    
    // Automatically login as newly created Barber!
    handleSelectBarber(newId);
  };

  // Filter current Barber's Appointments
  const barberAppointments = useMemo(() => {
    if (!activeBarberId) return [];
    const filtered = activeBarberId === 'superadmin_hq' 
      ? appointments 
      : appointments.filter(apt => apt.barberId === activeBarberId);
    return [...filtered].sort((a,b) => {
      // Sort by date then by time
      if(a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  }, [activeBarberId, appointments]);

  // Financial Metrics for the Barber
  const metrics = useMemo(() => {
    const active = barberAppointments.filter(a => a.status === 'booked');
    const completed = barberAppointments.filter(a => a.status === 'completed');
    const cancelled = barberAppointments.filter(a => a.status === 'cancelled');

    const totalEstEarnings = completed.reduce((acc, a) => acc + a.servicePrice, 0) + 
                             (active.reduce((acc, a) => acc + a.servicePrice, 0) * 0.95); // 95% show rate

    return {
      activeCount: active.length,
      completedCount: completed.length,
      cancelledCount: cancelled.length,
      estimatedIncome: totalEstEarnings,
    };
  }, [barberAppointments]);

  // Superadmin Action Handlers for Bookings/Schedules
  const handleSuperadminReassignBarber = (aptId: string, targetBarberId: string) => {
    const apt = appointments.find(a => a.id === aptId);
    const targetBarber = barbers.find(b => b.id === targetBarberId);
    if (!apt || !targetBarber) return;

    if (onUpdateAppointment) {
      onUpdateAppointment({
        ...apt,
        barberId: targetBarber.id,
        barberName: targetBarber.name
      });

      // Show high fidelity simulated success feedback
      setNotificationStatus({
        clientName: apt.clientName,
        clientEmail: apt.clientEmail || 'client@example.com',
        type: 'reassigned',
        barberName: targetBarber.name,
        show: true
      });
      
      setReassigningAptId(null);
    }
  };

  const handleSuperadminCancelAppointment = (aptId: string) => {
    const apt = appointments.find(a => a.id === aptId);
    if (!apt) return;

    onUpdateAppointmentStatus(aptId, 'cancelled');

    // Show simulated email success feedback
    setNotificationStatus({
      clientName: apt.clientName,
      clientEmail: apt.clientEmail || 'client@example.com',
      type: 'cancelled',
      barberName: apt.barberName,
      show: true
    });
  };

  const handleSuperadminApproveAppointment = (aptId: string) => {
    const apt = appointments.find(a => a.id === aptId);
    if (!apt) return;

    onUpdateAppointmentStatus(aptId, 'booked');

    setNotificationStatus({
      clientName: apt.clientName,
      clientEmail: apt.clientEmail || 'client@example.com',
      type: 'booked',
      barberName: apt.barberName,
      show: true
    });
  };

  const handleDownloadICS = (apt: Appointment) => {
    // Format dates to ICS-friendly format (e.g., YYYYMMDDTHHMMSSZ)
    const dateClean = apt.date.replace(/-/g, '');
    const timeClean = apt.time.replace(/:/g, '') + '00';
    
    const dtstart = `${dateClean}T${timeClean}`;
    const h = parseInt(apt.time.split(':')[0]);
    const m = parseInt(apt.time.split(':')[1]);
    const endMinutes = m + 30;
    const endHour = h + (endMinutes >= 60 ? 1 : 0);
    const endMinRemain = endMinutes % 60;
    const dtend = `${dateClean}T${padZero(endHour % 24)}${padZero(endMinRemain)}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Barber Co//Client Itinerary Sync//EN',
      'BEGIN:VEVENT',
      `UID:${apt.id}@barberco.london`,
      `DTSTAMP:${dtstart}`,
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:Barber Co Session - ${apt.serviceName}`,
      `DESCRIPTION:Scheduled at Barber Co with ${apt.barberName}. Service: ${apt.serviceName} ($${apt.servicePrice}).`,
      'LOCATION:104 Piccadilly Circus, London, UK',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `barberco_booking_${apt.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Toggle service checked state
  const handleToggleServiceAssociation = (serviceId: string) => {
    if (editServices.includes(serviceId)) {
      setEditServices(editServices.filter(id => id !== serviceId));
    } else {
      setEditServices([...editServices, serviceId]);
    }
  };

  if (!isUserAdmin) {
    return (
      <div className="py-24 bg-[#0a0a0a] text-[#e0e0e0] min-h-[80vh] flex items-center justify-center font-sans px-4 relative">
        {/* Reusable Simulated Google Sign In Picker Modal for Admin Panel */}
        {showGooglePickerAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in px-4">
            <div className="bg-[#121212] border border-white/10 w-full max-w-sm rounded-2xl p-6 space-y-5 text-[#e0e0e0] shadow-2xl text-left relative">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white">Sign with Google</h3>
                </div>
                <button 
                  onClick={() => setShowGooglePickerAdmin(false)}
                  className="text-gray-400 hover:text-white font-mono text-[10px] cursor-pointer border border-white/10 px-1.5 py-0.5 rounded hover:bg-white/5"
                >
                  Close
                </button>
              </div>
              
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Choose an administrator/superadmin account to unlock the terminal dashboard instantly:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleAccountSelectAdmin('kaltrina99a@gmail.com', 'Kaltrina (Superadmin)')}
                  className="w-full flex items-center justify-between p-3 bg-black hover:bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl transition text-left cursor-pointer animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-black font-serif font-black text-xs">
                      K
                    </div>
                    <div>
                      <span className="font-semibold text-white text-xs block leading-none">Kaltrina (Superadmin)</span>
                      <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">kaltrina99a@gmail.com</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 leading-none">Superadmin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleAccountSelectAdmin('kale@barber.co', 'Stylist Desk (Kale)')}
                  className="w-full flex items-center justify-between p-3 bg-black hover:bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-black text-xs">
                      S
                    </div>
                    <div>
                      <span className="font-semibold text-white text-xs block leading-none">Stylist Desk (Kale)</span>
                      <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">kale@barber.co</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-gray-400 uppercase bg-white/5 px-1.5 py-0.5 rounded border border-white/5 leading-none">Staff</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleAccountSelectAdmin('google@barber.co', 'Management Desk')}
                  className="w-full flex items-center justify-between p-3 bg-black hover:bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center text-white font-black text-xs font-mono">
                      G
                    </div>
                    <div>
                      <span className="font-semibold text-white text-xs block leading-none">Management Desk</span>
                      <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">google@barber.co</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-gray-400 uppercase bg-white/5 px-1.5 py-0.5 rounded border border-white/5 leading-none">Staff</span>
                </button>
              </div>
              
              <div className="text-[9px] text-gray-650 text-center font-mono">
                Admin Console OAuth Client • Port 3000 Ingress verified
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isGoogleLoadingAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in text-center">
            <div className="space-y-3">
              <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
              <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest animate-pulse">
                Authorizing Superadmin via Google workspace domain...
              </p>
            </div>
          </div>
        )}

        <div className="max-w-md w-full mx-auto px-6 py-8 bg-black border border-amber-500/20 rounded-2xl space-y-6 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-amber-700" />
          
          <div className="flex justify-center">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full text-amber-500">
              <ShieldAlert className="w-10 h-10 stroke-[1.8]" />
            </div>
          </div>

          <div className="space-y-2 animate-fade-in">
            <h2 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
              Terminal Restriction Locks
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              This terminal is strictly limited to authorized administrators. Access requires a registered profile where <strong className="text-amber-400 font-mono">kaltrina99a@gmail.com</strong> acts as the Superadmin, or an email containing <strong className="text-amber-400 font-mono">"google"</strong> or <strong className="text-amber-400 font-mono">"kale"</strong>.
            </p>
          </div>

          {quickError && (
            <p className="text-red-400 text-[11px] font-mono bg-red-950/20 p-2.5 rounded border border-red-500/15 text-left">
              ⚠ {quickError}
            </p>
          )}

          <form onSubmit={handleQuickCreateAdmin} className="space-y-3.5 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">ADMINISTRATOR EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. google@barber.co or kale@barber.co"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="w-full py-2 border border-white/10 pl-10 pr-3 bg-[#0d0d0d] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase block tracking-wider">ADMINISTRATOR NAME (OPTIONAL)</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Master Stylist Desk"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  className="w-full py-2 border border-white/10 pl-10 pr-3 bg-[#0d0d0d] rounded-lg text-xs text-gray-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs uppercase transition tracking-wider cursor-pointer"
            >
              Verify & Unlock Console
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-[8px] font-mono uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <button
            type="button"
            onClick={() => setShowGooglePickerAdmin(true)}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-gray-100 text-black rounded-lg text-xs font-semibold tracking-wider transition-all duration-150 shadow cursor-pointer uppercase font-mono"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>


          <div className="pt-3 border-t border-white/5 text-[10px] text-gray-500 leading-relaxed font-mono tracking-tighter">
            Note: You can also register or sign in on the main <strong className="text-gray-400 font-sans font-bold uppercase text-[9px]">Guest Registry</strong>. Any registered profile carrying these keywords operates as a valid admin.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#0a0a0a] text-[#e0e0e0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. SELECTION SCREEN UNLESS SIGNED IN */}
        {!currentBarber ? (
          <div className="max-w-4xl mx-auto space-y-10 animate-fade-in" id="portal-select-barber-screen">
            <div className="text-center space-y-3">
              <span className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/35 text-amber-400 font-mono text-xs tracking-widest uppercase">
                BARBERS WORKSPACE PORTAL
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                Access Admin Workspace
              </h1>
              <p className="max-w-md mx-auto text-gray-400 text-sm font-light">
                Please assume your professional stylist identity to audit and manage your personalized booking schedules, services list, and client communications.
              </p>
            </div>

            {isSuperAdmin && (
              <div 
                onClick={() => handleSelectBarber('superadmin_hq')}
                className="max-w-xl mx-auto bg-gradient-to-r from-amber-500/10 to-amber-500/15 border-2 border-amber-500/40 rounded-2xl p-6 text-center cursor-pointer hover:border-amber-400 transition-all duration-300 shadow-xl gold-glow group"
                id="superadmin-hq-entry-card"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/30 group-hover:scale-110 transition duration-300">
                  <Settings2 className="w-6 h-6" />
                </div>
                <h3 className="mt-4 font-serif font-bold text-lg text-white">🔒 Superadmin Command Headquarters</h3>
                <p className="mt-1.5 text-xs text-gray-400 font-light leading-relaxed animate-fade-in">
                  Authorized access detected for <strong className="text-amber-400">{currentUser?.email}</strong>. 
                  Click here to custom-configure treatments services tariff, update the staffing roster, oversee registered guest accounts, or dynamically override the brand theme scheme.
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-amber-500 uppercase tracking-widest font-semibold">
                  <span>Enter HQ Control Deck</span>
                  <Plus className="w-3.5 h-3.5 rotate-45 animate-pulse" />
                </div>
              </div>
            )}

            {/* Grid of existing professionals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4" id="portal-barber-grid">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  onClick={() => handleSelectBarber(barber.id)}
                  className="bg-white/[0.01] border border-white/10 rounded-xl p-5 hover:border-amber-500/50 cursor-pointer relative group transition duration-300 flex flex-col items-center text-center shadow gold-glow-hover"
                  id={`portal-identity-${barber.id}`}
                >
                  <img
                    src={barber.avatar}
                    referrerPolicy="no-referrer"
                    alt={barber.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-black group-hover:border-amber-500 transition duration-300"
                  />
                  <div className="mt-4 space-y-1">
                    <h3 className="font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                      {barber.name}
                    </h3>
                    <p className="text-xs text-amber-500 font-mono tracking-wider uppercase">{barber.role}</p>
                    <p className="text-[11px] text-gray-500 font-sans font-light line-clamp-2 px-2 mt-2">
                      {barber.bio}
                    </p>
                  </div>
                </div>
              ))}

              {/* Add Barber Profile triggers */}
              {!showAddBarberForm ? (
                <div
                  onClick={() => setShowAddBarberForm(true)}
                  className="bg-white/[0.01] border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-amber-500/40 cursor-pointer flex flex-col items-center justify-center text-center group transition min-h-[220px]"
                  id="add-stylist-trigger"
                >
                  <div className="p-3 bg-white/5 rounded-full group-hover:bg-amber-500/10 text-gray-500 group-hover:text-amber-500 transition mb-3">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono tracking-wider font-semibold text-gray-400 group-hover:text-white uppercase">
                    Register New Barber
                  </span>
                </div>
              ) : (
                <div className="col-span-1 sm:col-span-3 bg-white/[0.01] border border-amber-500/35 rounded-2xl p-6 shadow-xl animate-fade-in gold-glow" id="add-stylist-form-panel">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif font-bold text-white text-lg flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" /> New Professional Onboarding
                    </h3>
                    <button
                      onClick={() => setShowAddBarberForm(false)}
                      className="text-gray-500 hover:text-white text-xs underline"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleAddBarberSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 block uppercase">Barber Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jackson Kross"
                        value={newBarberName}
                        onChange={(e) => setNewBarberName(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 focus:outline-none focus:border-amber-500 rounded-lg text-sm text-gray-200"
                      />
                    </div>

                    <div className="space-y-1.5 select-none">
                      <label className="text-xs font-mono text-gray-400 block uppercase">Role Specialty *</label>
                      <select
                        value={newBarberRole}
                        onChange={(e) => setNewBarberRole(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 focus:outline-none focus:border-amber-500 rounded-lg text-sm text-gray-200"
                      >
                        <option value="Master Barber & Stylist" className="bg-black text-[#e0e0e0]">Master Barber & Stylist</option>
                        <option value="Senior Fade Specialist" className="bg-black text-[#e0e0e0]">Senior Fade Specialist</option>
                        <option value="Grooming Specialist" className="bg-black text-[#e0e0e0]">Grooming Specialist</option>
                        <option value="Junior Stylist" className="bg-black text-[#e0e0e0]">Junior Stylist</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 block uppercase">Headshot Photo URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or leave blank for dynamic photo"
                        value={newBarberAvatar}
                        onChange={(e) => setNewBarberAvatar(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 focus:outline-none focus:border-amber-500 rounded-lg text-sm text-gray-200"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 block uppercase">Short biography / Specialties *</label>
                      <textarea
                        rows={2}
                        placeholder="E.g. Champion of low-fades, crisp framing outlines, and charcoal deep scrubs..."
                        value={newBarberBio}
                        onChange={(e) => setNewBarberBio(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 focus:outline-none focus:border-amber-500 rounded-lg text-sm text-gray-200 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 block uppercase">Working Hour Start *</label>
                      <input
                        type="time"
                        value={newBarberHoursStart}
                        onChange={(e) => setNewBarberHoursStart(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 focus:outline-none focus:border-amber-500 rounded-lg text-sm text-gray-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 block uppercase">Working Hour End *</label>
                      <input
                        type="time"
                        value={newBarberHoursEnd}
                        onChange={(e) => setNewBarberHoursEnd(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 focus:outline-none focus:border-amber-500 rounded-lg text-sm text-gray-200"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddBarberForm(false)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-sm transition cursor-pointer"
                      >
                        Launch Professional Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          
          /* 2. BARBER PORTAL WORKSPACE CONTAINER */
          <div className="space-y-8 animate-fade-in" id="portal-barber-workspace-active">
            
             {/* Horizontal Command Bar Header */}
            <div className="bg-white/[0.01] border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 gold-glow animate-fade-in">
              
              <div className="flex items-center space-x-4">
                <img
                  src={currentBarber.avatar}
                  referrerPolicy="no-referrer"
                  alt={currentBarber.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/80 shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-bold text-white tracking-wide">{currentBarber.name}</h2>
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono py-0.5 px-1.5 rounded uppercase">
                      {currentBarber.id === 'superadmin_hq' ? '🔒 SYSTEM SUPERADMIN' : 'ACTIVE BARBER'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-500 italic mt-0.5 font-mono">{currentBarber.role}</p>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-md hidden sm:block">
                    {currentBarber.id === 'superadmin_hq' 
                      ? 'Root controller dashboard activated.' 
                      : `Hrs: ${currentBarber.workingHours.start} - ${currentBarber.workingHours.end}`
                    }
                  </p>
                </div>
              </div>

              {/* Sub tabs and Exit */}
              <div className="flex items-center flex-wrap gap-2">
                {currentBarber.id === 'superadmin_hq' ? (
                  <>
                    <button
                      onClick={() => setPortalTab('super_schedule')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        portalTab === 'super_schedule'
                          ? 'bg-[#C5A059]/15 text-amber-400 border border-[#C5A059]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      📅 GRAND CALENDAR
                    </button>
                    <button
                      onClick={() => setPortalTab('super_treatments')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        portalTab === 'super_treatments'
                          ? 'bg-[#C5A059]/15 text-amber-400 border border-[#C5A059]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      TREATMENTS TARIFF
                    </button>
                    <button
                      onClick={() => setPortalTab('super_staff')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        portalTab === 'super_staff'
                          ? 'bg-[#C5A059]/15 text-amber-400 border border-[#C5A059]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      STAFF ROSTER
                    </button>
                    <button
                      onClick={() => setPortalTab('super_clients')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        portalTab === 'super_clients'
                          ? 'bg-[#C5A059]/15 text-amber-400 border border-[#C5A059]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      CLIENT DIRECTORY
                    </button>
                    <button
                      onClick={() => setPortalTab('super_brand')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        portalTab === 'super_brand'
                          ? 'bg-[#C5A059]/15 text-amber-400 border border-[#C5A059]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      BRAND CUSTOMIZER
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setPortalTab('schedule')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        portalTab === 'schedule'
                          ? 'bg-[#C5A059]/15 text-amber-400 border border-[#C5A059]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      SCHEDULES
                    </button>
                    <button
                      onClick={() => setPortalTab('profile')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        portalTab === 'profile'
                          ? 'bg-[#C5A059]/15 text-amber-400 border border-[#C5A059]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      EDIT PROFILE
                    </button>
                    <button
                      onClick={() => setPortalTab('add-walkin')}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        portalTab === 'add-walkin'
                          ? 'bg-[#C5A059]/15 text-amber-400 border border-[#C5A059]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      WALK-IN SERVICE
                    </button>
                  </>
                )}
                <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />
                <button
                  onClick={() => setActiveBarberId(null)}
                  className="px-3 py-2 hover:bg-red-950/20 text-red-400 hover:text-red-305 font-mono text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>

            {/* Save Profile success toast if needed */}
            {saveToast && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4" /> Profile updates persisted successfully and synchronized live!
              </div>
            )}

            {/* 3. SUB-TAB 1: PROFESSIONAL RESERVED SCHEDULES */}
            {(portalTab === 'schedule' || portalTab === 'super_schedule') && (
              <div className="space-y-6" id="dashboard-schedule-panel">
                
                {/* Visual Bento Dashboard Statistics summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="dashboard-bento-grid">
                  <div className="bg-white/[0.01] border border-white/10 p-5 rounded-xl space-y-1 relative overflow-hidden gold-glow">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-medium">Upcoming Shifts</span>
                    <span className="block text-2xl font-serif font-bold text-white">{metrics.activeCount}</span>
                    <span className="text-[10px] text-amber-500 block font-light">Pending Confirmations</span>
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500" />
                  </div>

                  <div className="bg-white/[0.01] border border-white/10 p-5 rounded-xl space-y-1 relative overflow-hidden gold-glow">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-medium">Completed Cuts</span>
                    <span className="block text-2xl font-serif font-bold text-emerald-400">{metrics.completedCount}</span>
                    <span className="text-[10px] text-gray-400 block font-light">Added to payout history</span>
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
                  </div>

                  <div className="bg-white/[0.01] border border-white/10 p-5 rounded-xl space-y-1 relative overflow-hidden gold-glow">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-medium">Service Revenue</span>
                    <span className="block text-2xl font-serif font-bold text-amber-400">${metrics.estimatedIncome}</span>
                    <span className="text-[10px] text-gray-400 block font-light">Incl. active reservations</span>
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-400" />
                  </div>

                  <div className="bg-white/[0.01] border border-white/10 p-5 rounded-xl space-y-1 relative overflow-hidden gold-glow">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-medium">Cancellations</span>
                    <span className="block text-2xl font-serif font-bold text-red-500">{metrics.cancelledCount}</span>
                    <span className="text-[10px] text-gray-500 block font-light">0% double-book rate</span>
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-red-500/50" />
                  </div>
                </div>

                {/* Main Schedule List & Calendar Card */}
                <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-5 sm:p-7 space-y-6 gold-glow animate-fade-in">
                  
                  {/* Outer Section Controls */}
                  <div className="flex flex-col md:flex-row justify-between md:items-center pb-4 border-b border-white/5 gap-4">
                    <div>
                      <h3 className="text-base font-serif font-bold text-white tracking-wide uppercase">Daily Guest Roll</h3>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">Total Registered Bookings: {barberAppointments.length}</p>
                    </div>
                    
                    {/* View Switchers */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center bg-black/80 border border-white/10 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => setScheduleViewMode('list')}
                          className={`px-3 py-1.5 text-[10px] font-mono rounded font-semibold transition cursor-pointer ${
                            scheduleViewMode === 'list'
                              ? 'bg-amber-500 text-black font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          LIST VIEW
                        </button>
                        <button
                          type="button"
                          onClick={() => setScheduleViewMode('calendar')}
                          className={`px-3 py-1.5 text-[10px] font-mono rounded font-semibold transition cursor-pointer ${
                            scheduleViewMode === 'calendar'
                              ? 'bg-amber-500 text-black font-bold'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          CALENDAR VIEW
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPortalTab('add-walkin')}
                        className="px-3 py-1.5 bg-[#C5A029] hover:bg-amber-400 text-black font-mono text-[10px] font-black rounded-lg flex items-center gap-1 shadow transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> WALK-IN CLIENT
                      </button>
                    </div>
                  </div>

                  {/* Notification Status Dispatch Alert */}
                  {notificationStatus && notificationStatus.show && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl space-y-3 animate-fade-in text-left">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs font-mono font-bold tracking-wider uppercase">CLIENT TRANSACTION NOTIFICATION DISPATCHED</span>
                        </div>
                        <button 
                          onClick={() => setNotificationStatus(null)}
                          className="text-gray-400 hover:text-white font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded border border-white/10"
                        >
                          ✕ CLOSE
                        </button>
                      </div>

                      <div className="text-xs text-gray-300 leading-relaxed font-sans space-y-1 bg-black/40 p-3 rounded-lg border border-white/5">
                        <p>
                          <span className="text-amber-400">Recipient:</span> {notificationStatus.clientName} (<span className="text-emerald-400 underline">{notificationStatus.clientEmail}</span>)
                        </p>
                        <p>
                          <span className="text-amber-400">Action:</span> {notificationStatus.type === 'reassigned' ? (
                            <span>Booking reassigned to Stylist <span className="text-white font-mono font-bold">{notificationStatus.barberName}</span></span>
                          ) : notificationStatus.type === 'cancelled' ? (
                            <span className="text-red-400">Booking Cancelled (No-fee cancellation applied)</span>
                          ) : (
                            <span>Booking Confirmed / Approved</span>
                          )}
                        </p>
                        <p className="text-gray-400 text-[11px] mt-2 block">
                          📧 <span className="italic">A customized confirmation email has been dispatched to {notificationStatus.clientEmail} detailing the change.</span>
                        </p>
                        <p className="text-gray-400 text-[11px] block">
                          📅 <span className="italic">The event has been pushed to the client's localized calendar with sync coordinates.</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => {
                            // Find the appointment to download its ICS
                            const apt = appointments.find(a => a.clientName === notificationStatus.clientName);
                            if (apt) {
                              handleDownloadICS(apt);
                            } else {
                              alert('No active appointment record found to download. A generic test .ics was created.');
                            }
                          }}
                          className="px-3 py-1 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-amber-400 rounded text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition uppercase"
                        >
                          📥 DOWNLOAD .ICS CALENDAR INVITE
                        </button>
                        <a
                          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Barber+Co+Piccadilly+Session&details=Luxury+grooming+with+${encodeURIComponent(notificationStatus.barberName)}&location=104+Piccadilly+Circus+London`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-black hover:bg-white/5 border border-white/10 text-gray-300 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition uppercase"
                        >
                          🗓️ SYNC GOOGLE CALENDAR
                        </a>
                      </div>
                    </div>
                  )}

                  {/* 1. LIST VIEW */}
                  {scheduleViewMode === 'list' && (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {barberAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                            apt.status === 'completed'
                              ? 'bg-black/30 border-white/5 opacity-75'
                              : apt.status === 'cancelled'
                                ? 'bg-[#050505]/20 border-white/5 opacity-50 line-through'
                                : 'bg-black border border-white/10 hover:border-white/20'
                          }`}
                        >
                          {/* Guest Details block */}
                          <div className="space-y-2 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-amber-500 font-semibold">{apt.date} • {apt.time}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black text-gray-550 font-mono border border-white/5">
                                ID: {apt.id}
                              </span>
                              {apt.status === 'pending' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-mono animate-pulse">
                                  PENDING APPROVAL
                                </span>
                              )}
                              {apt.status === 'completed' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-555 bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 font-mono">
                                  COMPLETED
                                </span>
                              )}
                              {apt.status === 'cancelled' && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-955 bg-red-500/10 border border-red-550/15 text-red-400 font-mono">
                                  CANCELLED
                                </span>
                              )}
                            </div>

                            <div>
                              <span className="block font-serif text-white font-bold text-base leading-none">
                                {apt.clientName}
                              </span>
                              <span className="text-xs text-gray-400 block mt-1 font-mono">
                                Phone: <span className="text-white">{apt.clientPhone}</span> {(apt.clientEmail && apt.clientEmail !== 'walkin@shop.com') && `• Email: ${apt.clientEmail}`}
                              </span>
                            </div>

                            <div className="text-xs font-light text-gray-300 bg-black/60 p-2 rounded border border-white/5 flex items-center gap-1.5">
                              <Scissors className="w-3.5 h-3.5 text-amber-500" />
                              <span className="font-bold text-white transition">{apt.serviceName}</span>
                              <span className="text-gray-500 font-mono">(${apt.servicePrice} • ~30m)</span>
                            </div>

                            {apt.notes && (
                              <p className="text-[11px] text-gray-400 italic bg-black/40 px-2 py-1 rounded max-w-lg border border-white/5">
                                Notes: "{apt.notes}"
                              </p>
                            )}

                            {/* Stylist identification & Superadmin Reassignment controls */}
                            <div className="pt-2 border-t border-white/5 mt-2 space-y-2">
                              <span className="text-[10px] text-gray-400 font-mono block">💈 STYLIST ASSIGNED: <strong className="text-amber-400">{apt.barberName}</strong></span>
                              
                              {activeBarberId === 'superadmin_hq' && (
                                <>
                                  {reassigningAptId === apt.id ? (
                                    <div className="flex items-center gap-2 mt-1 animate-fade-in flex-wrap">
                                      <select
                                        defaultValue=""
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            handleSuperadminReassignBarber(apt.id, e.target.value);
                                          }
                                        }}
                                        className="bg-black border border-amber-500/30 text-gray-200 text-xs rounded px-2.5 py-1 font-mono focus:outline-none focus:border-amber-500"
                                      >
                                        <option value="">-- Choose New Stylist --</option>
                                        {barbers.filter(b => b.id !== 'superadmin_hq').map(b => (
                                          <option key={b.id} value={b.id}>{b.name} ({b.role})</option>
                                        ))}
                                      </select>
                                      <button
                                        type="button"
                                        onClick={() => setReassigningAptId(null)}
                                        className="text-[10px] font-mono text-gray-400 hover:text-white px-2 py-1 bg-white/5 rounded border border-white/10"
                                      >
                                        CANCEL
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setReassigningAptId(apt.id)}
                                        className="text-[10px] font-mono font-bold text-amber-500 hover:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 px-20 py-1 rounded border border-amber-500/10 hover:border-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                                      >
                                        ⇄ CHANGE TO STYLIST / PERSON
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadICS(apt)}
                                        className="text-[10px] font-mono text-gray-400 hover:text-white bg-black hover:bg-white/5 px-2 py-1 rounded border border-white/10 transition"
                                        title="Download iCal sync file"
                                      >
                                        📅 ICS CALENDAR
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Guest actions trigger */}
                          {apt.status === 'pending' && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Approve this pending appointment booking?')) {
                                    if (activeBarberId === 'superadmin_hq') {
                                      handleSuperadminApproveAppointment(apt.id);
                                    } else {
                                      onUpdateAppointmentStatus(apt.id, 'booked');
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-mono text-[10px] font-bold rounded cursor-pointer animate-fade-in uppercase"
                              >
                                APPROVE
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Cancel this pending appointment?')) {
                                    if (activeBarberId === 'superadmin_hq') {
                                      handleSuperadminCancelAppointment(apt.id);
                                    } else {
                                      onUpdateAppointmentStatus(apt.id, 'cancelled');
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 bg-black hover:bg-white/5 text-gray-400 hover:text-red-450 font-mono text-[10px] rounded cursor-pointer border border-white/10"
                              >
                                CANCEL
                              </button>
                            </div>
                          )}
                          {apt.status === 'booked' && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Mark this grooming session as Completed? This will add the fee to your total payouts.')) {
                                    onUpdateAppointmentStatus(apt.id, 'completed');
                                  }
                                }}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[10px] font-bold rounded cursor-pointer animate-fade-in"
                              >
                                COMPLETE CUT
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Cancel this scheduled appointment?')) {
                                    if (activeBarberId === 'superadmin_hq') {
                                      handleSuperadminCancelAppointment(apt.id);
                                    } else {
                                      onUpdateAppointmentStatus(apt.id, 'cancelled');
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 bg-black hover:bg-white/5 text-gray-400 hover:text-red-450 font-mono text-[10px] rounded cursor-pointer border border-white/10"
                              >
                                CANCEL
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {barberAppointments.length === 0 && (
                        <div className="py-16 text-center text-gray-500 italic font-light space-y-2">
                          <Calendar className="w-8 h-8 text-gray-700 mx-auto" />
                          <p>No customer reservations lined up in your scheduler yet.</p>
                          <p className="text-xs text-gray-600">Tip: Go to "Book Appointment" navigation tab to submit an appointment for this stylist!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. CALENDAR VIEW ENGINE */}
                  {scheduleViewMode === 'calendar' && (() => {
                    const daysInGrid = getDaysInMonthGrid(currentCalendarDate);
                    const weekDays = getWeekDays(currentCalendarDate);
                    const isMonthMode = calendarViewMode === 'month';
                    const isWeekMode = calendarViewMode === 'week';
                    const isDayMode = calendarViewMode === 'day';

                    // Formats date period beautifully
                    const formattedCalendarPeriod = () => {
                      if (isMonthMode) {
                        return currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      } else if (isWeekMode) {
                        const start = weekDays[0];
                        const end = weekDays[6];
                        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                      } else {
                        return currentCalendarDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
                      }
                    };

                    const handlePrevPeriod = () => {
                      const copy = new Date(currentCalendarDate);
                      if (isMonthMode) {
                        copy.setMonth(copy.getMonth() - 1);
                      } else if (isWeekMode) {
                        copy.setDate(copy.getDate() - 7);
                      } else {
                        copy.setDate(copy.getDate() - 1);
                      }
                      setCurrentCalendarDate(copy);
                    };

                    const handleNextPeriod = () => {
                      const copy = new Date(currentCalendarDate);
                      if (isMonthMode) {
                        copy.setMonth(copy.getMonth() + 1);
                      } else if (isWeekMode) {
                        copy.setDate(copy.getDate() + 7);
                      } else {
                        copy.setDate(copy.getDate() + 1);
                      }
                      setCurrentCalendarDate(copy);
                    };

                    return (
                      <div className="space-y-4 animate-fade-in text-left">
                        
                        {/* Interactive Calendar Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#101010]/80 p-3 rounded-xl border border-white/5 gap-3">
                          
                          {/* Left: Prev/Today/Next Navigation */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handlePrevPeriod}
                              className="p-1.5 border border-white/10 bg-black hover:bg-white/5 rounded text-gray-400 hover:text-white transition cursor-pointer"
                              title="Previous"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCurrentCalendarDate(new Date(2026, 4, 20))}
                              className="px-2.5 py-1 text-[10px] font-mono border border-white/10 bg-black hover:bg-white/5 text-gray-300 hover:text-white rounded uppercase transition cursor-pointer font-bold"
                            >
                              TODAY
                            </button>
                            <button
                              type="button"
                              onClick={handleNextPeriod}
                              className="p-1.5 border border-white/10 bg-black hover:bg-white/5 rounded text-gray-400 hover:text-white transition cursor-pointer"
                              title="Next"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            <span className="text-xs font-mono font-bold text-gray-300 pl-2">
                              {formattedCalendarPeriod()}
                            </span>
                          </div>

                          {/* Right: Day/Week/Month selector tabs */}
                          <div className="flex items-center bg-black border border-white/5 rounded-lg p-0.5">
                            {(['day', 'week', 'month'] as const).map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => setCalendarViewMode(mode)}
                                className={`px-2.5 py-1 text-[10px] font-mono rounded font-bold uppercase transition cursor-pointer ${
                                  calendarViewMode === mode
                                    ? 'bg-[#C5A039]/20 text-[#C5A029] border border-[#C5A029]/30'
                                    : 'text-gray-500 hover:text-white'
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* A. MONTH VIEW GRID */}
                        {isMonthMode && (
                          <div className="space-y-1">
                            {/* Weekday Titles */}
                            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-gray-500 uppercase py-1 select-none font-bold">
                              <div>Sun</div>
                              <div>Mon</div>
                              <div>Tue</div>
                              <div>Wed</div>
                              <div>Thu</div>
                              <div>Fri</div>
                              <div>Sat</div>
                            </div>

                            {/* Month boxes Grid */}
                            <div className="grid grid-cols-7 gap-1 text-xs">
                              {daysInGrid.map((cell, idx) => {
                                const dayAppointments = getAppointmentsForDate(cell.date);
                                const isToday = isSameDayStr(cell.date, new Date(2026, 4, 20));
                                return (
                                  <div
                                    key={idx}
                                    onClick={() => {
                                      setCurrentCalendarDate(cell.date);
                                      setCalendarViewMode('day');
                                    }}
                                    className={`min-h-[90px] p-2 rounded-lg border flex flex-col justify-between transition duration-155 relative cursor-pointer ${
                                      cell.isCurrentMonth
                                        ? 'bg-black border-white/10 hover:border-amber-500/30'
                                        : 'bg-[#050505]/45 border-white/5 text-gray-700 opacity-60'
                                    } ${isToday ? 'border-amber-500/60 bg-amber-500/[0.01]' : ''}`}
                                  >
                                    <div className="flex justify-between items-center">
                                      {isToday ? (
                                        <span className="px-1 py-0.5 rounded bg-amber-500 text-black font-mono text-[8.5px] font-black leading-none">
                                          {cell.date.getDate()} Today
                                        </span>
                                      ) : (
                                        <span className={`font-mono font-bold ${cell.isCurrentMonth ? 'text-gray-300' : 'text-gray-600'}`}>
                                          {cell.date.getDate()}
                                        </span>
                                      )}
                                      {dayAppointments.length > 0 && (
                                        <span className="text-[8px] font-mono text-amber-550/80 font-bold select-none">
                                          {dayAppointments.length} Cuts
                                        </span>
                                      )}
                                    </div>

                                    {/* Event markers lists */}
                                    <div className="mt-1.5 space-y-1 overflow-hidden flex-1 flex flex-col justify-end">
                                      {dayAppointments.slice(0, 3).map((apt) => {
                                        let bgClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                                        if (apt.status === 'completed') bgClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-555/20';
                                        if (apt.status === 'cancelled') bgClass = 'bg-red-500/10 text-red-400 border-red-500/15 line-through';
                                        if (apt.status === 'pending') bgClass = 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20 animate-pulse';

                                        return (
                                          <div
                                            key={apt.id}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedAptIdInCalendar(apt.id);
                                            }}
                                            className={`px-1 py-0.5 text-[8.5px] font-mono leading-none rounded border truncate text-left select-none hover:brightness-125 transition ${bgClass}`}
                                            title={`${apt.clientName}: ${apt.serviceName}`}
                                          >
                                            {apt.time} {apt.clientName.split(' ')[0]}
                                          </div>
                                        );
                                      })}
                                      {dayAppointments.length > 3 && (
                                        <div className="text-[7.5px] font-mono text-gray-500 text-center uppercase tracking-wider select-none leading-none pt-0.5">
                                          + {dayAppointments.length - 3} more cuts
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* B. WEEK VIEW COLUMNS */}
                        {isWeekMode && (
                          <div className="border border-white/5 rounded-xl overflow-hidden bg-black/60">
                            {/* Week column headers */}
                            <div className="grid grid-cols-7 border-b border-white/5 bg-[#101010] py-2 text-center font-mono text-[10px] font-bold">
                              {weekDays.map((date, index) => {
                                const isToday = isSameDayStr(date, new Date(2026, 4, 20));
                                return (
                                  <div 
                                    key={index}
                                    onClick={() => {
                                      setCurrentCalendarDate(date);
                                      setCalendarViewMode('day');
                                    }}
                                    className={`cursor-pointer hover:text-amber-400 transition flex flex-col items-center gap-0.5 ${
                                      isToday ? 'text-amber-500 font-extrabold' : 'text-gray-400'
                                    }`}
                                  >
                                    <span className="uppercase text-[8.5px] text-gray-550 block leading-none">
                                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="text-sm font-sans font-black mt-0.5">
                                      {date.getDate()}
                                    </span>
                                    {isToday && <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5 animate-pulse" />}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Appointments rows in Week */}
                            <div className="grid grid-cols-7 divide-x divide-white/5 h-[340px] overflow-y-auto p-2 gap-1 select-none">
                              {weekDays.map((date, colIdx) => {
                                const dayAppointments = getAppointmentsForDate(date);
                                return (
                                  <div key={colIdx} className="space-y-1.5 min-h-[140px] flex flex-col text-xs">
                                    {dayAppointments.length === 0 ? (
                                      <div className="text-[8.5px] font-mono text-gray-750 text-center pt-2 select-none italic">
                                        Free
                                      </div>
                                    ) : (
                                      dayAppointments.map((apt) => {
                                        let borderClass = 'border-l-2 border-l-amber-500 bg-amber-500/[0.02] border-white/10 text-gray-300';
                                        if (apt.status === 'completed') borderClass = 'border-l-2 border-l-emerald-500 bg-emerald-500/[0.01] border-white/5 text-gray-400';
                                        if (apt.status === 'cancelled') borderClass = 'border-l-l-solid border-l-2 border-l-red-500 bg-red-500/[0.01] border-white/5 text-gray-550 line-through';
                                        if (apt.status === 'pending') borderClass = 'border-l-2 border-l-yellow-400 bg-yellow-400/[0.03] border-white/10 text-yellow-101 animate-pulse';

                                        return (
                                          <div
                                            key={apt.id}
                                            onClick={() => setSelectedAptIdInCalendar(apt.id)}
                                            className={`p-1.5 rounded border text-left cursor-pointer hover:border-white/10 transition space-y-0.5 ${borderClass}`}
                                          >
                                            <span className="text-[8.5px] font-mono font-bold block text-white">{apt.time}</span>
                                            <span className="text-[9.5px] font-black block truncate leading-tight">{apt.clientName.split(' ')[0]}</span>
                                            <span className="text-[8px] text-gray-500 truncate block leading-tight">{apt.serviceName}</span>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* C. DAY VIEW TIMELINE */}
                        {isDayMode && (() => {
                          const todayApts = getAppointmentsForDate(currentCalendarDate);
                          return (
                            <div className="space-y-3 bg-[#111111]/45 p-4 rounded-2xl border border-white/5">
                              <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C5A029] border-b border-white/5 pb-2 font-black select-none">
                                Hourly timeline: {currentCalendarDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                              </h4>

                              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                                {todayApts.length === 0 ? (
                                  <div className="py-12 text-center text-gray-600 italic text-[11px] font-mono space-y-2">
                                    <Clock className="w-6 h-6 text-gray-700 mx-auto" />
                                    <p>No reservations currently on this specific date.</p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const yyyy = currentCalendarDate.getFullYear();
                                        const mm = padZero(currentCalendarDate.getMonth() + 1);
                                        const dd = padZero(currentCalendarDate.getDate());
                                        setWalkinDate(`${yyyy}-${mm}-${dd}`);
                                        setPortalTab('add-walkin');
                                      }}
                                      className="mt-2 text-[9px] font-mono font-bold tracking-wider text-amber-500 hover:text-amber-400 uppercase cursor-pointer bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10 transition"
                                    >
                                      + Register Walk-in client here
                                    </button>
                                  </div>
                                ) : (
                                  todayApts.map((apt) => {
                                    let indicatorBg = 'bg-amber-500';
                                    if (apt.status === 'completed') indicatorBg = 'bg-emerald-500';
                                    if (apt.status === 'cancelled') indicatorBg = 'bg-red-500';
                                    if (apt.status === 'pending') indicatorBg = 'bg-yellow-400 animate-pulse';

                                    return (
                                      <div
                                        key={apt.id}
                                        onClick={() => setSelectedAptIdInCalendar(apt.id)}
                                        className="bg-black hover:bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-xl p-3 flex items-center justify-between gap-4 cursor-pointer transition text-xs"
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className="flex flex-col items-center">
                                            <span className="font-mono text-[10.5px] font-bold text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded block whitespace-nowrap">
                                              {apt.time}
                                            </span>
                                            <span className={`w-1.5 h-1.5 rounded-full mt-2 ${indicatorBg}`} />
                                          </div>
                                          
                                          <div className="space-y-1 text-left">
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-white font-serif font-bold text-sm block leading-none">{apt.clientName}</span>
                                              <span className="text-gray-500 font-mono text-[9px] leading-none">(ID: {apt.id})</span>
                                            </div>
                                            <p className="text-gray-400 font-mono text-[10px]">
                                              Phone: <span className="text-gray-300">{apt.clientPhone}</span>
                                            </p>
                                            <div className="text-[10px] text-gray-300 px-2 py-0.5 bg-white/5 rounded border border-white/5 inline-flex items-center gap-1">
                                              <Scissors className="w-3 h-3 text-amber-500" />
                                              <span className="font-bold">{apt.serviceName}</span>
                                              <span className="text-gray-500">(${apt.servicePrice})</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                          {apt.status === 'pending' && (
                                            <>
                                              <button
                                                type="button"
                                                onClick={() => onUpdateAppointmentStatus(apt.id, 'booked')}
                                                className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black font-mono text-[9px] font-bold rounded uppercase cursor-pointer"
                                              >
                                                APPROVE
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                                                className="px-2 py-1 bg-black text-gray-400 hover:text-red-400 border border-white/10 font-mono text-[9px] rounded uppercase cursor-pointer"
                                              >
                                                CANCEL
                                              </button>
                                            </>
                                          )}
                                          {apt.status === 'booked' && (
                                            <>
                                              <button
                                                type="button"
                                                onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                                                className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-[9px] font-bold rounded uppercase cursor-pointer"
                                              >
                                                COMPLETE
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                                                className="px-2 py-1 bg-black text-gray-400 hover:text-red-400 border border-white/10 font-mono text-[9px] rounded uppercase cursor-pointer"
                                              >
                                                CANCEL
                                              </button>
                                            </>
                                          )}
                                          {apt.status === 'completed' && (
                                            <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded uppercase leading-none">
                                              Completed
                                            </span>
                                          )}
                                          {apt.status === 'cancelled' && (
                                            <span className="text-[8.5px] font-mono text-red-400 bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded uppercase leading-none">
                                              Cancelled
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
            {/* Simulated Booking Modal Detail Popover */}
            {selectedAptIdInCalendar && (() => {
              const apt = barberAppointments.find(a => a.id === selectedAptIdInCalendar);
              if (!apt) return null;
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4">
                  <div className="bg-[#121212] border border-[#C5A039]/30 w-full max-w-sm rounded-2xl p-6 space-y-4 text-[#e0e0e0] shadow-2xl relative text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#C5A039] font-bold">RESERVATION DETAILED CARD</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedAptIdInCalendar(null)}
                        className="text-gray-400 hover:text-white font-mono text-[10px] cursor-pointer border border-white/10 px-1.5 py-0.5 rounded hover:bg-white/5"
                      >
                        CLOSE
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <h4 className="text-base font-serif font-black text-white leading-tight">{apt.clientName}</h4>
                          <span className="text-[9px] text-gray-550 font-mono block mt-0.5">Booking ID: {apt.id}</span>
                        </div>
                        <div>
                          {apt.status === 'pending' && (<span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-550/25 text-yellow-400 leading-none block">Pending</span>)}
                          {apt.status === 'booked' && (<span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-550/25 text-amber-400 leading-none block">Scheduled</span>)}
                          {apt.status === 'completed' && (<span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-555/25 text-emerald-400 leading-none block">Completed</span>)}
                          {apt.status === 'cancelled' && (<span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-500/10 border border-red-555/25 text-red-400 line-through leading-none block">Cancelled</span>)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5 font-mono text-gray-300">
                        <div>
                          <span className="text-[8px] text-gray-500 block uppercase">Target Date</span>
                          <span className="font-bold text-white">{apt.date}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 block uppercase">Hour Slot</span>
                          <span className="font-bold text-white">{apt.time}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 block uppercase">Client Contact</span>
                          <span className="text-white block truncate">{apt.clientPhone}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 block uppercase">Client Email</span>
                          <span className="text-white truncate block">{apt.clientEmail || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="p-2 bg-white/[0.02] border border-white/10 rounded-lg flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Scissors className="w-3.5 h-3.5 text-amber-500" />
                          <div>
                            <span className="text-white block truncate leading-none font-bold">{apt.serviceName}</span>
                            <span className="text-[8.5px] text-gray-500 mt-0.5 block">Hair styling cut • ~30m</span>
                          </div>
                        </div>
                        <span className="text-xs text-amber-400 font-mono font-bold">${apt.servicePrice}</span>
                      </div>

                      {apt.notes && (
                        <div className="p-2 bg-black/50 border border-white/5 rounded text-[11px] text-gray-400 italic">
                          "{apt.notes}"
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      {apt.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateAppointmentStatus(apt.id, 'booked');
                              setSelectedAptIdInCalendar(null);
                            }}
                            className="flex-1 py-1.5 bg-[#C5A029] hover:bg-amber-400 text-black font-semibold rounded text-[10px] tracking-wider uppercase font-mono cursor-pointer animate-fade-in"
                          >
                            APPROVE
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateAppointmentStatus(apt.id, 'cancelled');
                              setSelectedAptIdInCalendar(null);
                            }}
                            className="flex-1 py-1.5 bg-black hover:bg-white/5 text-gray-400 hover:text-red-400 border border-white/10 rounded text-[10px] tracking-wider uppercase font-mono cursor-pointer"
                          >
                            CANCEL
                          </button>
                        </>
                      )}
                      {apt.status === 'booked' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateAppointmentStatus(apt.id, 'completed');
                              setSelectedAptIdInCalendar(null);
                            }}
                            className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded text-[10px] tracking-wider uppercase font-mono cursor-pointer animate-fade-in"
                          >
                            COMPLETE
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateAppointmentStatus(apt.id, 'cancelled');
                              setSelectedAptIdInCalendar(null);
                            }}
                            className="flex-1 py-1.5 bg-black hover:bg-white/5 text-gray-400 hover:text-red-400 border border-white/10 rounded text-[10px] tracking-wider uppercase font-mono cursor-pointer"
                          >
                            CANCEL
                          </button>
                        </>
                      )}
                      {apt.status === 'completed' && (
                        <div className="text-center w-full text-emerald-400 font-mono text-[10px] py-1 border border-emerald-500/10 rounded bg-emerald-500/5 select-none">
                          ✔ CUT RECORDED ON LEDGER
                        </div>
                      )}
                      {apt.status === 'cancelled' && (
                        <div className="text-center w-full text-red-400 font-mono text-[10px] py-1 border border-red-500/10 rounded bg-red-500/5 select-none">
                          ✖ CANCELLED APPOINTMENT SLOT
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}    </div>
              </div>
            )}

            {/* 4. SUB-TAB 2: PROFILE PROFILE MANAGEMENT */}
            {portalTab === 'profile' && (
              <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 sm:p-10 animate-fade-in gold-glow" id="dashboard-profile-panel">
                
                <div className="pb-4 border-b border-white/5 mb-6 text-left">
                  <h3 className="font-serif text-lg font-bold text-white">Manage Stylist Profile</h3>
                  <p className="text-xs text-gray-400 mt-1">Updates will reflect instantly across client-facing booking screens.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  {/* Two column layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block font-medium">Stylist Public Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-[#f59e0b] focus:border-amber-500 transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Business Role / Specialty Tag</label>
                      <input
                        type="text"
                        required
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all font-sans"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5 text-left">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block font-medium">Headshot Photo URL</label>
                      <input
                        type="url"
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-255 focus:outline-[#f59e0b] focus:border-amber-500 transition-all font-sans"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5 text-left">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Stylist Biography</label>
                      <textarea
                        rows={3}
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 resize-none focus:outline-[#f59e0b] focus:border-amber-500 transition-all font-sans"
                      />
                    </div>

                    {/* Working shift hours */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block font-medium">Work Shift Start</label>
                      <input
                        type="time"
                        value={editStartHour}
                        onChange={(e) => setEditStartHour(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block font-medium">Work Shift End</label>
                      <input
                        type="time"
                        value={editEndHour}
                        onChange={(e) => setEditEndHour(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200"
                      />
                    </div>
                  </div>

                  {/* Association services checkboxes */}
                  <div className="space-y-3 pt-2 text-left">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest block">Affiliated Handcrafted Services</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="profile-services-assignment">
                      {services.map((service) => {
                        const isChecked = editServices.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => handleToggleServiceAssociation(service.id)}
                            className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/50 transition duration-150 ${
                              isChecked ? 'bg-[#C5A059]/10 border-[#C5A059]/40 text-amber-400' : 'bg-black border-white/10 text-gray-300'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-sm font-serif font-bold text-white block leading-tight">{service.name}</span>
                              <span className="text-[11px] font-mono text-gray-500 hover:text-amber-500">${service.price} • {service.duration}m</span>
                            </div>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                              isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/10 bg-black'
                            }`}>
                              {isChecked && <Check className="w-4 h-4 text-black font-bold" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Save Triggers */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs transition duration-150 shadow cursor-pointer"
                    >
                      SAVE PROFILE SETTINGS
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* 5. SUB-TAB 3: ADD WALK-IN SCHEDULER */}
            {portalTab === 'add-walkin' && (
              <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 sm:p-10 animate-fade-in gold-glow" id="dashboard-walkin-panel">
                
                <div className="pb-4 border-b border-white/5 mb-6 text-left">
                  <h3 className="font-serif text-lg font-bold text-white">Manual Walk-In Reservation</h3>
                  <p className="text-xs text-gray-400 mt-1">Quickly schedule walk-in guests or reservations received via phone.</p>
                </div>

                {walkinSuccess && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-mono uppercase tracking-wider mb-6 text-left">
                    ★ WALK-IN CLIENT SECURED IN DIAL CALENDAR!
                  </div>
                )}

                {walkinError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/10 rounded-lg text-red-500 text-xs font-mono uppercase tracking-wider mb-6 flex items-center gap-2 text-left">
                    <ShieldAlert className="w-4 h-4" /> {walkinError}
                  </div>
                )}

                <form onSubmit={handleWalkinSubmit} className="space-y-4 max-w-xl">
                  
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-mono text-gray-400 uppercase block">Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Walk-In or Phone Guest Name"
                      value={walkinName}
                      onChange={(e) => setWalkinName(e.target.value)}
                      className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-[#f59e0b] focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-mono text-gray-400 uppercase block">Phone Contact (Preferred)</label>
                    <input
                      type="text"
                      placeholder="e.g. 555-0192"
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-[#f59e0b] focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5 text-left select-none">
                    <label className="text-xs font-mono text-gray-400 uppercase block">Selected Service *</label>
                    <select
                      required
                      value={walkinServiceId}
                      onChange={(e) => setWalkinServiceId(e.target.value)}
                      className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 font-sans"
                    >
                      <option value="" className="bg-black text-[#e0e0e0]">-- Choose Offered Ritual --</option>
                      {services.filter(s => currentBarber.services.includes(s.id)).map((service) => (
                        <option key={service.id} value={service.id} className="bg-black text-[#e0e0e0]">
                          {service.name} (${service.price} • {service.duration}m)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-mono text-gray-400 uppercase block">Target Date *</label>
                      <input
                        type="date"
                        required
                        value={walkinDate}
                        onChange={(e) => setWalkinDate(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-225 focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-mono text-gray-400 uppercase block">Hour (e.g. 10:30) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10:30"
                        value={walkinTime}
                        onChange={(e) => setWalkinTime(e.target.value)}
                        className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-mono text-gray-400 uppercase block">Staff Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. requested Sophia's traditional treatment, called over desk..."
                      value={walkinNotes}
                      onChange={(e) => setWalkinNotes(e.target.value)}
                      className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 resize-none focus:outline-[#f59e0b] focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div className="pt-2 text-left">
                    <button
                      type="submit"
                      className="px-5 py-3 bg-amber-505 bg-amber-500 hover:bg-amber-400 text-[#050505] font-bold rounded-lg text-xs transition cursor-pointer"
                    >
                      PERSIST INTERNALLY
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* 6. SYSTEM SUPERADMIN SUB-TABS */}
            {currentBarber.id === 'superadmin_hq' && portalTab === 'super_treatments' && (
              <div className="space-y-6 animate-fade-in" id="super-treatments-panel">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="text-left">
                    <h3 className="font-serif text-lg font-bold text-white">Treatments & Services Tariff Ledger</h3>
                    <p className="text-xs text-gray-400 mt-1">Configure general tariffs, add modern grooming rituals, or adjust estimated treatments duration.</p>
                  </div>
                  {!showServiceForm && (
                    <button
                      onClick={() => {
                        setEditingServiceId(null);
                        setServiceFormName('');
                        setServiceFormPrice(15);
                        setServiceFormDuration(30);
                        setServiceFormBio('');
                        setServiceFormCategory('Hair');
                        setShowServiceForm(true);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs font-mono uppercase tracking-wider transition duration-150 flex items-center gap-1.5 cursor-pointer uppercase font-sans shadow"
                    >
                      <Plus className="w-4 h-4" /> Add New Treatment
                    </button>
                  )}
                </div>

                {showServiceForm && (
                  <div className="bg-white/[0.02] border border-amber-500/20 rounded-2xl p-6 sm:p-8 space-y-6 text-left gold-glow animate-fade-in">
                    <h4 className="font-serif text-md font-bold text-amber-500">
                      {editingServiceId ? 'Edit Treatment Parameters' : 'Register New Luxury Treatment'}
                    </h4>
                    
                    <form onSubmit={handleServiceFormSubmit} className="space-y-4 max-w-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-400 block">TREATMENT NAME *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Traditional Beard Sculpting"
                            value={serviceFormName}
                            onChange={(e) => setServiceFormName(e.target.value)}
                            className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5 select-none">
                          <label className="text-xs font-mono text-gray-400 block">SERVICE CATEGORY *</label>
                          <select
                            required
                            value={serviceFormCategory}
                            onChange={(e) => setServiceFormCategory(e.target.value as any)}
                            className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-[#f59e0b] focus:border-amber-500 font-sans"
                          >
                            <option value="Hair">Hair Rituals</option>
                            <option value="Beard">Beard Sculpting</option>
                            <option value="Grooming">Facial Grooming</option>
                            <option value="Combo">Combo Luxury Bundles</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-400 block">PRICE (£ / $) *</label>
                          <input
                            type="number"
                            required
                            min={1}
                            value={serviceFormPrice || ''}
                            onChange={(e) => setServiceFormPrice(Number(e.target.value))}
                            className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-[#f59e0b] focus:border-amber-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-400 block">DURATION (MINUTES) *</label>
                          <input
                            type="number"
                            required
                            min={5}
                            step={5}
                            value={serviceFormDuration || ''}
                            onChange={(e) => setServiceFormDuration(Number(e.target.value))}
                            className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-[#f59e0b] focus:border-amber-500 font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-400 block">SERVICE DESCRIPTION & DETAILS</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Classic hot towel lather, razor framing contour, clean nourishing beard oils finish..."
                          value={serviceFormBio}
                          onChange={(e) => setServiceFormBio(e.target.value)}
                          className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-300 resize-none focus:outline-[#f59e0b] focus:border-amber-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowServiceForm(false)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-sm transition cursor-pointer"
                        >
                          {editingServiceId ? 'Update Ritual' : 'Publish Treatment'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="tariff-ledger-listing-grid">
                  {services.map((service) => (
                    <div 
                      key={service.id}
                      className="bg-white/[0.01] border border-white/10 p-5 rounded-xl flex flex-col justify-between hover:border-amber-500/30 transition duration-300 shadow gold-glow-hover"
                    >
                      <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest bg-amber-500/10 py-0.5 px-1.5 rounded">{service.category}</span>
                          <span className="text-sm font-mono font-bold text-white">${service.price}</span>
                        </div>
                        <h4 className="font-serif text-md font-bold text-white tracking-wide">{service.name}</h4>
                        <p className="text-xs text-gray-400 font-light line-clamp-2 md:h-8 leading-relaxed">{service.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-mono text-[11px]"><Clock className="w-3.5 h-3.5" /> {service.duration} mins</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditServiceClick(service)}
                            className="p-1 px-2.5 rounded bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-semibold transition duration-155 uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you absolutely sure you want to retire ${service.name}? Clients with existing bookings will lose linked treatments.`)) {
                                if (onDeleteService) onDeleteService(service.id);
                              }
                            }}
                            className="p-1 px-2.5 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-semibold transition duration-155 uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Retire
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentBarber.id === 'superadmin_hq' && portalTab === 'super_staff' && (
              <div className="space-y-6 animate-fade-in" id="super-staff-panel">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="text-left">
                    <h3 className="font-serif text-lg font-bold text-white">Licensed Staffing & Stylists Roster</h3>
                    <p className="text-xs text-gray-400 mt-1">Review stylist profiles, work shifts, or pre-configure staff capabilities.</p>
                  </div>
                  {!showAddBarberForm && (
                    <button
                      onClick={() => {
                        setNewBarberName('');
                        setNewBarberBio('');
                        setNewBarberAvatar('');
                        setShowAddBarberForm(true);
                        document.getElementById('add-stylist-trigger')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs font-mono uppercase tracking-wider transition duration-150 flex items-center gap-1.5 cursor-pointer uppercase font-sans shadow"
                    >
                      <UserPlus className="w-4 h-4" /> Recruit New Stylist
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="roster-listing-grid">
                  {barbers.map((barber) => (
                    <div 
                      key={barber.id}
                      className="bg-white/[0.01] border border-white/10 p-5 rounded-2xl space-y-4 hover:border-amber-500/30 transition duration-300 shadow gold-glow-hover flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={barber.avatar}
                          referrerPolicy="no-referrer"
                          alt={barber.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                        />
                        <div className="text-left space-y-1">
                          <h4 className="font-serif text-md font-bold text-white leading-tight">{barber.name}</h4>
                          <span className="text-[10px] bg-amber-500/10 text-amber-500 font-mono py-0.5 px-2 rounded uppercase tracking-wider">{barber.role}</span>
                          <span className="text-[11px] text-gray-400 font-mono block">Hrs: {barber.workingHours.start} - {barber.workingHours.end}</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed text-left h-12 italic">{barber.bio}</p>

                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <div className="text-left">
                          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Qualified Rituals:</span>
                          <div className="flex flex-wrap gap-1">
                            {services.filter(s => barber.services.includes(s.id)).map(s => (
                              <span key={s.id} className="text-[9px] bg-white/5 text-gray-300 font-mono py-0.5 px-1.5 rounded">{s.name}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => {
                              setActiveBarberId(barber.id);
                              setPortalTab('profile');
                            }}
                            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-semibold rounded-lg text-[10px] font-mono tracking-wider transition uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" /> Re-Configure Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentBarber.id === 'superadmin_hq' && portalTab === 'super_clients' && (
              <div className="space-y-6 animate-fade-in" id="super-clients-panel">
                <div className="pb-4 border-b border-white/5 text-left">
                  <h3 className="font-serif text-lg font-bold text-white">Registered Customer Registry</h3>
                  <p className="text-xs text-gray-400 mt-1">Audit guest reservation preferences, update notifications settings and modify customer status tags.</p>
                </div>

                {showUserForm && editingUserEmail && (
                  <div className="bg-white/[0.02] border border-amber-500/20 rounded-2xl p-6 sm:p-8 space-y-6 text-left gold-glow max-w-2xl animate-fade-in mt-4">
                    <h4 className="font-serif text-md font-bold text-amber-500">Edit Customer Information: {editingUserEmail}</h4>
                    
                    <form onSubmit={handleUserFormSubmit} className="space-y-4 text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-400 block uppercase">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={userFormName}
                            onChange={(e) => setUserFormName(e.target.value)}
                            className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-[#f59e0b] focus:border-amber-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono text-gray-400 block uppercase">Phone Contact</label>
                          <input
                            type="text"
                            value={userFormPhone}
                            onChange={(e) => setUserFormPhone(e.target.value)}
                            className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-[#f59e0b] focus:border-amber-500 font-sans"
                          />
                        </div>

                        <div className="space-y-1.5 select-none">
                          <label className="text-xs font-mono text-gray-400 block uppercase">Preferred Stylist</label>
                          <select
                            value={userFormBarber}
                            onChange={(e) => setUserFormBarber(e.target.value)}
                            className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 font-sans"
                          >
                            <option value="">No preference</option>
                            {barbers.map(b => (
                              <option key={b.id} value={b.name}>{b.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5 select-none font-sans">
                          <label className="text-xs font-mono text-gray-400 block uppercase">Notification Link</label>
                          <select
                            value={userFormNotif}
                            onChange={(e) => setUserFormNotif(e.target.value as any)}
                            className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500"
                          >
                            <option value="email">Email Digests</option>
                            <option value="sms">SMS Text Alert</option>
                            <option value="none">Disabled</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-gray-400 block uppercase">Visitor Style Preferences & Notes</label>
                        <textarea
                          rows={2}
                          value={userFormPrefs}
                          onChange={(e) => setUserFormPrefs(e.target.value)}
                          className="w-full py-2.5 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-300 resize-none focus:outline-[#f59e0b] focus:border-amber-500"
                          placeholder="E.g. low drop-fades, crisp beard line, prefers warm tonic scalp scrub..."
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowUserForm(false)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-sm transition cursor-pointer font-sans"
                        >
                          Persist Client Records
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white/[0.01] border border-white/10 rounded-2xl overflow-x-auto text-left max-w-full">
                  <table className="w-full text-xs font-sans whitespace-nowrap">
                    <thead className="bg-white/[0.02] border-b border-white/10 font-mono text-gray-400 uppercase text-[9.5px] tracking-wider">
                      <tr>
                        <th className="py-3 px-5 text-left font-semibold">User Details</th>
                        <th className="py-3 px-5 text-left font-semibold">Contact Email</th>
                        <th className="py-3 px-5 text-left font-semibold">Contact Phone</th>
                        <th className="py-3 px-5 text-left font-semibold">Style Preference</th>
                        <th className="py-3 px-5 text-left font-semibold">Preferred Barber</th>
                        <th className="py-3 px-5 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-light" id="registered-customer-table-body">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500 font-mono leading-none italic">
                            No Guest Registry found. Users populate here as soon as they subscribe or login.
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => {
                          const isSpecial = u.email.toLowerCase() === 'kaltrina99a@gmail.com';
                          return (
                            <tr key={u.email} className="hover:bg-white/[0.02] transition duration-150">
                              <td className="py-3.5 px-5 flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold border border-amber-500/25">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="text-white block font-medium font-serif leading-none">{u.name}</span>
                                  {isSpecial && <span className="text-[8px] bg-amber-500/10 text-amber-500 font-mono py-0.5 px-1.5 rounded block w-max uppercase mt-1">Superadmin</span>}
                                </div>
                              </td>
                              <td className="py-3.5 px-5 font-mono text-gray-400">{u.email}</td>
                              <td className="py-3.5 px-5 font-mono text-white">{u.phone || '—'}</td>
                              <td className="py-3.5 px-5 text-gray-400 max-w-xs truncate">{u.stylePreferences || '—'}</td>
                              <td className="py-3.5 px-5 text-amber-500 font-mono">{u.preferredBarberId || '—'}</td>
                              <td className="py-3.5 px-5 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditUserClick(u)}
                                    className="p-1.5 rounded bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-semibold transition uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer"
                                    title="Edit User"
                                  >
                                    <Edit className="w-3.5 h-3.5" /> Edit Profile
                                  </button>
                                  {!isSpecial && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Are you absolutely sure you want to terminate ${u.name}'s customer dashboard?`)) {
                                          if (onDeleteUser) onDeleteUser(u.email);
                                        }
                                      }}
                                      className="p-1.5 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-semibold transition uppercase text-[10px] tracking-wider flex items-center gap-1 cursor-pointer"
                                      title="Remove User"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Evict
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {currentBarber.id === 'superadmin_hq' && portalTab === 'super_brand' && (
              <div className="space-y-6 animate-fade-in text-left" id="super-brand-panel">
                <div className="pb-4 border-b border-white/5">
                  <h3 className="font-serif text-lg font-bold text-white">Dynamic Brand Identity & Themes</h3>
                  <p className="text-xs text-gray-400 mt-1">Configure structural color layouts and ambient glow to match physical lounge vibes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl" id="brand-swatches-grid">
                  {[
                    {
                      id: 'gold',
                      name: 'Sovereign Classic Gold',
                      desc: 'Classic British luxury atmosphere. Deep gold brass, vintage high-class mahogany leather nuances, and subtle warm amber glows.',
                      primary: '#C5A059',
                      previewBg: '#050505',
                      accentClass: 'bg-[#C5A059]'
                    },
                    {
                      id: 'emerald',
                      name: 'Royal Emerald Lounge',
                      desc: 'Equestrian gentlemen club setting. Lush emerald forest greens and majestic high-fidelity mahogany velvet leather trims.',
                      primary: '#10B981',
                      previewBg: '#03170d',
                      accentClass: 'bg-[#10B981]'
                    },
                    {
                      id: 'slate',
                      name: 'Cosmic Slate Carbon',
                      desc: 'Ultra-modern tech-driven styling salon, incorporating clean dark carbon slates paired with neon azure lighting.',
                      primary: '#3B82F6',
                      previewBg: '#020617',
                      accentClass: 'bg-[#3B82F6]'
                    },
                    {
                      id: 'crimson',
                      name: 'Ruby Crimson Velvet',
                      desc: 'Indulgent, high-energy retro barbers. Sumptuous ruby velvet, scarlet lighting gradients, and vintage deep cherry hues.',
                      primary: '#EF4444',
                      previewBg: '#110101',
                      accentClass: 'bg-[#EF4444]'
                    },
                    {
                      id: 'cyberpunk',
                      name: 'Cyberpunk Neon Grid',
                      desc: 'Futuristic sci-fi neon aesthetics. Vibrant fuchsia pink accentuating fuchsia laser lines and fuchsia glow lights.',
                      primary: '#EC4899',
                      previewBg: '#090312',
                      accentClass: 'bg-[#EC4899]'
                    }
                  ].map((tpl) => {
                    const isSelected = currentTheme === tpl.id;
                    return (
                      <div 
                        key={tpl.id}
                        onClick={() => onUpdateTheme && onUpdateTheme(tpl.id)}
                        className={`border rounded-2xl p-5 cursor-pointer relative transition duration-300 flex flex-col justify-between hover:scale-[1.01] ${
                          isSelected ? 'border-amber-500 bg-white/[0.02] gold-glow' : 'border-white/10 bg-white/[0.01]'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-serif text-sm font-black text-white">{tpl.name}</h4>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-3.5 h-3.5 rounded-full ${tpl.accentClass} inline-block border border-white/20`} />
                              <span className="w-3.5 h-3.5 rounded-full inline-block border border-white/20" style={{ backgroundColor: tpl.previewBg }} />
                            </div>
                          </div>

                          <p className="text-xs text-gray-450 text-gray-400 font-light leading-relaxed">{tpl.desc}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-gray-500 font-mono">Theme Alias: #{tpl.id}</span>
                          {isSelected ? (
                            <span className="text-amber-500 font-bold flex items-center gap-1 uppercase tracking-widest text-[9px]">
                              <CheckCircle className="w-3.5 h-3.5" /> Equipped
                            </span>
                          ) : (
                            <span className="text-gray-400 group-hover:text-amber-500 transition uppercase tracking-widest text-[9px] font-semibold">
                              Equip Theme
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
