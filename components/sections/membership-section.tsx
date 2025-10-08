'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Star, Crown, Heart } from 'lucide-react';
import { 
  validateFormField, 
  sanitizeInput, 
  createRateLimiter 
} from '@/lib/validation';

export function MembershipSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    membershipType: '',
    motivation: '',
    newsletter: false,
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Rate limiter: max 2 attempts per 10 minutes
  const rateLimiter = createRateLimiter(2, 10 * 60 * 1000);

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

  const validateField = (name: string, value: string | boolean) => {
    if (typeof value === 'boolean') return { isValid: true, error: '' };
    
    const validation = validateFormField(name, value, name !== 'phone' && name !== 'motivation');
    setErrors(prev => ({
      ...prev,
      [name]: validation.error
    }));
    return validation;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    const clientId = 'membership-form';
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
      address: validateField('address', formData.address),
      membershipType: formData.membershipType ? { isValid: true, error: '' } : { isValid: false, error: 'Veuillez sélectionner un type d\'adhésion' },
      terms: formData.terms ? { isValid: true, error: '' } : { isValid: false, error: 'Vous devez accepter le règlement intérieur' },
    };

    // Set membership type error
    if (!validations.membershipType.isValid) {
      setErrors(prev => ({ ...prev, membershipType: validations.membershipType.error }));
    }
    if (!validations.terms.isValid) {
      setErrors(prev => ({ ...prev, terms: validations.terms.error }));
    }

    const isFormValid = Object.values(validations).every(v => v.isValid);

    if (!isFormValid) {
      setIsSubmitting(false);
      setSubmitMessage('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitMessage('Candidature envoyée avec succès ! Nous vous contacterons bientôt.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        membershipType: '',
        motivation: '',
        newsletter: false,
        terms: false,
      });
      setErrors({});
    } catch (error) {
      setSubmitMessage('Erreur lors de l\'envoi de la candidature. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const membershipTypes = [
    {
      icon: Users,
      title: 'Membre Adhérent',
      price: '25 €/an',
      benefits: [
        'Newsletter mensuelle',
        'Invitations aux événements',
        'Accès aux conférences',
        'Réductions boutique',
      ],
      color: 'border-border',
    },
    {
      icon: Star,
      title: 'Membre Actif',
      price: '50 €/an',
      benefits: [
        'Tous les avantages Adhérent',
        'Visites privées du palais',
        'Participation aux projets',
        'Rencontres avec les artistes',
      ],
      color: 'border-secondary',
      popular: true,
    },
    {
      icon: Crown,
      title: 'Membre Bienfaiteur',
      price: '100 €/an',
      benefits: [
        'Tous les avantages Actif',
        'Dîners exclusifs',
        'Reconnaissance publique',
        'Conseil consultatif',
      ],
      color: 'border-secondary',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-muted/30"
      id="membership-section"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Devenir membre
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Rejoignez notre communauté de passionnés du patrimoine culturel
            marocain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Membership Types */}
          <div className="space-y-6">
            <h3
              className={`font-serif text-2xl font-semibold text-foreground mb-8 transition-all duration-800 delay-400 ${
                isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
              }`}
            >
              Types d'adhésion
            </h3>

            {membershipTypes.map((type, index) => (
              <Card
                key={type.title}
                className={`relative transition-all duration-800 ${type.color} ${
                  type.popular ? 'ring-2 ring-secondary' : ''
                } ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
                style={{ animationDelay: `${500 + index * 150}ms` }}
              >
                {type.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Populaire
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-full bg-secondary/10 p-2">
                        <type.icon className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-foreground">
                          {type.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {type.price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3 flex-shrink-0"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Membership Form */}
          <div
            className={`transition-all duration-800 delay-700 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-secondary" />
                  Formulaire d'adhésion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <br />
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
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <br />
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

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <br />
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

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <br />
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

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <br />
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Votre adresse complète"
                      className={`min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Type d'adhésion *
                    </Label>
                    <div className="space-y-2">
                      {membershipTypes.map(type => (
                        <div
                          key={type.title}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={type.title.toLowerCase().replace(/\s+/g, '-')}
                            checked={formData.membershipType === type.title}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({ ...prev, membershipType: type.title }));
                                if (errors.membershipType) {
                                  setErrors(prev => ({ ...prev, membershipType: '' }));
                                }
                              }
                            }}
                          />
                          <Label
                            htmlFor={type.title
                              .toLowerCase()
                              .replace(/\s+/g, '-')}
                            className="text-sm cursor-pointer"
                          >
                            {type.title} - {type.price}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.membershipType && (
                      <p className="text-red-500 text-sm mt-1">{errors.membershipType}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="motivation">Motivation (optionnel)</Label>
                    <br />
                    <Textarea
                      id="motivation"
                      name="motivation"
                      placeholder="Pourquoi souhaitez-vous rejoindre l'association ?"
                      className="min-h-[100px]"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="newsletter" 
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => handleCheckboxChange('newsletter', checked as boolean)}
                      />
                      <Label htmlFor="newsletter" className="text-sm">
                        Recevoir la newsletter mensuelle
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={formData.terms}
                        onCheckedChange={(checked) => handleCheckboxChange('terms', checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm">
                        J'accepte le règlement intérieur de l'association *
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
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

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    <Users className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
