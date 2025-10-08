'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { getProductById } from '@/lib/database';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import { CheckoutForm } from '@/lib/types';
import { validateFormField, sanitizeInput, createRateLimiter } from '@/lib/validation';

export function CartModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cart, updateQuantity, removeFromCart, checkout } =
    useCart();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'France',
    paymentMethod: 'card',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Rate limiter for form submissions
  const rateLimiter = createRateLimiter(3, 60000); // 3 attempts per minute

  // Validation function
  const validateField = (name: string, value: string): string => {
    const result = validateFormField(name, value, true);
    return result.error;
  };

  // Handle input changes with sanitization
  const handleInputChange = (name: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setCheckoutForm(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle blur events for validation
  const handleBlur = (name: string) => {
    const value = checkoutForm[name as keyof CheckoutForm] as string;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    if (!rateLimiter.isAllowed('cart-checkout')) {
      setSubmitMessage('Trop de tentatives. Veuillez patienter avant de réessayer.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    // Required fields validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'postalCode'];
    requiredFields.forEach(field => {
      const value = checkoutForm[field as keyof CheckoutForm] as string;
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Check if there are validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      setSubmitMessage('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    try {
      // Create a User object from CheckoutForm data
      const userForCheckout = {
        id: user?.id || `temp_${Date.now()}`,
        email: checkoutForm.email,
        firstName: checkoutForm.firstName,
        lastName: checkoutForm.lastName,
        phone: checkoutForm.phone,
        address: {
          street: checkoutForm.street,
          city: checkoutForm.city,
          postalCode: checkoutForm.postalCode,
          country: checkoutForm.country,
        },
        preferences: user?.preferences,
        createdAt: user?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      const order = await checkout(userForCheckout);
      if (order) {
        setOrderSuccess(true);
        setSubmitMessage('Commande passée avec succès !');
        setTimeout(() => {
          setOrderSuccess(false);
          setShowCheckout(false);
          onClose();
        }, 3000);
      } else {
        setSubmitMessage('Erreur lors de la commande. Veuillez réessayer.');
      }
    } catch (error) {
      setSubmitMessage('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className="text-xl font-semibold mb-2">Commande confirmée !</h3>
            <p className="text-muted-foreground">
              Votre commande a été envoyée avec succès. Vous recevrez un email
              de confirmation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Finaliser la commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={checkoutForm.firstName}
                    onChange={e => handleInputChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    className={errors.firstName ? 'border-red-500' : ''}
                    required
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={checkoutForm.lastName}
                    onChange={e => handleInputChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                    required
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={checkoutForm.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={errors.email ? 'border-red-500' : ''}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={checkoutForm.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                    required
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">Adresse</Label>
                <Input
                  id="street"
                  value={checkoutForm.street}
                  onChange={e => handleInputChange('street', e.target.value)}
                  onBlur={() => handleBlur('street')}
                  className={errors.street ? 'border-red-500' : ''}
                  required
                />
                {errors.street && (
                  <p className="text-sm text-red-500">{errors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={checkoutForm.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    className={errors.city ? 'border-red-500' : ''}
                    required
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={checkoutForm.postalCode}
                    onChange={e => handleInputChange('postalCode', e.target.value)}
                    onBlur={() => handleBlur('postalCode')}
                    className={errors.postalCode ? 'border-red-500' : ''}
                    required
                  />
                  {errors.postalCode && (
                    <p className="text-sm text-red-500">{errors.postalCode}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={checkoutForm.country}
                    onChange={e => handleInputChange('country', e.target.value)}
                    onBlur={() => handleBlur('country')}
                    className={errors.country ? 'border-red-500' : ''}
                    required
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500">{errors.country}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                <Select
                  value={checkoutForm.paymentMethod}
                  onValueChange={(value: 'card' | 'paypal' | 'bank_transfer') =>
                    setCheckoutForm(prev => ({ ...prev, paymentMethod: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">
                      Virement bancaire
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Instructions spéciales pour la livraison..."
                  value={checkoutForm.notes}
                  onChange={e => handleInputChange('notes', e.target.value)}
                  onBlur={() => handleBlur('notes')}
                  className={errors.notes ? 'border-red-500' : ''}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes}</p>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Résumé de la commande</h4>
                <div className="space-y-2">
                  {cart.items.map(item => {
                    const product = getProductById(item.productId);
                    return product ? (
                      <div
                        key={item.productId}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {product.name} x {item.quantity}
                        </span>
                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                      </div>
                    ) : null;
                  })}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{cart.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCheckout(false)}
                >
                  Retour au panier
                </Button>
                <Button
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1"
                >
                  {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
                </Button>
              </div>

              {/* Submission Message */}
              {submitMessage && (
                <div className={`p-4 rounded-lg text-center ${
                  submitMessage.includes('succès') || submitMessage.includes('Commande passée')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Mon panier ({cart.items.length} articles)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cart.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Votre panier est vide</p>
              <Button onClick={onClose} className="mt-4">
                Continuer mes achats
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map(item => {
                const product = getProductById(item.productId);
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.artisan}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toFixed(2)} € chacun
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    {cart.total.toFixed(2)} €
                  </span>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Continuer mes achats
                  </Button>
                  <Button
                    onClick={() => setShowCheckout(true)}
                    className="flex-1"
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Commander
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
