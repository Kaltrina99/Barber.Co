/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Barber, Service, Appointment, ShopReview, UserProfile } from './types';

// Initial default services
export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Signature Haircut',
    description: 'Precision scissor and clipper cut tailored to your head shape, completed with a premium styling product and hot towel finish.',
    price: 45,
    duration: 30,
    category: 'Hair',
  },
  {
    id: 's2',
    name: 'Royal Hot Towel Shave',
    description: 'Traditional straight razor shave with pre-shave oil, thick lather, hot steam towels, and cold-stone calming lotion application.',
    price: 35,
    duration: 30,
    category: 'Beard',
  },
  {
    id: 's3',
    name: 'Beard Sculpting & Trim',
    description: 'Detailed beard framing and thickness reduction using clippers, finished with a crisp straight razor outline and hydrating beard oil.',
    price: 30,
    duration: 20,
    category: 'Beard',
  },
  {
    id: 's4',
    name: 'Scalp Therapy & Massage',
    description: 'Exfoliating tea tree scalp wash, deep conditioning massage to boost circulation, followed by a professional blow-dry and styling.',
    price: 40,
    duration: 25,
    category: 'Grooming',
  },
  {
    id: 's5',
    name: 'The Sovereign Combo',
    description: 'Our most requested pair: The Signature Haircut combined with detailed Beard Sculpting, warm lather, and dual steam towels.',
    price: 70,
    duration: 50,
    category: 'Combo',
  },
  {
    id: 's6',
    name: 'The Royal Ritual',
    description: 'The ultimate luxury package: Signature Haircut, Royal Hot Towel Shave, custom facial pore cleanse with charcoal mud mask, and hot arm massage.',
    price: 110,
    duration: 80,
    category: 'Combo',
  },
];

// Initial default barbers
export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Marcus Vance',
    role: 'Master Barber & Founder',
    rating: 4.9,
    reviewsCount: 142,
    bio: 'With over 15 years behind the chair, Marcus specializes in timeless mid-century pompadours, classic scissor designs, and the pristine traditional straight-razor shave.',
    avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80',
    services: ['s1', 's2', 's3', 's5', 's6'],
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
  },
  {
    id: 'b2',
    name: 'Jaxson Reed',
    role: 'Senior Fade Specialist',
    rating: 4.8,
    reviewsCount: 98,
    bio: 'Jaxson is the studio maestro for modern skin-fades, crisp hair-tattoo graphics, and texturized crops. He keeps his techniques at the cutting edge of street style.',
    avatar: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80',
    services: ['s1', 's3', 's5'],
    workingHours: {
      start: '10:00',
      end: '19:00',
    },
  },
  {
    id: 'b3',
    name: 'Sophia Stone',
    role: 'Grooming & Wellness Director',
    rating: 4.95,
    reviewsCount: 115,
    bio: 'Sophia blends traditional grooming with modern wellness. An expert in hair therapies, beard coloring, soothing facial mask treatments, and intricate styling.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    services: ['s1', 's4', 's5', 's6'],
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
  },
];

// Initial default reviews
export const INITIAL_REVIEWS: ShopReview[] = [
  {
    id: 'r1',
    clientName: 'Liam Patterson',
    rating: 5,
    comment: 'Marcus provides an unmatched level of detail. The hot towel shave was absolute heaven. A true artist of his craft!',
    date: '2026-05-18',
    barberName: 'Marcus Vance',
  },
  {
    id: 'r2',
    clientName: 'Devon Kincaid',
    rating: 5,
    comment: 'Best skin fade I have ever had. Jaxson is incredibly fast but does not miss a single millimeter. Recommend booking early.',
    date: '2026-05-15',
    barberName: 'Jaxson Reed',
  },
  {
    id: 'r3',
    clientName: 'Harrison Forde',
    rating: 5,
    comment: 'Sophia is amazing. The scalp therapy wash was so relaxing, and the final haircut style was perfect for my hair texture.',
    date: '2026-05-12',
    barberName: 'Sophia Stone',
  },
];

