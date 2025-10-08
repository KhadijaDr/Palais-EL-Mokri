import { NextRequest, NextResponse } from 'next/server';
import { 
  validateFormField, 
  sanitizeInput, 
  createRateLimiter 
} from '@/lib/validation';
import { ReservationService } from '@/lib/reservation-service';

// Rate limiter pour les réservations
const rateLimiter = createRateLimiter(5, 300000); // 5 tentatives par 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Vérification du rate limiting
    const clientIP = request.ip || 'unknown';
    if (!rateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Trop de tentatives. Veuillez attendre avant de réessayer.' 
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      checkIn,
      checkOut,
      guests,
      roomType,
      name,
      email,
      phone,
      message
    } = body;

    // Validation des champs requis
    const errors: Record<string, string> = {};

    if (!checkIn) {
      errors.checkIn = 'La date d\'arrivée est requise';
    }

    if (!checkOut) {
      errors.checkOut = 'La date de départ est requise';
    }

    if (!guests) {
      errors.guests = 'Le nombre d\'invités est requis';
    }

    if (!roomType) {
      errors.roomType = 'Le type de chambre est requis';
    }

    if (!name) {
      errors.name = 'Le nom complet est requis';
    } else {
      const nameValidation = validateFormField('name', name, true);
      if (!nameValidation.isValid) {
        errors.name = nameValidation.error;
      }
    }

    if (!email) {
      errors.email = 'L\'email est requis';
    } else {
      const emailValidation = validateFormField('email', email, true);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
      }
    }

    if (phone) {
      const phoneValidation = validateFormField('phone', phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error;
      }
    }

    if (message) {
      const messageValidation = validateFormField('message', message);
      if (!messageValidation.isValid) {
        errors.message = messageValidation.error;
      }
    }

    // Validation des dates
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        errors.checkIn = 'La date d\'arrivée ne peut pas être dans le passé';
      }

      if (checkOutDate <= checkInDate) {
        errors.checkOut = 'La date de départ doit être après la date d\'arrivée';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          errors,
          message: 'Veuillez corriger les erreurs dans le formulaire'
        },
        { status: 400 }
      );
    }

    // Sanitisation des données
    const sanitizedData = {
      checkIn: sanitizeInput(checkIn),
      checkOut: sanitizeInput(checkOut),
      guests: sanitizeInput(guests),
      roomType: sanitizeInput(roomType),
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : '',
      message: message ? sanitizeInput(message) : ''
    };

    // Calculer le montant total
    const totalAmount = ReservationService.calculateTotalAmount(
      sanitizedData.roomType,
      sanitizedData.checkIn,
      sanitizedData.checkOut,
      parseInt(sanitizedData.guests)
    );

    // Sauvegarder la réservation dans Supabase
    const reservationResult = await ReservationService.createReservation({
      user_email: sanitizedData.email,
      user_name: sanitizedData.name,
      user_phone: sanitizedData.phone,
      room_type: sanitizedData.roomType,
      check_in: sanitizedData.checkIn,
      check_out: sanitizedData.checkOut,
      guests: parseInt(sanitizedData.guests),
      message: sanitizedData.message,
      total_amount: totalAmount
    });

    if (!reservationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erreur lors de la sauvegarde de la réservation. Veuillez réessayer.' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Votre demande de réservation a été envoyée avec succès ! Notre équipe vous contactera dans les plus brefs délais.',
      bookingId: reservationResult.reservation?.id,
      totalAmount: totalAmount
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