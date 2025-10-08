import { NextRequest, NextResponse } from 'next/server';
import { validateFormField, sanitizeInput } from '@/lib/validation';
import { RateLimiter } from '@/lib/rate-limiting';
import { antiSpam, getClientIP } from '@/lib/anti-spam';

// Rate limiter pour les donations
const rateLimiter = new RateLimiter(3, 15 * 60 * 1000); // 3 donations par 15 minutes

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
    const { amount, customAmount, firstName, lastName, email, message, terms, honeypot, isAnonymous, newsletter, paymentMethod } = body;

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
      firstName, lastName, email, message
    });
    
    if (suspiciousCheck.suspicious) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contenu suspect détecté. Veuillez vérifier votre message.' 
        },
        { status: 400 }
      );
    }

    // Validation des champs requis
    const errors: Record<string, string> = {};

    // Validation du montant
    const finalAmount = amount === 'custom' ? customAmount : amount;
    const amountValidation = validateFormField('amount', finalAmount);
    if (!amountValidation.isValid) {
      errors.amount = amountValidation.error;
    }

    // Validation des informations personnelles (sauf si anonyme)
    if (!isAnonymous) {
      const firstNameValidation = validateFormField('firstName', firstName);
      if (!firstNameValidation.isValid) {
        errors.firstName = firstNameValidation.error;
      }

      const lastNameValidation = validateFormField('lastName', lastName);
      if (!lastNameValidation.isValid) {
        errors.lastName = lastNameValidation.error;
      }

      const emailValidation = validateFormField('email', email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
      }
    }

    // Validation du message (optionnel)
    if (message && message.trim()) {
      const messageValidation = validateFormField('message', message);
      if (!messageValidation.isValid) {
        errors.message = messageValidation.error;
      }
    }

    // Validation de l'acceptation des conditions
    if (!terms) {
      errors.terms = 'Vous devez accepter les conditions générales.';
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
      amount: finalAmount,
      paymentMethod: sanitizeInput(paymentMethod),
      firstName: isAnonymous ? null : sanitizeInput(firstName),
      lastName: isAnonymous ? null : sanitizeInput(lastName),
      email: isAnonymous ? null : sanitizeInput(email),
      message: message ? sanitizeInput(message) : null,
      isAnonymous,
      newsletter,
      terms,
      timestamp: new Date().toISOString(),
    };

    // Ici, vous pourriez traiter le paiement et sauvegarder en base de données

    // Simulation d'un traitement de paiement (remplacez par votre logique métier)
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: 'Votre donation a été traitée avec succès. Merci pour votre générosité !',
      transactionId: `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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