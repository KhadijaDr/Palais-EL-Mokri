'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeInput,
} from '@/lib/validation';

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { login, register, isLoading } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(loginForm.email);
    const sanitizedPassword = sanitizeInput(loginForm.password);

    if (!sanitizedEmail || !sanitizedPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    const result = await login({
      email: sanitizedEmail,
      password: sanitizedPassword,
    });
    if (result.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(result.error || 'Une erreur est survenue lors de la connexion');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Sanitize inputs
    const sanitizedFirstName = sanitizeInput(registerForm.firstName);
    const sanitizedLastName = sanitizeInput(registerForm.lastName);
    const sanitizedEmail = sanitizeInput(registerForm.email);

    if (
      !sanitizedFirstName ||
      !sanitizedLastName ||
      !sanitizedEmail ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Validate names
    if (!validateName(sanitizedFirstName)) {
      setError(
        'Le prénom ne doit contenir que des lettres, espaces, tirets et apostrophes'
      );
      return;
    }

    if (!validateName(sanitizedLastName)) {
      setError(
        'Le nom ne doit contenir que des lettres, espaces, tirets et apostrophes'
      );
      return;
    }

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(registerForm.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    const result = await register({
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      email: sanitizedEmail,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      newsletter: registerForm.newsletter,
    });
    if (result.success) {
      onSuccess?.();
      onClose();
    } else {
      setError(result.error || "Une erreur est survenue lors de l'inscription");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">
            Palais El Mokri
          </CardTitle>
          <CardDescription>
            Connectez-vous pour sauvegarder vos préférences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={loginForm.email}
                    onChange={e =>
                      setLoginForm(prev => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={loginForm.password}
                      onChange={e =>
                        setLoginForm(prev => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-500 text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-firstName">Prénom</Label>
                    <Input
                      id="register-firstName"
                      placeholder="Votre prénom"
                      value={registerForm.firstName}
                      onChange={e =>
                        setRegisterForm(prev => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-lastName">Nom</Label>
                    <Input
                      id="register-lastName"
                      placeholder="Votre nom"
                      value={registerForm.lastName}
                      onChange={e =>
                        setRegisterForm(prev => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={registerForm.email}
                    onChange={e =>
                      setRegisterForm(prev => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={registerForm.password}
                      onChange={e =>
                        setRegisterForm(prev => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirmPassword">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirmez votre mot de passe"
                      value={registerForm.confirmPassword}
                      onChange={e =>
                        setRegisterForm(prev => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={registerForm.newsletter}
                    onCheckedChange={checked =>
                      setRegisterForm(prev => ({
                        ...prev,
                        newsletter: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Je souhaite recevoir la newsletter
                  </Label>
                </div>

                {error && (
                  <div className="text-sm text-red-500 text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
