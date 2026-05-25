/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ShieldCheck, Award, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onBookNowClick: () => void;
}

export default function HeroSection({ onBookNowClick }: HeroSectionProps) {
  // Stagger Container variant
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Upward slide variant
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="relative py-24 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505] overflow-hidden text-[#e0e0e0]">
      {/* Decorative Accent Background Blurs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.08, 0.05],
          x: [0, 40, 0] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.07, 0.05],
          y: [0, -40, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/10 to-transparent p-1.5 pr-4 rounded-full border border-amber-500/20 text-amber-400 text-xs tracking-wider uppercase font-mono shadow-inner shadow-amber-950/10" 
              id="hero-badge"
            >
              <span className="bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold text-[10px] tracking-normal animate-pulse">Elite</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Handcrafted Elite Grooming</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white select-none"
              >
                Classic Cuts.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 font-serif">
                  Modern Rituals.
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-gray-400 leading-relaxed font-sans font-light"
              >
                Welcome to a grooming experience designed for the modern gentleman. We match expert barbers, state-of-the-art scissor-fades, and comforting straight-razor sessions with absolute scheduling convenience.
              </motion.p>
            </div>

            {/* Premium CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4" 
              id="hero-actions-container"
            >
              <button
                id="hero-cta-book"
                onClick={onBookNowClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 font-sans font-semibold text-black rounded-xl shadow-lg shadow-amber-500/10 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] transition-all duration-150 text-center tracking-wide cursor-pointer hover:shadow-xl hover:shadow-amber-500/20"
              >
                Schedule Appointment
              </button>
              <a
                href="#services-section"
                id="hero-learn-more"
                className="w-full sm:w-auto px-8 py-4 bg-white/[0.03] border border-white/10 text-gray-300 font-sans font-semibold rounded-xl hover:bg-white/[0.08] hover:text-white transition-all duration-150 text-center"
              >
                View Services & Prices
              </a>
            </motion.div>

            {/* Quick trust indicators */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0" 
              id="hero-stats"
            >
              <div className="text-center lg:text-left">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-500">4.92</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">Average Rating</span>
              </div>
              <div className="text-center lg:text-left border-x border-white/10 px-2">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-white">3</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">Barber Artisans</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-white">100%</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">Comfort Finish</span>
              </div>
            </motion.div>
          </div>

          {/* Artistic Feature Frame */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative group max-w-sm sm:max-w-md w-full"
            >
              {/* Gold luxury outline */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-800 rounded-2xl blur-lg opacity-30 group-hover:opacity-55 transition duration-1000 group-hover:duration-200" />
              
              <div className="relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10 p-6 space-y-6 shadow-2xl">
                <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=480&q=80"
                    referrerPolicy="no-referrer"
                    alt="Premium Grooming"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 brightness-90 filter"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-[#050505]/95 border border-amber-500/40 text-amber-400">
                    <Award className="w-3 h-3" /> Artisan Tradition
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-500 animate-bounce" style={{ animationDuration: '3s' }} /> Professional Standards
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-sans font-light">
                    Our workspace is thoroughly sanitized between appointments. We exclusively employ hot organic mint steaming, custom shave serums, and premium pomades to ensure optimal health and shine.
                  </p>
                  
                  {/* Styled Review Ribbon */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </div>
                    <span className="font-mono text-amber-400/90 italic">"Pure perfection" — Liam P.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
