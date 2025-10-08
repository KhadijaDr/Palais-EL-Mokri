// Types pour la boutique
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  badge?: 'Bestseller' | 'Nouveau' | 'Promo' | 'Limité';
  artisan: string;
  artisanId: string;
  category: string;
  categorySlug: string;
  stock: number;
  tags: string[];
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
    weight?: number;
  };
  materials?: string[];
  origin?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  language: 'fr' | 'en' | 'ar';
  currency: 'EUR' | 'USD' | 'MAD';
  newsletter: boolean;
  notifications: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  user_email: string;
  user_name: string;
  user_phone?: string;
  room_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount?: number;
  team_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  isActive: boolean;
  order: number;
}

// Types pour les formulaires
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  newsletter?: boolean;
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  notes?: string;
}
