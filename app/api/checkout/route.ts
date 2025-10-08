import { NextRequest, NextResponse } from 'next/server';
import { validateFormField, sanitizeInput } from '@/lib/validation';
import { RateLimiter } from '@/lib/rate-limiting';
import { antiSpam, getClientIP } from '@/lib/anti-spam';

// Rate limiter pour les commandes
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 commandes par 15 minutes

export async function POST(request: NextRequest) {
  try {
    // Obtenir l'IP du client
    const clientIP = getClientIP(request);

    // Vérification anti-spam
    const spamCheck = antiSpam.canAttempt(clientIP);
    if (!spamCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: spamCheck.message,
          retryAfter: spamCheck.waitTime 
        },
        { status: 429 }
      );
    }

    // Vérification du rate limiting
    if (!rateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Trop de tentatives. Veuillez réessayer plus tard.',
          retryAfter: rateLimiter.getResetTime(clientIP)
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, street, city, postalCode, country, paymentMethod, notes, cartItems, totalAmount, honeypot } = body;

    // Vérification du honeypot
    if (honeypot && honeypot.trim() !== '') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Soumission invalide détectée.' 
        },
        { status: 400 }
      );
    }

    // Détection de comportements suspects
    const suspiciousCheck = antiSpam.detectSuspiciousBehavior({
      firstName, lastName, email, notes
    });
    
    if (suspiciousCheck.suspicious) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contenu suspect détecté. Veuillez vérifier votre commande.' 
        },
        { status: 400 }
      );
    }

    // Validation des champs requis
    const errors: Record<string, string> = {};

    // Validation du prénom
    const firstNameValidation = validateFormField('firstName', firstName);
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.error;
    }

    // Validation du nom
    const lastNameValidation = validateFormField('lastName', lastName);
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.error;
    }

    // Validation de l'email
    const emailValidation = validateFormField('email', email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    // Validation du téléphone
    const phoneValidation = validateFormField('phone', phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    }

    // Validation de l'adresse
    const streetValidation = validateFormField('street', street);
    if (!streetValidation.isValid) {
      errors.street = streetValidation.error;
    }

    // Validation de la ville
    const cityValidation = validateFormField('city', city);
    if (!cityValidation.isValid) {
      errors.city = cityValidation.error;
    }

    // Validation du code postal
    const postalCodeValidation = validateFormField('postalCode', postalCode);
    if (!postalCodeValidation.isValid) {
      errors.postalCode = postalCodeValidation.error;
    }

    // Validation du pays
    if (!country || country.trim() === '') {
      errors.country = 'Le pays est requis.';
    }

    // Validation de la méthode de paiement
    if (!paymentMethod || paymentMethod.trim() === '') {
      errors.paymentMethod = 'La méthode de paiement est requise.';
    }

    // Validation des notes (optionnel)
    if (notes && notes.trim()) {
      const notesValidation = validateFormField('notes', notes);
      if (!notesValidation.isValid) {
        errors.notes = notesValidation.error;
      }
    }

    // Validation du panier
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      errors.cart = 'Le panier ne peut pas être vide.';
    }

    // Validation du montant total
    if (!totalAmount || totalAmount <= 0) {
      errors.totalAmount = 'Le montant total doit être supérieur à zéro.';
    }

    // Si des erreurs existent, les retourner
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          errors,
          message: 'Veuillez corriger les erreurs dans le formulaire.' 
        },
        { status: 400 }
      );
    }

    // Sanitisation des données
    const sanitizedData = {
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      address: {
        street: sanitizeInput(street),
        city: sanitizeInput(city),
        postalCode: sanitizeInput(postalCode),
        country: sanitizeInput(country),
      },
      paymentMethod: sanitizeInput(paymentMethod),
      notes: notes ? sanitizeInput(notes) : null,
      cartItems: cartItems.map((item: any) => ({
        id: sanitizeInput(item.id),
        name: sanitizeInput(item.name),
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
      })),
      totalAmount: parseFloat(totalAmount),
      timestamp: new Date().toISOString(),
    };

    // Ici, vous pourriez traiter le paiement et sauvegarder la commande en base de données

    // Simulation d'un traitement de commande (remplacez par votre logique métier)
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: 'Votre commande a été traitée avec succès. Vous recevrez une confirmation par email.',
      orderId: `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      estimatedDelivery: '3-5 jours ouvrables'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur interne s\'est produite. Veuillez réessayer plus tard.' 
      },
      { status: 500 }
    );
  }
}