import { NextRequest, NextResponse } from 'next/server';
import { validateFormField, sanitizeInput } from '@/lib/validation';
import { RateLimiter } from '@/lib/rate-limiting';
import { antiSpam, getClientIP } from '@/lib/anti-spam';

// Rate limiter pour les soumissions de contact
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 soumissions par 15 minutes

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
    const { firstName, lastName, email, subject, message, honeypot } = body;

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

    // Validation du sujet
    const subjectValidation = validateFormField('subject', subject);
    if (!subjectValidation.isValid) {
      errors.subject = subjectValidation.error;
    }

    // Validation du message
    const messageValidation = validateFormField('message', message);
    if (!messageValidation.isValid) {
      errors.message = messageValidation.error;
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
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    };

    // Ici, vous pourriez envoyer l'email ou sauvegarder en base de données

    // Simulation d'un traitement de message (remplacez par votre logique métier)
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
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