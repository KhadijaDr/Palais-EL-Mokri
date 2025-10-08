'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/lib/types';
import { supabase, convertSupabaseUserToProfile, type AuthUser } from '@/lib/supabase';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  newsletter?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (form: LoginForm) => Promise<{ success: boolean; error?: string }>;
  register: (
    form: RegisterForm
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session existante au montage du composant
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          const userProfile = convertSupabaseUserToProfile(session.user as AuthUser);
          setUser(userProfile);
        }
      } catch (error) {
        // Ignorer les erreurs d'initialisation de session
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = convertSupabaseUserToProfile(session.user as AuthUser);
          setUser(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    form: LoginForm
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        let errorMessage = 'Une erreur est survenue lors de la connexion.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect.';
        } else if (error.message.includes('Email not confirmed') || error.message.includes('signup_disabled')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail et cliquez sur le lien de confirmation.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Compte non confirmé. Veuillez vérifier votre email et cliquer sur le lien de confirmation avant de vous connecter.';
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      if (data.user) {
        // L'utilisateur sera automatiquement défini via onAuthStateChange
        return { success: true };
      }

      return {
        success: false,
        error: 'Une erreur inattendue est survenue.',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Une erreur est survenue lors de la connexion.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    form: RegisterForm
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsLoading(true);
    try {
      // Vérifier que les mots de passe correspondent
      if (form.password !== form.confirmPassword) {
        return {
          success: false,
          error: 'Les mots de passe ne correspondent pas.',
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            newsletter: form.newsletter || false,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        let errorMessage = "Une erreur est survenue lors de l'inscription.";
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Un compte existe déjà avec cette adresse email.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Adresse email invalide.';
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }

      if (data.user) {
        // L'utilisateur sera automatiquement défini via onAuthStateChange
        return { 
          success: true,
          message: data.user.email_confirmed_at 
            ? 'Compte créé avec succès !' 
            : 'Compte créé ! Veuillez vérifier votre email pour confirmer votre inscription.'
        };
      }

      return {
        success: false,
        error: 'Une erreur inattendue est survenue.',
      };
    } catch (error) {
      return {
        success: false,
        error: "Une erreur est survenue lors de l'inscription.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Aucun utilisateur connecté' };
    }

    setIsLoading(true);
    
    try {
      // Préparer les métadonnées utilisateur pour Supabase
      const userMetadata = {
        firstName: updates.firstName || user.firstName,
        lastName: updates.lastName || user.lastName,
        phone: updates.phone || user.phone,
        address: updates.address ? JSON.stringify(updates.address) : (user.address ? JSON.stringify(user.address) : undefined)
      };

      const authUpdates: any = {
        data: userMetadata
      };

      // Si l'email change, l'ajouter aux mises à jour
      if (updates.email && updates.email !== user.email) {
        authUpdates.email = updates.email;
      }

      const { data, error } = await supabase.auth.updateUser(authUpdates);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Mettre à jour l'état local de l'utilisateur
      if (data.user) {
        const updatedUser = convertSupabaseUserToProfile(data.user as AuthUser);
        setUser(updatedUser);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Une erreur est survenue lors de la mise à jour' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Ignorer les erreurs de déconnexion
      }
      
      // L'utilisateur sera automatiquement défini à null via onAuthStateChange
      // Nettoyer le panier générique pour compatibilité
      localStorage.removeItem('cart');
    } catch (error) {
      // En cas d'erreur, forcer la déconnexion locale
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
