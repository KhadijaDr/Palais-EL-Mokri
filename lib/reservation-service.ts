import { supabase } from './supabase';

export interface SupabaseReservation {
  id: string;
  user_email: string;
  user_name: string;
  user_phone?: string;
  room_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount?: number;
  team_feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReservationData {
  user_email: string;
  user_name: string;
  user_phone?: string;
  room_type: string;
  check_in: string;
  check_out: string;
  guests: number;
  message?: string;
  total_amount?: number;
}

export interface UpdateReservationData {
  room_type?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  message?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount?: number;
  team_feedback?: string;
}

export class ReservationService {
  /**
   * Créer une nouvelle réservation
   */
  static async createReservation(data: CreateReservationData): Promise<{ success: boolean; reservation?: SupabaseReservation; error?: string }> {
    try {
      const { data: reservation, error } = await supabase
        .from('reservations')
        .insert([{
          user_email: data.user_email,
          user_name: data.user_name,
          user_phone: data.user_phone,
          room_type: data.room_type,
          check_in: data.check_in,
          check_out: data.check_out,
          guests: data.guests,
          message: data.message,
          total_amount: data.total_amount,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        return { success: false, error: error.message };
      }

      return { success: true, reservation };
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      return { success: false, error: 'Erreur interne du serveur' };
    }
  }

  /**
   * Récupérer les réservations d'un utilisateur par email
   */
  static async getUserReservations(userEmail: string): Promise<{ success: boolean; reservations?: SupabaseReservation[]; error?: string }> {
    try {
      const { data: reservations, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        return { success: false, error: error.message };
      }

      return { success: true, reservations: reservations || [] };
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      return { success: false, error: 'Erreur interne du serveur' };
    }
  }

  /**
   * Récupérer une réservation par ID
   */
  static async getReservationById(id: string): Promise<{ success: boolean; reservation?: SupabaseReservation; error?: string }> {
    try {
      const { data: reservation, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de la réservation:', error);
        return { success: false, error: error.message };
      }

      return { success: true, reservation };
    } catch (error) {
      console.error('Erreur lors de la récupération de la réservation:', error);
      return { success: false, error: 'Erreur interne du serveur' };
    }
  }

  /**
   * Mettre à jour une réservation
   */
  static async updateReservation(id: string, updates: UpdateReservationData): Promise<{ success: boolean; reservation?: SupabaseReservation; error?: string }> {
    try {
      // Vérifier d'abord que la réservation existe
      const { data: existingReservation, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !existingReservation) {
        console.error('Réservation non trouvée:', fetchError);
        return { success: false, error: 'Réservation non trouvée' };
      }

      // Effectuer la mise à jour
      const { data: reservation, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de la réservation:', error);
        return { success: false, error: error.message };
      }

      if (!reservation) {
        return { success: false, error: 'Aucune réservation mise à jour' };
      }

      return { success: true, reservation };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      return { success: false, error: 'Erreur interne du serveur' };
    }
  }

  /**
   * Annuler une réservation
   */
  static async cancelReservation(id: string, userEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Vérifier que la réservation appartient à l'utilisateur
      const { data: reservation, error: fetchError } = await supabase
        .from('reservations')
        .select('user_email, status')
        .eq('id', id)
        .single();

      if (fetchError) {
        return { success: false, error: 'Réservation non trouvée' };
      }

      if (reservation.user_email !== userEmail) {
        return { success: false, error: 'Non autorisé' };
      }

      if (reservation.status === 'cancelled') {
        return { success: false, error: 'Cette réservation est déjà annulée' };
      }

      if (reservation.status === 'completed') {
        return { success: false, error: 'Impossible d\'annuler une réservation terminée' };
      }

      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (updateError) {
        console.error('Erreur lors de l\'annulation de la réservation:', updateError);
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      return { success: false, error: 'Erreur interne du serveur' };
    }
  }

  /**
   * Vérifier si une réservation peut être modifiée
   */
  static canModifyReservation(reservation: SupabaseReservation): boolean {
    return reservation.status === 'pending' || reservation.status === 'confirmed';
  }

  /**
   * Vérifier si une réservation peut être annulée
   */
  static canCancelReservation(reservation: SupabaseReservation): boolean {
    return reservation.status === 'pending' || reservation.status === 'confirmed';
  }

  /**
   * Calculer le montant total d'une réservation (logique métier à adapter)
   */
  static calculateTotalAmount(roomType: string, checkIn: string, checkOut: string, guests: number): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Prix de base par nuit selon le type de chambre
    const basePrice = roomType === 'suite' ? 1500 : 800; // MAD
    
    // Supplément par invité supplémentaire (au-delà de 2)
    const extraGuestPrice = guests > 2 ? (guests - 2) * 200 : 0;
    
    return (basePrice + extraGuestPrice) * nights;
  }
}