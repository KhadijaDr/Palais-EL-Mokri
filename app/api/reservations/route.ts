import { NextRequest, NextResponse } from 'next/server';
import { ReservationService } from '@/lib/reservation-service';
import { validateFormField, sanitizeInput } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    const reservationId = searchParams.get('id');

    if (!userEmail && !reservationId) {
      return NextResponse.json(
        { success: false, error: 'Email utilisateur ou ID de réservation requis' },
        { status: 400 }
      );
    }

    if (reservationId) {
      // Récupérer une réservation spécifique
      const result = await ReservationService.getReservationById(reservationId);
      return NextResponse.json(result);
    } else if (userEmail) {
      // Récupérer toutes les réservations d'un utilisateur
      const result = await ReservationService.getUserReservations(userEmail);
      return NextResponse.json(result);
    }

  } catch (error) {
    console.error('Erreur dans GET /api/reservations:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userEmail, updates } = body;

    if (!id || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'ID de réservation et email utilisateur requis' },
        { status: 400 }
      );
    }

    // Vérifier que la réservation appartient à l'utilisateur
    const reservationResult = await ReservationService.getReservationById(id);
    if (!reservationResult.success || !reservationResult.reservation) {
      return NextResponse.json(
        { success: false, error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    if (reservationResult.reservation.user_email !== userEmail) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Vérifier si la réservation peut être modifiée
    if (!ReservationService.canModifyReservation(reservationResult.reservation)) {
      return NextResponse.json(
        { success: false, error: 'Cette réservation ne peut plus être modifiée' },
        { status: 400 }
      );
    }

    // Validation des données de mise à jour
    const errors: Record<string, string> = {};
    const sanitizedUpdates: any = {};

    if (updates.check_in) {
      const checkInDate = new Date(updates.check_in);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkInDate < today) {
        errors.check_in = 'La date d\'arrivée ne peut pas être dans le passé';
      } else {
        sanitizedUpdates.check_in = sanitizeInput(updates.check_in);
      }
    }

    if (updates.check_out) {
      sanitizedUpdates.check_out = sanitizeInput(updates.check_out);
    }

    if (updates.check_in && updates.check_out) {
      const checkInDate = new Date(updates.check_in);
      const checkOutDate = new Date(updates.check_out);
      
      if (checkOutDate <= checkInDate) {
        errors.check_out = 'La date de départ doit être après la date d\'arrivée';
      }
    }

    if (updates.guests) {
      const guests = parseInt(updates.guests);
      if (isNaN(guests) || guests < 1 || guests > 10) {
        errors.guests = 'Le nombre d\'invités doit être entre 1 et 10';
      } else {
        sanitizedUpdates.guests = guests;
      }
    }

    if (updates.room_type) {
      if (!['suite', 'traditional'].includes(updates.room_type)) {
        errors.room_type = 'Type de chambre invalide';
      } else {
        sanitizedUpdates.room_type = sanitizeInput(updates.room_type);
      }
    }

    if (updates.message !== undefined) {
      if (updates.message && updates.message.length > 1000) {
        errors.message = 'Le message ne peut pas dépasser 1000 caractères';
      } else {
        sanitizedUpdates.message = updates.message ? sanitizeInput(updates.message) : null;
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Recalculer le montant total si nécessaire
    if (sanitizedUpdates.room_type || sanitizedUpdates.check_in || sanitizedUpdates.check_out || sanitizedUpdates.guests) {
      const roomType = sanitizedUpdates.room_type || reservationResult.reservation.room_type;
      const checkIn = sanitizedUpdates.check_in || reservationResult.reservation.check_in;
      const checkOut = sanitizedUpdates.check_out || reservationResult.reservation.check_out;
      const guests = sanitizedUpdates.guests || reservationResult.reservation.guests;
      
      sanitizedUpdates.total_amount = ReservationService.calculateTotalAmount(roomType, checkIn, checkOut, guests);
    }

    const result = await ReservationService.updateReservation(id, sanitizedUpdates);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Erreur dans PUT /api/reservations:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userEmail = searchParams.get('email');

    if (!id || !userEmail) {
      return NextResponse.json(
        { success: false, error: 'ID de réservation et email utilisateur requis' },
        { status: 400 }
      );
    }

    const result = await ReservationService.cancelReservation(id, userEmail);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Erreur dans DELETE /api/reservations:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}