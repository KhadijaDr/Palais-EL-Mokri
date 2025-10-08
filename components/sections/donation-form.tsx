'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Heart,
  CreditCard,
  Banknote,
  Smartphone,
  Shield,
  Gift,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { 
  validateFormField, 
  sanitizeInput, 
  createRateLimiter 
} from '@/lib/validation';
import { useAntiSpam } from '@/lib/anti-spam';

export function DonationForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('100');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    newsletter: false,
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Hook anti-spam
  const { honeypot, checkHoneypot, detectSuspiciousBehavior, canAttempt } = useAntiSpam();
  const [honeypotValue, setHoneypotValue] = useState('');

  // Rate limiter pour anti-spam
  const rateLimiter = createRateLimiter(3, 60000); // 3 tentatives par minute

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

  const validateField = (fieldName: string, value: string) => {
    return validateFormField(fieldName, value);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: keyof typeof formData) => {
    const value = formData[field] as string;
    if (value && typeof value === 'string') {
      const validation = validateField(field, value);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [field]: validation.error }));
      }
    }
  };

  const handleCustomAmountChange = (value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setCustomAmount(sanitizedValue);
    
    // Clear error when user starts typing
    if (errors.customAmount) {
      setErrors(prev => ({ ...prev, customAmount: '' }));
    }
  };

  const predefinedAmounts = [
    {
      value: '25',
      label: '25 €',
      description: "Préservation d'un détail architectural",
    },
    {
      value: '50',
      label: '50 €',
      description: "Restauration d'un mètre de zellige",
    },
    {
      value: '100',
      label: '100 €',
      description: "Rénovation d'une fenêtre traditionnelle",
    },
    {
      value: '250',
      label: '250 €',
      description: "Restauration d'un élément décoratif",
    },
    {
      value: '500',
      label: '500 €',
      description: "Rénovation complète d'une pièce",
    },
    {
      value: '1000',
      label: '1000 €',
      description: "Mécénat d'une salle d'apparat",
    },
  ];

  const paymentMethods = [
    {
      value: 'card',
      label: 'Carte bancaire',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
    },
    {
      value: 'paypal',
      label: 'PayPal',
      icon: Smartphone,
      description: 'Paiement sécurisé',
    },
    {
      value: 'transfer',
      label: 'Virement',
      icon: Banknote,
      description: 'Virement bancaire',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification anti-spam - honeypot
    if (checkHoneypot({ [honeypot.name]: honeypotValue })) {
      setSubmitMessage({
        type: 'error',
        text: 'Erreur de validation. Veuillez réessayer.'
      });
      return;
    }

    // Vérification anti-spam - comportement suspect
    if (detectSuspiciousBehavior(formData)) {
      setSubmitMessage({
        type: 'error',
        text: 'Erreur de validation. Veuillez réessayer.'
      });
      return;
    }
    
    // Vérification du rate limiting
    const clientId = 'donation-form';
    if (!rateLimiter.isAllowed(clientId)) {
      setSubmitMessage({
        type: 'error',
        text: 'Trop de tentatives. Veuillez attendre avant de réessayer.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    // Validation complète du formulaire
    const validationErrors: Record<string, string> = {};
    
    // Validation du montant
    const amount = selectedAmount === 'custom' ? customAmount : selectedAmount;
    if (!amount || (selectedAmount === 'custom' && !customAmount)) {
      validationErrors.amount = 'Veuillez sélectionner ou saisir un montant';
    } else if (selectedAmount === 'custom') {
      const amountValidation = validateField('amount', customAmount);
      if (!amountValidation.isValid) {
        validationErrors.customAmount = amountValidation.error;
      }
    }

    // Validation des champs obligatoires
    if (formData.firstName) {
      const firstNameValidation = validateField('firstName', formData.firstName);
      if (!firstNameValidation.isValid) {
        validationErrors.firstName = firstNameValidation.error;
      }
    }

    if (formData.lastName) {
      const lastNameValidation = validateField('lastName', formData.lastName);
      if (!lastNameValidation.isValid) {
        validationErrors.lastName = lastNameValidation.error;
      }
    }

    if (formData.email) {
      const emailValidation = validateField('email', formData.email);
      if (!emailValidation.isValid) {
        validationErrors.email = emailValidation.error;
      }
    }

    if (formData.message) {
      const messageValidation = validateField('message', formData.message);
      if (!messageValidation.isValid) {
        validationErrors.message = messageValidation.error;
      }
    }

    // Vérification des conditions générales
    if (!formData.terms) {
      validationErrors.terms = 'Vous devez accepter les conditions générales';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      setSubmitMessage({
        type: 'error',
        text: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    try {
      // Call API endpoint
      const response = await fetch('/api/donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount,
          customAmount,
          paymentMethod,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
          isAnonymous,
          newsletter: formData.newsletter,
          terms: formData.terms,
          honeypot: honeypotValue
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: result.message
        });
        
        // Reset form après succès
        setTimeout(() => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            message: '',
            newsletter: false,
            terms: false,
          });
          setSelectedAmount('100');
          setCustomAmount('');
          setErrors({});
          setSubmitMessage(null);
        }, 3000);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        setSubmitMessage({
          type: 'error',
          text: result.message || result.error
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Une erreur est survenue lors du traitement de votre don. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Faire un don
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Choisissez le montant de votre contribution pour sauvegarder le
            Palais El Mokri
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card
              className={`transition-all duration-800 delay-400 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-secondary" />
                  Votre don
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
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
                  
                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Montant du don
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {predefinedAmounts.map(amount => (
                        <button
                          key={amount.value}
                          type="button"
                          onClick={() => setSelectedAmount(amount.value)}
                          className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                            selectedAmount === amount.value
                              ? 'border-secondary bg-secondary/10 text-secondary'
                              : 'border-border hover:border-secondary/50 hover:bg-secondary/5'
                          }`}
                        >
                          <div className="font-semibold">{amount.label}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {amount.description}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setSelectedAmount('custom')}
                        className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                          selectedAmount === 'custom'
                            ? 'border-secondary bg-secondary/10 text-secondary'
                            : 'border-border hover:border-secondary/50'
                        }`}
                      >
                        Autre montant
                      </button>
                      {selectedAmount === 'custom' && (
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="Montant en €"
                            value={customAmount}
                            onChange={e => handleCustomAmountChange(e.target.value)}
                            className={`w-full ${errors.customAmount ? 'border-red-500' : ''}`}
                          />
                          {errors.customAmount && (
                            <p className="text-sm text-red-500 mt-1">{errors.customAmount}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Mode de paiement
                    </Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {paymentMethods.map(method => (
                        <div
                          key={method.value}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem
                            value={method.value}
                            id={method.value}
                          />
                          <Label
                            htmlFor={method.value}
                            className="flex items-center space-x-3 cursor-pointer flex-1"
                          >
                            <method.icon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{method.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {method.description}
                              </div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <br />
                      <Input 
                        id="firstName" 
                        placeholder="Votre prénom" 
                        value={formData.firstName}
                        onChange={e => handleInputChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <br />
                      <Input 
                        id="lastName" 
                        placeholder="Votre nom" 
                        value={formData.lastName}
                        onChange={e => handleInputChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <br />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <br />
                    <Textarea
                      id="message"
                      placeholder="Laissez un message de soutien..."
                      className="min-h-[100px]"
                      value={formData.message}
                      onChange={e => handleInputChange('message', e.target.value)}
                      onBlur={() => handleBlur('message')}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                      />
                      <Label htmlFor="anonymous" className="text-sm">
                        Don anonyme
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked === true }))}
                      />
                      <Label htmlFor="newsletter" className="text-sm">
                        Recevoir les actualités du Palais El Mokri
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.terms}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, terms: checked === true }))}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        J'accepte les conditions générales et la politique de
                        confidentialité
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-sm text-red-500 mt-1">{errors.terms}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Traitement...' : `Finaliser mon don de ${
                      selectedAmount === 'custom'
                        ? `${customAmount || '0'} €`
                        : `${selectedAmount} €`
                    }`}
                  </Button>

                  {/* Submission Message */}
                  {submitMessage && (
                    <div className={`p-4 rounded-lg text-center ${
                      submitMessage.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitMessage.text}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Info */}
            <Card
              className={`transition-all duration-800 delay-600 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-secondary mr-2" />
                  <h3 className="font-serif text-lg font-semibold">
                    Paiement sécurisé
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Vos données sont protégées par un cryptage SSL 256 bits. Nous
                  ne stockons aucune information bancaire.
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Certifié SSL</span>
                </div>
              </CardContent>
            </Card>

            {/* Tax Benefits */}
            <Card
              className={`transition-all duration-800 delay-700 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Gift className="h-6 w-6 text-secondary mr-2" />
                  <h3 className="font-serif text-lg font-semibold">
                    Avantage fiscal
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Votre don ouvre droit à une réduction d'impôt de 66% du
                  montant versé, dans la limite de 20% du revenu imposable.
                </p>
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <div className="text-sm font-medium text-secondary">
                    Exemple :
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Don de 100 € = 34 € après déduction fiscale
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card
              className={`transition-all duration-800 delay-800 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
            >
              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-semibold mb-4">
                  Besoin d'aide ?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Notre équipe est à votre disposition pour toute question
                  concernant votre don.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-secondary mr-2" />
                    <span>contact@palaiselmokri.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-secondary mr-2" />
                    <span>+212 567 839 993</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
