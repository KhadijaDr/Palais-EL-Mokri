import { createClient } from '@supabase/supabase-js'
import { User, Address, UserPreferences } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types pour l'authentification
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
    language?: string
    currency?: string
    newsletter?: boolean
    notifications?: boolean
  }
  created_at: string
  updated_at: string
}

// Fonction utilitaire pour convertir un utilisateur Supabase en User
export const convertSupabaseUserToProfile = (user: AuthUser): User => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.user_metadata.firstName || '',
    lastName: user.user_metadata.lastName || '',
    phone: user.user_metadata.phone,
    address: user.user_metadata.address ? JSON.parse(user.user_metadata.address) : undefined,
    preferences: {
      language: (user.user_metadata.language as 'fr' | 'en' | 'ar') || 'fr',
      currency: (user.user_metadata.currency as 'EUR' | 'USD' | 'MAD') || 'EUR',
      newsletter: user.user_metadata.newsletter || false,
      notifications: user.user_metadata.notifications || true,
    },
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
  }
}