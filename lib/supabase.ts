import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { User } from './types'

let _client: SupabaseClient | null = null

function ensureClient(): SupabaseClient {
  if (_client) return _client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return _client
}

// Lazy proxy to avoid creating the client at module load (build-time)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = ensureClient()
    // @ts-ignore - dynamic property access
    return client[prop]
  },
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