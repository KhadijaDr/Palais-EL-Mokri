import { NextRequest, NextResponse } from 'next/server';
import { validateFormField, sanitizeInput } from '@/lib/validation';
import { RateLimiter } from '@/lib/rate-limiting';
import { antiSpam, getClientIP } from '@/lib/anti-spam';

// Rate limiter pour les estimations
const rateLimiter = new RateLimiter(3, 15 * 60 * 1000); // 3 estimations par 15 minutes

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
    const { firstName, lastName, email, phone, visitDate, visitTime, numberOfPeople, specialRequests, honeypot } = body;

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
      firstName, lastName, email, message: specialRequests
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

    // Validation du téléphone
    const phoneValidation = validateFormField('phone', phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    }

    // Validation de la date de visite
    const visitDateValidation = validateFormField('visitDate', visitDate);
    if (!visitDateValidation.isValid) {
      errors.visitDate = visitDateValidation.error;
    }

    // Validation de l'heure de visite
    if (!visitTime || visitTime.trim() === '') {
      errors.visitTime = 'L\'heure de visite est requise.';
    }

    // Validation du nombre de personnes
    const numberOfPeopleValidation = validateFormField('numberOfPeople', numberOfPeople);
    if (!numberOfPeopleValidation.isValid) {
      errors.numberOfPeople = numberOfPeopleValidation.error;
    }

    // Validation des demandes spéciales (optionnel)
    if (specialRequests && specialRequests.trim()) {
      const specialRequestsValidation = validateFormField('specialRequests', specialRequests);
      if (!specialRequestsValidation.isValid) {
        errors.specialRequests = specialRequestsValidation.error;
      }
    }

    // Validation de la date (ne peut pas être dans le passé)
    if (visitDate) {
      const selectedDate = new Date(visitDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.visitDate = 'La date de visite ne peut pas être dans le passé.';
      }
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
      visitDate: sanitizeInput(visitDate),
      visitTime: sanitizeInput(visitTime),
      numberOfPeople: parseInt(numberOfPeople),
      specialRequests: specialRequests ? sanitizeInput(specialRequests) : null,
      timestamp: new Date().toISOString(),
    };

    // Ici, vous pourriez traiter la demande et sauvegarder en base de données

    // Simulation d'un traitement de demande (remplacez par votre logique métier)
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      message: 'Votre demande d\'estimation a été envoyée avec succès. Nous vous contacterons dans les plus brefs délais.',
      estimationId: `EST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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