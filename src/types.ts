/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: 'Hair' | 'Beard' | 'Grooming' | 'Combo';
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  bio: string;
  avatar: string;
  services: string[]; // Service IDs offered by this barber
  workingHours: {
    start: string; // "HH:MM"
    end: string;   // "HH:MM"
  };
  breakTimes?: {
    start: string;
    end: string;
  }[];
}

export interface Appointment {
  id: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
  status: 'pending' | 'booked' | 'completed' | 'cancelled';
  createdAt: string;
  clientUserEmail?: string; // Links back to registered user account if applicable
}

export interface UserProfile {
  email: string;
  password?: string;
  name: string;
  phone: string;
  avatar?: string;
  preferredBarberId?: string;
  stylePreferences?: string;
  notificationType?: 'email' | 'sms' | 'none';
  createdAt: string;
}

export interface ShopReview {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  barberName: string;
}
