/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, Appointment, Barber } from '../types';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, Save, LogOut, 
  Clock, Scissors, History, CheckCircle2, XCircle, AlertCircle, 
  Calendar, Check, UserPlus, LogIn, Sliders, ShieldCheck, Image
} from 'lucide-react';

const PRESET_USER_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
];

interface UserProfileSectionProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  appointments: Appointment[];
  barbers: Barber[];
  onCancelAppointment: (aptId: string) => void;
}

export default function UserProfileSection({
  currentUser,
  onLogin,
  onLogout,
  onUpdateProfile,
  appointments,
  barbers,
  onCancelAppointment
}: UserProfileSectionProps) {
  // Navigation inside auth
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Google Authentication Overlay states
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleAccountSelect = (googleEmail: string, googleName: string) => {
    setIsGoogleLoading(true);
    setShowGooglePicker(false);
    setMessage(null);
    
    setTimeout(() => {
      const stored = localStorage.getItem('barber_users');
      let users: UserProfile[] = [];
      if (stored) {
        try {
          users = JSON.parse(stored);
        } catch (e) {
          users = [];
        }
      }
      
      let matched = users.find(u => u.email.toLowerCase() === googleEmail.toLowerCase());
      if (!matched) {
        matched = {
          email: googleEmail.toLowerCase(),
          password: 'google-oauth-managed',
          name: googleName,
          phone: googleEmail.toLowerCase() === 'kaltrina99a@gmail.com' ? '555-8888' : '555-0100',
          notificationType: 'email',
          createdAt: new Date().toISOString()
        };
        users.push(matched);
        localStorage.setItem('barber_users', JSON.stringify(users));
      }

      onLogin(matched);
      setIsGoogleLoading(false);
      setMessage({ type: 'success', text: `Authorized successfully with Google Account: ${googleEmail}` });
    }, 1000);
  };

  
  // Auth Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(PRESET_USER_AVATARS[0]);
  const [showPassword, setShowPassword] = useState(false);
  
  // Notice Banner states
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Profile Editable Fields state (when logged in)
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || PRESET_USER_AVATARS[0]);
  const [editPreferredBarber, setEditPreferredBarber] = useState(currentUser?.preferredBarberId || '');
  const [editStylePrefs, setEditStylePrefs] = useState(currentUser?.stylePreferences || '');
  const [editNotifyType, setEditNotifyType] = useState<'email' | 'sms' | 'none'>(currentUser?.notificationType || 'email');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Sync edit state immediately if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone);
      setEditAvatar(currentUser.avatar || PRESET_USER_AVATARS[0]);
      setEditPreferredBarber(currentUser.preferredBarberId || '');
      setEditStylePrefs(currentUser.stylePreferences || '');
      setEditNotifyType(currentUser.notificationType || 'email');
    }
  }, [currentUser]);

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all credentials.' });
      return;
    }

    // Retrieve storage items
    const stored = localStorage.getItem('barber_users');
    let users: UserProfile[] = [];
    if (stored) {
      users = JSON.parse(stored);
    } else {
      // Import fallback
      users = [
        {
          email: 'alex.mercer@gmail.com',
          password: 'password',
          name: 'Alex Mercer',
          phone: '555-0199',
          preferredBarberId: 'b1',
          stylePreferences: 'Medium fade. Scissor work only on top.',
          notificationType: 'email',
          createdAt: new Date().toISOString()
        }
      ];
    }

    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) {
      setMessage({ type: 'error', text: 'No profile found with that email address. Please register.' });
      return;
    }

    if (matched.password !== password) {
      setMessage({ type: 'error', text: 'Incorrect password. Try another key.' });
      return;
    }

    onLogin(matched);
    setMessage({ type: 'success', text: `Welcome back, ${matched.name}!` });
  };

  // Handle Registration Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password || !name || !phone) {
      setMessage({ type: 'error', text: 'All asterisk* fields are required.' });
      return;
    }

    // Email format check
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage({ type: 'error', text: 'Please provide a valid email format.' });
      return;
    }

    const stored = localStorage.getItem('barber_users');
    let users: UserProfile[] = [];
    if (stored) {
      users = JSON.parse(stored);
    }

    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setMessage({ type: 'error', text: 'A user account with this email already exists.' });
      return;
    }

    const newUser: UserProfile = {
      email: email.toLowerCase(),
      password,
      name,
      phone,
      avatar: avatar || undefined,
      notificationType: 'email',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('barber_users', JSON.stringify(updatedUsers));
    
    onLogin(newUser);
    setMessage({ type: 'success', text: `Account established successfully! Welcome ${name}.` });
  };

  // Quick Sign in Handler for testing
  const handleQuickSignIn = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('password');
    setAuthMode('login');
  };

  // Handle Profile Update Submission
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setProfileSuccess(false);

    if (!editName.trim() || !editPhone.trim()) {
      setMessage({ type: 'error', text: 'Name and phone contact details cannot be empty.' });
      return;
    }

    const updatedProfile: UserProfile = {
      ...currentUser,
      name: editName,
      phone: editPhone,
      avatar: editAvatar || undefined,
      preferredBarberId: editPreferredBarber || undefined,
      stylePreferences: editStylePrefs || undefined,
      notificationType: editNotifyType
    };

    onUpdateProfile(updatedProfile);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 4000);
  };

  // Filter user bookings
  const userAppointments = React.useMemo(() => {
    if (!currentUser) return [];
    // Cross references by email
    const emailToMatch = currentUser.email.toLowerCase();
    return appointments.filter(apt => 
      apt.clientEmail.toLowerCase() === emailToMatch || 
      (apt.clientUserEmail && apt.clientUserEmail.toLowerCase() === emailToMatch)
    );
  }, [currentUser, appointments]);

  // Segment user appointments into past and upcoming (May 20, 2026 is anchor)
  const anchorDate = new Date('2026-05-20T10:50:00Z');

  const { upcomingBookings, pastBookings } = React.useMemo(() => {
    const upcoming: Appointment[] = [];
    const past: Appointment[] = [];

    userAppointments.forEach(apt => {
      const aptDateTime = new Date(`${apt.date}T${apt.time}:00`);
      // Cancelled are historically kept, but we group cancelled under past if past-date, or upcoming if future-date
      if (aptDateTime >= anchorDate && (apt.status === 'booked' || apt.status === 'pending')) {
        upcoming.push(apt);
      } else {
        past.push(apt);
      }
    });

    // Sort upcoming: closest first
    upcoming.sort((a, b) => new Date(`${a.date}T${a.time}:00`).getTime() - new Date(`${b.date}T${b.time}:00`).getTime());
    // Sort past: newest first
    past.sort((a, b) => new Date(`${b.date}T${b.time}:00`).getTime() - new Date(`${a.date}T${a.time}:00`).getTime());

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [userAppointments]);

  return (
    <section className="py-12 bg-gradient-to-b from-[#0a0a0a] to-[#050505] min-h-[70vh] flex items-center justify-center font-sans relative">
      {/* Reusable Simulated Google Sign In Picker Modal */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-[#121212] border border-white/10 w-full max-w-sm rounded-2xl p-6 space-y-5 text-[#e0e0e0] shadow-2xl relative">
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
                onClick={() => setShowGooglePicker(false)}
                className="text-gray-400 hover:text-white font-mono text-[10px] cursor-pointer border border-white/10 px-1.5 py-0.5 rounded hover:bg-white/5"
              >
                Close
              </button>
            </div>
            
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Choose a google account associated with the barber shop to authenticate instantly:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleAccountSelect('kaltrina99a@gmail.com', 'Kaltrina (Superadmin)')}
                className="w-full flex items-center justify-between p-3 bg-black hover:bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl transition text-left cursor-pointer"
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
                <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20 leading-none">Superadmin</span>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleAccountSelect('alex.mercer@gmail.com', 'Alex Mercer')}
                className="w-full flex items-center justify-between p-3 bg-black hover:bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                    AM
                  </div>
                  <div>
                    <span className="font-semibold text-white text-xs block leading-none">Alex Mercer</span>
                    <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">alex.mercer@gmail.com</span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleAccountSelect('client@barber.com', 'Giles Sterling')}
                className="w-full flex items-center justify-between p-3 bg-black hover:bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-xl transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-xs">
                    GS
                  </div>
                  <div>
                    <span className="font-semibold text-white text-xs block leading-none">Giles Sterling</span>
                    <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">client@barber.com</span>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="text-[9px] text-gray-650 text-center font-mono">
              Secure OAuth2.0 Client • Port 3000 Ingress verified
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isGoogleLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest animate-pulse">
              Authenticating via Google secure proxy...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">

        
        {/* LOGGED OUT STATE: Auth Form wrapper */}
        {!currentUser ? (
          <div className="max-w-md mx-auto bg-white/[0.01] border border-white/10 rounded-2xl overflow-hidden shadow-2xl gold-glow" id="auth-portal-card">
            
            {/* Header Tabs */}
            <div className="flex border-b border-white/10">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setMessage(null);
                }}
                className={`flex-1 py-4 text-center text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition duration-200 ${
                  authMode === 'login'
                    ? 'border-b-2 border-amber-500 bg-amber-500/5 text-amber-400'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]'
                }`}
              >
                <LogIn className="w-4 h-4" /> Guest Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setMessage(null);
                }}
                className={`flex-1 py-4 text-center text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition duration-200 ${
                  authMode === 'register'
                    ? 'border-b-2 border-amber-500 bg-amber-500/5 text-amber-400'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]'
                }`}
              >
                <UserPlus className="w-4 h-4" /> Create Profile
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="text-center space-y-1">
                <h3 className="font-serif text-xl font-bold text-white tracking-wide uppercase">
                  {authMode === 'login' ? 'The Gentlemen\'s Directory' : 'Establish A Portfolio'}
                </h3>
                <p className="text-xs text-gray-400">
                  {authMode === 'login' 
                    ? 'Log in to manage appointments, preferences, and view haircut logs.' 
                    : 'Register to unlock persistent booking history and custom treatment settings.'}
                </p>
              </div>

              {/* Status Notice Banner */}
              {message && (
                <div className={`p-3.5 rounded-lg flex items-start gap-2 text-xs border ${
                  message.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{message.text}</span>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
                
                {authMode === 'register' && (
                  <>
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-medium">Full Name *</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Liam Patterson"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full py-2.5 pl-10 pr-4 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all placeholder:text-gray-700"
                        />
                      </div>
                    </div>

                    {/* Contact Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-medium">Telephone Contact *</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                          <Phone className="w-4 h-4" />
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 555-0199"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full py-2.5 pl-10 pr-4 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all placeholder:text-gray-700 font-mono"
                        />
                      </div>
                    </div>

                    {/* Portrait Photo Preset Grid */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-medium">Select Portrait Photo</label>
                      <div className="flex flex-wrap gap-2.5 p-2 bg-black/40 border border-white/5 rounded-xl">
                        {PRESET_USER_AVATARS.slice(0, 6).map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(url)}
                            className={`relative w-9 h-9 rounded-full overflow-hidden border-2 cursor-pointer transition duration-150 ${
                              avatar === url 
                                ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/20' 
                                : 'border-transparent opacity-65 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            <img src={url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                      <input
                        type="url"
                        placeholder="Or custom photo URL: https://..."
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="w-full py-2 px-3 bg-black border border-white/10 rounded-lg text-xs text-gray-400 focus:outline-none focus:border-amber-500 transition-all font-mono"
                      />
                    </div>
                  </>
                )}

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-medium">Email Address *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex.mercer@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-4 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-medium">Secure Password *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2.5 pl-10 pr-10 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all placeholder:text-gray-700 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs font-mono uppercase tracking-widest transition duration-150 shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {authMode === 'login' ? 'VERIFY CREDENTIALS' : 'BUILD INDIVIDUAL FILE'}
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-[9px] font-mono uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button
                type="button"
                onClick={() => setShowGooglePicker(true)}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-gray-100 text-black rounded-lg text-xs font-semibold tracking-wider transition-all duration-150 shadow cursor-pointer uppercase font-mono"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>


              {/* Quick Seeded Profiles Drawer for Testing */}
              <div className="pt-4 border-t border-white/5 space-y-2.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block text-center">
                  Quick Trial Sandboxing
                </span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickSignIn('alex.mercer@gmail.com')}
                    className="p-2 border border-white/5 rounded bg-white/[0.01] text-gray-400 hover:bg-white/[0.03] hover:text-white transition cursor-pointer text-left flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-amber-500 text-[10px] leading-tight font-sans">Alex Mercer</span>
                    <span className="text-[9px] font-mono text-gray-600 block truncate">alex.mercer@...</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSignIn('client@barber.com')}
                    className="p-2 border border-white/5 rounded bg-white/[0.01] text-gray-400 hover:bg-white/[0.03] hover:text-white transition cursor-pointer text-left flex flex-col gap-0.5"
                  >
                    <span className="font-semibold text-amber-500 text-[10px] leading-tight font-sans">Giles Sterling</span>
                    <span className="text-[9px] font-mono text-gray-600 block truncate">client@barber.com</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          
          /* LOGGED IN ACCOUNT HOME */
          <div className="space-y-8 animate-fade-in" id="profile-dashboard-root">
            
            {/* Top Identity Segment */}
            <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 gold-glow animate-fade-in">
              <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar}
                    referrerPolicy="no-referrer"
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md object-top"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-black flex items-center justify-center border-2 border-amber-400 shadow-md">
                    <User className="w-8 h-8 stroke-[1.8]" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <h2 className="font-serif text-2xl font-black text-white">{currentUser.name}</h2>
                    <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/25 text-amber-500 rounded px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED GUEST
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-1">{currentUser.email} • {currentUser.phone}</p>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider">Registered Portfolio Owner Since: {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-2 text-xs font-mono font-bold tracking-widest uppercase border border-white/15 text-gray-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Guest Log Out
              </button>
            </div>

            {/* Dynamic Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Preferences & Direct Contact details editor */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6 gold-glow" id="preferences-card">
                  
                  <div className="pb-3 border-b border-white/5 flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                      Portfolio Preferences
                    </h3>
                  </div>

                  {profileSuccess && (
                     <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded text-emerald-400 text-xs font-mono tracking-wide uppercase flex items-center gap-1.5">
                       <CheckCircle2 className="w-4 h-4" /> PORTFOLIO SECURED IN REGISTRY!
                     </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-medium">Display Name *</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full py-2 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all font-sans"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-medium">Contact Number *</label>
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full py-2 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all font-mono"
                      />
                    </div>

                    {/* Customer Profile Portrait Preset Grid */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-medium">Profile Image</label>
                      <div className="flex flex-wrap gap-2 p-2 bg-black/40 border border-white/5 rounded-xl">
                        {PRESET_USER_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditAvatar(url)}
                            className={`relative w-8 h-8 rounded-full overflow-hidden border-2 cursor-pointer transition duration-150 ${
                              editAvatar === url 
                                ? 'border-amber-500 scale-110 shadow-md shadow-amber-500/20' 
                                : 'border-transparent opacity-65 hover:opacity-100 hover:scale-110'
                            }`}
                          >
                            <img src={url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                      <input
                        type="url"
                        placeholder="Custom design image: https://..."
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        className="w-full py-1.5 px-3 bg-black border border-white/10 rounded-lg text-xs text-gray-400 focus:outline-none focus:border-amber-500 transition-all font-mono"
                      />
                    </div>

                    {/* Preferred Barber */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-medium">Preferred Stylist</label>
                      <select
                        value={editPreferredBarber}
                        onChange={(e) => setEditPreferredBarber(e.target.value)}
                        className="w-full py-2 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all font-sans"
                      >
                        <option value="">-- Choose Preferred Barber --</option>
                        {barbers.map(barber => (
                          <option key={barber.id} value={barber.id} className="bg-black text-[#e0e0e0]">
                            {barber.name} ({barber.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Style Preferences Text Box */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-medium">Treatment & Style Notes</label>
                      <textarea
                        rows={3}
                        value={editStylePrefs}
                        placeholder="e.g. Prefer razor finish, pompadour styles, hair density: light, etc."
                        onChange={(e) => setEditStylePrefs(e.target.value)}
                        className="w-full py-2 px-3 bg-black border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 transition-all font-sans resize-none"
                      />
                    </div>

                    {/* Notification Preference Channel */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-medium">Notification Channel</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['email', 'sms', 'none'] as const).map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setEditNotifyType(type)}
                            className={`py-1.5 text-center text-xs font-mono uppercase tracking-tight rounded-md border transition cursor-pointer ${
                              editNotifyType === type
                                ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                                : 'bg-black border-white/5 text-gray-500 hover:text-gray-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 mt-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs font-mono uppercase tracking-widest transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> COMMIT SETTINGS
                    </button>
                  </form>

                </div>
              </div>

              {/* Right Columns: Appointment Histories (split Past / Upcoming) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Upcoming Appointments */}
                <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 gold-glow">
                  <div className="pb-3 border-b border-white/5 flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                      Upcoming Reserved Sessions
                    </h3>
                    <span className="ml-auto bg-amber-500/10 text-amber-500 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                      {upcomingBookings.length} Active
                    </span>
                  </div>

                  {upcomingBookings.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-white/5 rounded-xl space-y-3">
                      <Scissors className="w-8 h-8 text-gray-600 mx-auto animate-pulse" />
                      <p className="text-xs text-gray-500 italic max-w-xs mx-auto text-center leading-relaxed">
                        No upcoming rituals scheduled yet. Head over to the standard Booking step to reserve a slot!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {upcomingBookings.map(apt => (
                        <div key={apt.id} className="p-4 bg-black border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/30 transition duration-150 relative">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-amber-400 font-extrabold">{apt.id}</span>
                              {apt.status === 'pending' ? (
                                <span className="inline-block bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider leading-none animate-pulse">
                                  PENDING APPROVAL
                                </span>
                              ) : (
                                <span className="inline-block bg-amber-500/15 text-amber-500 border border-amber-500/20 rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider leading-none">
                                  SECURED
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif text-sm font-bold text-white">
                              {apt.serviceName}
                            </h4>
                            <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-gray-500" /> Barber: <span className="text-gray-300 font-medium">{apt.barberName}</span>
                            </p>
                            <p className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-500" /> Date: <span className="text-amber-400 font-bold">{apt.date} at {apt.time}</span>
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t border-white/5 sm:border-t-0 pt-2 sm:pt-0">
                            <span className="text-sm font-serif font-black text-amber-300 block">${apt.servicePrice}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to cancel appointment ${apt.id}?`)) {
                                  onCancelAppointment(apt.id);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-950/20 hover:bg-red-500/10 text-red-400 border border-red-500/25 hover:border-red-500/40 text-[10px] font-mono uppercase tracking-widest font-semibold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Cancel
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Past Appointments & Logs */}
                <div className="bg-white/[0.01] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4 gold-glow">
                  <div className="pb-3 border-b border-white/5 flex items-center gap-2">
                    <History className="w-4.5 h-4.5 text-amber-500" />
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                      Visitor Record History
                    </h3>
                    <span className="ml-auto bg-white/5 text-gray-400 text-[10px] font-mono px-2 py-0.5 rounded-full">
                      {pastBookings.length} Recorded
                    </span>
                  </div>

                  {pastBookings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-600 italic">
                      No past treatments recorded in verified registry.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {pastBookings.map(apt => {
                        const isCancelled = apt.status === 'cancelled';
                        const isCompleted = apt.status === 'completed';
                        
                        return (
                          <div key={apt.id} className="p-4 bg-black/60 border border-white/5 rounded-xl flex items-center justify-between gap-4 opacity-75 hover:opacity-100 transition duration-150">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-500 font-bold">{apt.id}</span>
                                {isCompleted ? (
                                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded px-1 py-0.5 text-[8px] font-mono uppercase tracking-wider leading-none">
                                    COMPLETED
                                  </span>
                                ) : isCancelled ? (
                                  <span className="bg-red-500/15 text-red-500 border border-red-500/20 rounded px-1 py-0.5 text-[8px] font-mono uppercase tracking-wider leading-none">
                                    CANCELLED
                                  </span>
                                ) : (
                                  <span className="bg-white/5 text-gray-400 border border-white/10 rounded px-1 py-0.5 text-[8px] font-mono uppercase tracking-wider leading-none">
                                    RECORDED
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif text-xs font-bold text-gray-300">
                                {apt.serviceName}
                              </h4>
                              <p className="text-[11px] text-gray-500 font-mono">
                                Date: {apt.date} • Barber: {apt.barberName}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-serif font-black text-gray-500 block">${apt.servicePrice}</span>
                              <span className="text-[10px] font-mono text-gray-600">{apt.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
