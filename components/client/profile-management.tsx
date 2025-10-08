'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Edit,
  Check,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { validateFormField } from '@/lib/validation';
import { supabase } from '@/lib/supabase';
import { PasswordSuccessModal } from '@/components/ui/password-success-modal';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalReservations: number;
  preferences?: {
    language: string;
    currency?: string;
    notifications: boolean;
    newsletter: boolean;
  };
}

interface ProfileManagementProps {
  userData: UserData;
  onUpdateProfile: (updates: Partial<UserData>) => Promise<void>;
}

export function ProfileManagement({ userData, onUpdateProfile }: ProfileManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    address: userData.address,
    preferences: userData.preferences || {
      language: 'fr',
      notifications: true,
      newsletter: true
    }
  });

  // Mettre à jour formData quand userData change
  useEffect(() => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      preferences: userData.preferences || {
        language: 'fr',
        notifications: true,
        newsletter: true
      }
    });
  }, [userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validation en temps réel
    if (errors[field]) {
      const validation = validateFormField(field as any, value, field === 'name' || field === 'email');
      if (validation.isValid) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const handlePreferenceChange = (preference: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validation en temps réel pour les mots de passe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validatePasswordForm = async () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe doit être différent du mot de passe actuel';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handlePasswordSave = async () => {
    const passwordErrors = await validatePasswordForm();
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Vérifier d'abord le mot de passe actuel en tentant une connexion
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: passwordData.currentPassword,
      });

      if (verifyError) {
        setErrors({ currentPassword: 'Le mot de passe actuel est incorrect' });
        setIsSubmitting(false);
        return;
      }

      // Si la vérification réussit, changer le mot de passe
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) {
        setErrors({ password: 'Erreur lors du changement de mot de passe: ' + updateError.message });
        setIsSubmitting(false);
        return;
      }
      
      // Réinitialiser les champs de mot de passe
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
      setErrors({});
      
      // Afficher la modale de succès
      setShowSuccessModal(true);
      
    } catch (error) {
      // Erreur lors du changement de mot de passe
      setErrors({ password: 'Erreur lors du changement de mot de passe' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validation du nom
    const nameValidation = validateFormField('name', formData.name, true);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }

    // Validation de l'email
    const emailValidation = validateFormField('email', formData.email, true);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    // Validation du téléphone (optionnel mais doit être valide si fourni)
    if (formData.phone && formData.phone.trim()) {
      const phoneValidation = validateFormField('phone', formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error;
      }
    }

    // Validation de l'adresse (optionnelle mais doit être valide si fournie)
    if (formData.address && formData.address.trim()) {
      const addressValidation = validateFormField('address', formData.address);
      if (!addressValidation.isValid) {
        newErrors.address = addressValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        preferences: formData.preferences
      });

      setIsEditing(false);
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue lors de la sauvegarde.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      preferences: formData.preferences
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mon Profil</h3>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              {isEditing ? (
                <div>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
              ) : (
                <p className="mt-1">{userData.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <p className="mt-1 text-gray-600">{userData.email}</p>
                {isEditing && (
                  <span className="text-xs text-gray-400 italic">Non modifiable</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              {isEditing ? (
                <div>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Votre numéro de téléphone"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              ) : (
                <p className="mt-1">{userData.phone || 'Non renseigné'}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Votre adresse complète"
                />
              ) : (
                <p className="mt-1">{userData.address || 'Non renseignée'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language">Langue préférée</Label>
              {isEditing ? (
                <Select 
                  value={formData.preferences.language} 
                  onValueChange={(value) => handlePreferenceChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="mt-1">
                  {formData.preferences.language === 'fr' ? 'Français' : 
                   formData.preferences.language === 'ar' ? 'العربية' : 'English'}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notifications par email</Label>
                {isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreferenceChange('notifications', !formData.preferences.notifications)}
                  >
                    {formData.preferences.notifications ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                ) : (
                  <span className={`text-sm ${formData.preferences.notifications ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.preferences.notifications ? 'Activées' : 'Désactivées'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="newsletter">Newsletter</Label>
                {isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreferenceChange('newsletter', !formData.preferences.newsletter)}
                  >
                    {formData.preferences.newsletter ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                ) : (
                  <span className={`text-sm ${formData.preferences.newsletter ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.preferences.newsletter ? 'Abonnée' : 'Non abonnée'}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations du compte */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label>ID du compte</Label>
              <p className="font-mono text-xs mt-1">{userData.id}</p>
            </div>
            <div>
              <Label>Membre depuis</Label>
              <p className="mt-1">{new Date(userData.joinDate).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <Label>Total réservations</Label>
              <p className="mt-1 font-semibold">{userData.totalReservations}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Sécurité - Changement de mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showPasswordSection ? (
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordSection(true)}
              className="w-full md:w-auto"
            >
              <Lock className="h-4 w-4 mr-2" />
              Changer le mot de passe
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className={errors.currentPassword ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={errors.newPassword ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowPasswordSection(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handlePasswordSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Modification...' : 'Modifier le mot de passe'}
                </Button>
              </div>

              {errors.password && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{errors.password}</p>
                </div>
              )}

              {errors.success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-green-600 text-sm font-medium">{errors.success}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              'Sauvegarde...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      )}

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Modale de succès pour changement de mot de passe */}
      <PasswordSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Mot de passe modifié !"
        message="Votre mot de passe a été modifié avec succès."
        buttonText="Parfait"
      />
    </div>
  );
}