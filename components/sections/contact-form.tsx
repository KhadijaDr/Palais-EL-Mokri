'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, MessageSquare } from 'lucide-react';
import {
  validateFormField,
  sanitizeInput,
  sanitizeHtml,
  createRateLimiter
} from '@/lib/validation';
import { useAntiSpam } from '@/lib/anti-spam';

export function ContactForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  // Hook anti-spam
  const { honeypot, checkHoneypot, detectSuspiciousBehavior, canAttempt } = useAntiSpam();
  const [honeypotValue, setHoneypotValue] = useState('');

  // Rate limiter: max 3 attempts per 5 minutes
  const rateLimiter = createRateLimiter(3, 5 * 60 * 1000);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const validateField = (name: string, value: string) => {
    const validation = validateFormField(name, value, true);
    setErrors(prev => ({
      ...prev,
      [name]: validation.error
    }));
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification anti-spam - honeypot
    if (checkHoneypot({ [honeypot.name]: honeypotValue })) {
      setSubmitMessage('Erreur de validation. Veuillez réessayer.');
      return;
    }

    // Vérification anti-spam - comportement suspect
    if (detectSuspiciousBehavior(formData)) {
      setSubmitMessage('Erreur de validation. Veuillez réessayer.');
      return;
    }

    // Rate limiting check
    const clientId = 'contact-form';
    if (!rateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(clientId) / 1000 / 60);
      setSubmitMessage(`Trop de tentatives. Veuillez réessayer dans ${remainingTime} minutes.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate all fields
    const validations = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message),
    };

    const isFormValid = Object.values(validations).every(Boolean);

    if (!isFormValid) {
      setIsSubmitting(false);
      setSubmitMessage('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    try {
      // Call API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          [honeypot.name]: honeypotValue
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(result.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setErrors({});
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        setSubmitMessage(result.message || result.error);
      }
    } catch (error) {
      setSubmitMessage('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'message' ? sanitizeHtml(value) : sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="mx-auto max-w-2xl px-6">
        <Card
          className={`transition-all duration-800 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-secondary" />
              Envoyez-nous un message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ honeypot caché pour la protection anti-spam */}
              <input
                type="text"
                name={honeypot.name}
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
                style={honeypot.style}
                tabIndex={-1}
                autoComplete="off"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    Prénom *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.firstName ? 'border-red-500' : ''}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Nom *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.lastName ? 'border-red-500' : ''}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={errors.email ? 'border-red-500' : ''}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+212 XXX XXX XXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                  Sujet *
                </Label>
                <Select value={formData.subject} onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, subject: value }));
                  if (errors.subject) {
                    setErrors(prev => ({ ...prev, subject: '' }));
                  }
                }}>
                  <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Choisissez un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visite">Organiser une visite</SelectItem>
                    <SelectItem value="evenement">Événement privé</SelectItem>
                    <SelectItem value="don">Question sur les dons</SelectItem>
                    <SelectItem value="association">
                      Adhésion à l'association
                    </SelectItem>
                    <SelectItem value="presse">Demande presse</SelectItem>
                    <SelectItem value="partenariat">Partenariat</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Décrivez votre demande en détail..."
                  className={`min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-lg ${
                  submitMessage.includes('succès') 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {submitMessage}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full">
                <Send className="mr-2 h-5 w-5" />
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default ContactForm;
