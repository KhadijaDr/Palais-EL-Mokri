'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          router.push('/?error=auth_error')
          return
        }

        if (data.session) {
          // L'utilisateur est maintenant connecté
          router.push('/?success=email_confirmed')
        } else {
          // Pas de session, rediriger vers la page d'accueil
          router.push('/')
        }
      } catch (error) {
        router.push('/?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Confirmation de votre compte en cours...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Vous allez être redirigé automatiquement.
        </p>
      </div>
    </div>
  )
}