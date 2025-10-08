'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { ReservationManagement } from './reservation-management';
import { ProfileManagement } from './profile-management';
import { useAuth } from '@/contexts/auth-context';
import { Reservation } from '@/lib/types';

interface ClientAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClientAccount({ isOpen, onClose }: ClientAccountProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const { user, updateProfile } = useAuth();

  // Charger les réservations de l'utilisateur
  useEffect(() => {
    if (user?.email && isOpen) {
      loadUserReservations();
    }
  }, [user?.email, isOpen]);

  const loadUserReservations = async () => {
    if (!user?.email) return;
    
    setIsLoadingReservations(true);
    try {
      const response = await fetch(`/api/reservations?email=${encodeURIComponent(user.email)}`);
      const result = await response.json();
      
      if (result.success && result.reservations) {
        setUserReservations(result.reservations);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const handleUpdateReservation = async (id: string, updates: any) => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/reservations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          userEmail: user.email,
          updates
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Recharger les réservations
        await loadUserReservations();
      } else {
        console.error('Erreur lors de la mise à jour:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!user?.email) return;

    try {
      const response = await fetch(`/api/reservations?id=${id}&email=${encodeURIComponent(user.email)}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        // Recharger les réservations
        await loadUserReservations();
      } else {
        console.error('Erreur lors de l\'annulation:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
    }
  };

  if (!isOpen) return null;

  // Si pas d'utilisateur connecté, ne pas afficher le composant
  if (!user) {
    return null;
  }

  // Créer les données utilisateur à partir du contexte d'authentification
  const userData = {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim() || 'Utilisateur',
    email: user.email,
    phone: user.phone || '',
    address: user.address ? 
      `${user.address.city || ''}, ${user.address.country || ''}`.replace(/^,\s*|,\s*$/g, '') || ''
      : '',
    joinDate: user.createdAt.toISOString().split('T')[0],
    totalReservations: userReservations.length,
    preferences: user.preferences || {
      language: 'fr',
      notifications: true,
      newsletter: true
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mon Compte</h2>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="reservations">Réservations</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{userData.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{userData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{userData.address}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Statistiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Membre depuis</span>
                      <span>{userData.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total réservations</span>
                      <span>{userData.totalReservations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Réservations confirmées</span>
                      <span>{userReservations.filter(r => r.status === 'confirmed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Réservations terminées</span>
                      <span>{userReservations.filter(r => r.status === 'completed').length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Réservations récentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Réservations récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoadingReservations ? (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">Chargement des réservations...</p>
                      </div>
                    ) : userReservations.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">Aucune réservation trouvée</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Vos réservations apparaîtront ici une fois que vous en aurez effectué.
                        </p>
                      </div>
                    ) : (
                      userReservations.slice(0, 3).map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{reservation.room_type === 'suite' ? 'Suite Royale' : 'Chambre Traditionnelle'}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(reservation.check_in).toLocaleDateString('fr-FR')} - {new Date(reservation.check_out).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {reservation.guests} invité{reservation.guests > 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          {getStatusBadge(reservation.status)}
                          <div className="text-sm font-medium">
                            {reservation.total_amount ? `${reservation.total_amount} MAD` : 'Prix à confirmer'}
                          </div>
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('reservations')}
                      className="w-full"
                    >
                      Voir toutes les réservations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reservations">
              <ReservationManagement 
                reservations={userReservations}
                onUpdateReservation={handleUpdateReservation}
                onCancelReservation={handleCancelReservation}
              />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileManagement 
                userData={userData}
                onUpdateProfile={async (updates) => {
                  try {
                    const result = await updateProfile({
                      firstName: updates.name?.split(' ')[0] || user?.firstName,
                      lastName: updates.name?.split(' ').slice(1).join(' ') || user?.lastName,
                      email: updates.email || user?.email,
                      phone: updates.phone || user?.phone,
                      address: typeof updates.address === 'string' ? undefined : updates.address || user?.address,
                      preferences: updates.preferences ? {
                        ...updates.preferences,
                        language: updates.preferences.language as 'fr' | 'en' | 'ar',
                        currency: (updates.preferences.currency as 'EUR' | 'USD' | 'MAD') || user?.preferences?.currency || 'EUR'
                      } : user?.preferences
                    });  
                    if (!result.success) {
                    }
                  } catch (error) {
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}