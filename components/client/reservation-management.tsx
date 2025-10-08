'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

import { Reservation } from '@/lib/types';

interface ReservationManagementProps {
  reservations: Reservation[];
  onUpdateReservation: (id: string, updates: Partial<Reservation>) => void;
  onCancelReservation: (id: string) => void;
}

export function ReservationManagement({ 
  reservations, 
  onUpdateReservation, 
  onCancelReservation 
}: ReservationManagementProps) {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [editForm, setEditForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
    roomType: '',
    message: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Annulée</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Inconnue</Badge>;
    }
  };

  const canModifyReservation = (reservation: Reservation) => {
    return reservation.status === 'pending' || reservation.status === 'confirmed';
  };

  const canCancelReservation = (reservation: Reservation) => {
    const checkInDate = new Date(reservation.check_in);
    const today = new Date();
    const daysDifference = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    return (reservation.status === 'pending' || reservation.status === 'confirmed') && daysDifference > 2;
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setEditForm({
      checkIn: reservation.check_in,
      checkOut: reservation.check_out,
      guests: reservation.guests.toString(),
      roomType: reservation.room_type,
      message: reservation.message || ''
    });
  };

  const handleSaveEdit = () => {
    if (editingReservation) {
      onUpdateReservation(editingReservation.id, {
        check_in: editForm.checkIn,
        check_out: editForm.checkOut,
        guests: parseInt(editForm.guests),
        room_type: editForm.roomType,
        message: editForm.message
      });
      setEditingReservation(null);
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mes Réservations</h3>
        <div className="text-sm text-muted-foreground">
          {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-4">
        {sortedReservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-4">
                    <h4 className="font-semibold text-lg">
                      {reservation.room_type === 'suite' ? 'Suite Royale' : 'Chambre Traditionnelle'}
                    </h4>
                    {getStatusBadge(reservation.status)}
                  </div>
                  
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(reservation.check_in).toLocaleDateString('fr-FR')} - {new Date(reservation.check_out).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.guests} invité{reservation.guests > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Réservé le {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="font-semibold text-lg">
                      {reservation.total_amount ? `${reservation.total_amount} MAD` : 'Prix à confirmer'}
                    </div>
                  </div>

                  {reservation.message && (
                    <div className="text-sm">
                      <span className="font-medium">Message: </span>
                      <span className="text-muted-foreground">{reservation.message}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedReservation(reservation)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Détails de la réservation</DialogTitle>
                      </DialogHeader>
                      {selectedReservation && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>ID de réservation</Label>
                              <p className="text-sm font-mono">{selectedReservation.id}</p>
                            </div>
                            <div>
                              <Label>Statut</Label>
                              <div className="mt-1">{getStatusBadge(selectedReservation.status)}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Date d'arrivée</Label>
                              <p>{new Date(selectedReservation.check_in).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <Label>Date de départ</Label>
                              <p>{new Date(selectedReservation.check_out).toLocaleDateString('fr-FR')}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Type de chambre</Label>
                              <p>{selectedReservation.room_type === 'suite' ? 'Suite Royale' : 'Chambre Traditionnelle'}</p>
                            </div>
                            <div>
                              <Label>Nombre d'invités</Label>
                              <p>{selectedReservation.guests}</p>
                            </div>
                          </div>
                          <div>
                            <Label>Montant total</Label>
                            <p className="text-lg font-semibold">
                              {selectedReservation.total_amount ? `${selectedReservation.total_amount} MAD` : 'Prix à confirmer'}
                            </p>
                          </div>
                          {selectedReservation.message && (
                            <div>
                              <Label>Message</Label>
                              <p className="text-sm">{selectedReservation.message}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {canModifyReservation(reservation) && (
                    <Dialog open={editingReservation?.id === reservation.id} onOpenChange={(open) => !open && setEditingReservation(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEditReservation(reservation)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier la réservation</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-checkIn">Date d'arrivée</Label>
                              <Input
                                id="edit-checkIn"
                                type="date"
                                value={editForm.checkIn}
                                onChange={(e) => setEditForm({...editForm, checkIn: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-checkOut">Date de départ</Label>
                              <Input
                                id="edit-checkOut"
                                type="date"
                                value={editForm.checkOut}
                                onChange={(e) => setEditForm({...editForm, checkOut: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-guests">Nombre d'invités</Label>
                              <Select value={editForm.guests} onValueChange={(value) => setEditForm({...editForm, guests: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 personne</SelectItem>
                                  <SelectItem value="2">2 personnes</SelectItem>
                                  <SelectItem value="3">3 personnes</SelectItem>
                                  <SelectItem value="4">4 personnes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-roomType">Type de chambre</Label>
                              <Select value={editForm.roomType} onValueChange={(value) => setEditForm({...editForm, roomType: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="suite">Suite Royale</SelectItem>
                                  <SelectItem value="traditional">Chambre Traditionnelle</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-message">Message</Label>
                            <Textarea
                              id="edit-message"
                              value={editForm.message}
                              onChange={(e) => setEditForm({...editForm, message: e.target.value})}
                              placeholder="Message, demandes spéciales..."
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingReservation(null)}>
                              Annuler
                            </Button>
                            <Button onClick={handleSaveEdit}>
                              Sauvegarder
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {canCancelReservation(reservation) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer l'annulation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
                            <br /><br />
                            <strong>Réservation:</strong> {reservation.room_type === 'suite' ? 'Suite Royale' : 'Chambre Traditionnelle'}<br />
                            <strong>Dates:</strong> {new Date(reservation.check_in).toLocaleDateString('fr-FR')} - {new Date(reservation.check_out).toLocaleDateString('fr-FR')}<br />
                            <strong>Montant:</strong> {reservation.total_amount ? `${reservation.total_amount} MAD` : 'Prix à confirmer'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Non, garder</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onCancelReservation(reservation.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Oui, annuler
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reservations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
            <p className="text-muted-foreground">
              Vous n'avez pas encore effectué de réservation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}