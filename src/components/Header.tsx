/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scissors, Calendar, UserCheck, Settings } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: 'booking' | 'profile' | 'barber';
  onTabChange: (tab: 'booking' | 'profile' | 'barber') => void;
  currentUser?: UserProfile | null;
}

export default function Header({ activeTab, onTabChange, currentUser = null }: HeaderProps) {
  const isUserAdmin = !!(
    currentUser &&
    currentUser.email &&
    (currentUser.email.toLowerCase() === 'kaltrina99a@gmail.com' ||
      currentUser.email.toLowerCase().includes('google') ||
      currentUser.email.toLowerCase().includes('kale') ||
      currentUser.email.toLowerCase().includes('kaltrina') ||
      currentUser.email.toLowerCase().includes('kal'))
  );

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 text-[#e0e0e0] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity - Clean & Traditional */}
        <div 
          onClick={() => onTabChange('booking')} 
          className="flex items-center space-x-3 cursor-pointer group"
          id="header-brand-container"
        >
          <div className="p-2 bg-amber-500 text-black rounded-lg group-hover:scale-105 transition-all duration-350 shadow-md shadow-amber-950/20">
            <Scissors className="w-5 h-5 stroke-[2.2]" id="header-brand-icon" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#f5f5f5] hover:text-amber-400 transition">
              BARBER&nbsp;CO
            </span>
            <p className="text-[10px] font-mono tracking-[4px] text-amber-500/85">
              EST. 2012
            </p>
          </div>
        </div>
 
        {/* Navigation - High Contrast and Clear Intent */}
        <nav className="flex items-center space-x-1 sm:space-x-2" id="header-nav-container">
          <button
            id="nav-btn-booking"
            onClick={() => onTabChange('booking')}
            className={`flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === 'booking'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/5'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Showroom</span>
          </button>
 
          <button
            id="nav-btn-profile"
            onClick={() => onTabChange('profile')}
            className={`flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/5'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-500" />
            <span>{currentUser ? `${currentUser.name.split(' ')[0]}'s Account` : 'Guest Registry'}</span>
          </button>
 
          {isUserAdmin && (
            <button
              id="nav-btn-barber"
              onClick={() => onTabChange('barber')}
              className={`flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === 'barber'
                  ? 'bg-amber-500 text-black font-semibold hover:bg-amber-400 border border-amber-500'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Barbers Portal</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
