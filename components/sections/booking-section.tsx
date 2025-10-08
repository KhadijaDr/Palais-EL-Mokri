'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SuccessModal } from '@/components/ui/success-modal';
import { Calendar, MapPin, Users, Clock, Star, CheckCircle } from 'lucide-react';
import { 
  validateFormField, 
  sanitizeInput, 
  createRateLimiter 
} from '@/lib/validation';

export function BookingSection() {
  const { t } = useLanguage();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
    roomType: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Rate limiter pour anti-spam
  const rateLimiter = createRateLimiter(3, 60000); // 3 tentatives par minute

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification du rate limiting
    if (!rateLimiter.isAllowed('booking-form')) {
      setErrors({ general: 'Trop de tentatives. Veuillez attendre avant de réessayer.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Appel à l'API de réservation
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccessModal(true);
        
        // Réinitialiser le formulaire après soumission réussie
        setFormData({
          checkIn: '',
          checkOut: '',
          guests: '',
          roomType: '',
          name: '',
          email: '',
          phone: '',
          message: '',
        });
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message || result.error });
        }
      }
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Réserver Votre Séjour</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Réservez dès maintenant votre séjour au Palais El Mokri pour une
            expérience authentique
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Formulaire de Réservation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn">Date d'arrivée</Label>
                    <br />
                    <Input
                      id="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={e =>
                        setFormData({ ...formData, checkIn: e.target.value })
                      }
                      required
                    />
                    {errors.checkIn && (
                      <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="checkOut">Date de départ</Label>
                    <br />
                    <Input
                      id="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={e =>
                        setFormData({ ...formData, checkOut: e.target.value })
                      }
                      required
                    />
                    {errors.checkOut && (
                      <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guests">Nombre d'invités</Label>
                    <br />
                    <Select
                      value={formData.guests}
                      onValueChange={value =>
                        setFormData({ ...formData, guests: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 personne</SelectItem>
                        <SelectItem value="2">2 personnes</SelectItem>
                        <SelectItem value="3">3 personnes</SelectItem>
                        <SelectItem value="4">4 personnes</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.guests && (
                      <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="roomType">Type de chambre</Label>
                    <br />
                    <Select
                      value={formData.roomType}
                      onValueChange={value =>
                        setFormData({ ...formData, roomType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="suite">Suite Royale</SelectItem>
                        <SelectItem value="traditional">
                          Chambre Traditionnelle
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.roomType && (
                      <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <br />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <br />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <br />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Message (optionnel)</Label>
                  <br />
                  <Textarea
                    id="message"
                    placeholder="Demandes spéciales, questions..."
                    value={formData.message}
                    onChange={e =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer la Demande de Réservation'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Réservation envoyée avec succès !"
        message="Nous avons bien reçu votre demande de réservation. Notre équipe vous contactera dans les plus brefs délais pour confirmer votre séjour."
        buttonText="Parfait"
      />
    </section>
  );
}