import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt?: Timestamp;
}

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: Timestamp;
  venue: string;
  price: number;
  status: 'active' | 'cancelled' | 'completed';
  createdAt: Timestamp;
  qrCode?: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  description?: string;
  category: 'movie' | 'concert' | 'sports' | 'theater';
  imageUrl: string;
  date: Timestamp;
  venue: string;
  price: number;
  isLive?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
