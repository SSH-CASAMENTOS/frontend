import { User } from "./user";

export interface Profile {
  id: string;
  user: User;
  userId: string;
  name: string;
  weddings: Wedding[];
  createdAt: string;
  updatedAt: string;
}

export interface Wedding {
  id: string;
  title: string;
  date: Date;
  location: string;
  clientNames: string;
  status: 'upcoming' | 'completed' | 'canceled';
  budget: number;
  totalPaid: number;
  coverImage?: string;
}

export interface Budget {
  id: string;
  weddingId: string;
  categories: BudgetCategory[];
  totalAmount: number;
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  items: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  supplier?: string;
  notes?: string;
  isPaid: boolean;
}

export interface Contract {
  id: string;
  weddingId: string;
  title: string;
  type: 'client' | 'supplier';
  supplierName?: string;
  category?: string;
  signedAt?: Date;
  expiresAt?: Date;
  value: number;
  documentUrl?: string;
  status: 'pending' | 'active' | 'expired' | 'completed';
}

export interface Item {
  id: string;
  weddingId: string;
  name: string;
  quantity: number;
  supplier?: string;
  category: string;
  status: 'pending' | 'acquired' | 'delivered';
  notes?: string;
  price?: number;
}

export interface Payment {
  id: string;
  weddingId: string;
  title: string;
  amount: number;
  dueDate: Date;
  paidAt?: Date;
  status: 'pending' | 'paid' | 'overdue';
  recipient: string;
  category?: string;
  method?: string;
  notes?: string;
}

export interface Event {
  id: string;
  weddingId: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  location?: string;
  description?: string;
  attendees?: string[];
}

export type EventType = 'meeting' | 'payment' | 'delivery' | 'ceremony' | 'other';

export type ModuleType = 'dashboard' | 'budget' | 'contracts' | 'items' | 'payments' | 'calendar';
