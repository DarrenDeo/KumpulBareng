// ============================================================
// USER TYPES
// ============================================================
export interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// ============================================================
// EVENT TYPES
// ============================================================
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  eventDate: string;
  price: number;
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: { id?: string; name: string | null };
  participants?: Participant[];
  _count?: { participants: number };
}

export interface Participant {
  id: string;
  name: string | null;
}

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  location: string;
  eventDate: string;
  price: number;
  maxParticipants: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export interface EventFilters {
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  search?: string;
  priceType?: 'gratis' | 'berbayar';
  upcoming?: string;
  sort?: 'date' | 'title' | 'createdAt';
}

// ============================================================
// TRANSACTION TYPES
// ============================================================
export interface Transaction {
  id: string;
  orderId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  amount: number;
  createdAt: string;
  userId: string;
  eventId: string;
  event?: { id: string; title: string; category: string };
}

// ============================================================
// API RESPONSE TYPES
// ============================================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors: { field: string; message: string }[];
}

// ============================================================
// USER STATS
// ============================================================
export interface UserStats {
  eventsCreated: number;
  eventsJoined: number;
  totalParticipantsInMyEvents: number;
  upcomingEvents: number;
}

export interface SiteStats {
  totalUsers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalCategories: number;
}

// ============================================================
// CONSTANTS
// ============================================================
export const VALID_CATEGORIES = [
  'Olahraga', 'Film', 'Musik', 'Game', 'Belajar',
  'Kuliner', 'Seni', 'Teknologi', 'Lainnya',
] as const;

export type EventCategory = typeof VALID_CATEGORIES[number];

/** Peta warna gradient per kategori event */
export const CATEGORY_COLORS: Record<string, { from: string; to: string; text: string; icon: string }> = {
  Olahraga:  { from: 'from-emerald-500', to: 'to-teal-500', text: 'text-emerald-400', icon: '⚽' },
  Film:      { from: 'from-violet-500', to: 'to-purple-500', text: 'text-violet-400', icon: '🎬' },
  Musik:     { from: 'from-pink-500', to: 'to-rose-500', text: 'text-pink-400', icon: '🎵' },
  Game:      { from: 'from-blue-500', to: 'to-cyan-500', text: 'text-blue-400', icon: '🎮' },
  Belajar:   { from: 'from-amber-500', to: 'to-orange-500', text: 'text-amber-400', icon: '📚' },
  Kuliner:   { from: 'from-red-500', to: 'to-orange-500', text: 'text-red-400', icon: '🍕' },
  Seni:      { from: 'from-fuchsia-500', to: 'to-pink-500', text: 'text-fuchsia-400', icon: '🎨' },
  Teknologi: { from: 'from-indigo-500', to: 'to-blue-500', text: 'text-indigo-400', icon: '💻' },
  Lainnya:   { from: 'from-slate-500', to: 'to-slate-400', text: 'text-slate-400', icon: '✨' },
};