// Initial mock appointments
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt1',
    barberId: 'b1',
    barberName: 'Marcus Vance',
    serviceId: 's5',
    serviceName: 'The Sovereign Combo',
    servicePrice: 70,
    date: '2026-05-21',
    time: '10:00',
    clientName: 'Alex Mercer',
    clientEmail: 'alex.mercer@gmail.com',
    clientPhone: '555-0199',
    notes: 'Needs soft taper on sideburns.',
    status: 'booked',
    createdAt: '2026-05-20T08:00:00Z',
  },
  {
    id: 'apt2',
    barberId: 'b2',
    barberName: 'Jaxson Reed',
    serviceId: 's1',
    serviceName: 'Signature Haircut',
    servicePrice: 45,
    date: '2026-05-21',
    time: '11:30',
    clientName: 'Brody Hudson',
    clientEmail: 'brody.h@outlook.com',
    clientPhone: '555-0144',
    notes: 'Skin fade starting at 0.',
    status: 'booked',
    createdAt: '2026-05-19T14:30:00Z',
  },
  {
    id: 'apt3',
    barberId: 'b3',
    barberName: 'Sophia Stone',
    serviceId: 's6',
    serviceName: 'The Royal Ritual',
    servicePrice: 110,
    date: '2026-05-22',
    time: '14:00',
    clientName: 'Dominic Sterling',
    clientEmail: 'dom.sterling@me.com',
    clientPhone: '555-0182',
    notes: 'First time trying the charcoal mask package.',
    status: 'booked',
    createdAt: '2026-05-20T09:15:00Z',
  },
];

// LocalStorage Keys
const KEYS = {
  SERVICES: 'barber_services',
  BARBERS: 'barber_profiles',
  APPOINTMENTS: 'barber_appointments',
  REVIEWS: 'barber_reviews',
  USERS: 'barber_users',
  CURRENT_USER: 'barber_current_user',
};

// Storage Helpers
export function getStoredServices(): Service[] {
  if (typeof window === 'undefined') return INITIAL_SERVICES;
  const stored = localStorage.getItem(KEYS.SERVICES);
  if (!stored) {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    return INITIAL_SERVICES;
  }
  return JSON.parse(stored);
}

export function saveStoredServices(services: Service[]): void {
  localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));
}

export function getStoredBarbers(): Barber[] {
  if (typeof window === 'undefined') return INITIAL_BARBERS;
  const stored = localStorage.getItem(KEYS.BARBERS);
  if (!stored) {
    localStorage.setItem(KEYS.BARBERS, JSON.stringify(INITIAL_BARBERS));
    return INITIAL_BARBERS;
  }
  return JSON.parse(stored);
}

export function saveStoredBarbers(barbers: Barber[]): void {
  localStorage.setItem(KEYS.BARBERS, JSON.stringify(barbers));
}

export function getStoredAppointments(): Appointment[] {
  if (typeof window === 'undefined') return INITIAL_APPOINTMENTS;
  const stored = localStorage.getItem(KEYS.APPOINTMENTS);
  if (!stored) {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    return INITIAL_APPOINTMENTS;
  }
  return JSON.parse(stored);
}

export function saveStoredAppointments(appointments: Appointment[]): void {
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
}

export function getStoredReviews(): ShopReview[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  const stored = localStorage.getItem(KEYS.REVIEWS);
  if (!stored) {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    return INITIAL_REVIEWS;
  }
  return JSON.parse(stored);
}

export function addStoredReview(review: ShopReview): void {
  const reviews = getStoredReviews();
  reviews.unshift(review);
  localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
}

// Client preseed users for fast-testing profiles
export const INITIAL_USERS: UserProfile[] = [
  {
    email: 'alex.mercer@gmail.com',
    password: 'password',
    name: 'Alex Mercer',
    phone: '555-0199',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    preferredBarberId: 'b1',
    stylePreferences: 'Medium fade. Scissor work only on top.',
    notificationType: 'email',
    createdAt: '2026-05-19T10:00:00Z'
  },
  {
    email: 'client@barber.com',
    password: 'password',
    name: 'Giles Sterling',
    phone: '555-4321',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    preferredBarberId: 'b3',
    stylePreferences: 'Sovereign combo. Wants organic beard oil.',
    notificationType: 'sms',
    createdAt: '2026-05-20T09:00:00Z'
  }
];

export function getStoredUsers(): UserProfile[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  const stored = localStorage.getItem(KEYS.USERS);
  if (!stored) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
}

export function saveStoredUsers(users: UserProfile[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function getLoggedInUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(KEYS.CURRENT_USER);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveLoggedInUser(user: UserProfile | null): void {
  if (user === null) {
    localStorage.removeItem(KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  }
}
