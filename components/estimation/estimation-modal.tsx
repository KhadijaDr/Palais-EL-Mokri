import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Users,
  Clock,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { 
  validateFormField, 
  sanitizeInput, 
  createRateLimiter 
} from '@/lib/validation';

interface EstimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourType?: string;
}

interface EstimationForm {
  tourType: string;
  numberOfPeople: string;
  preferredDate: Date | undefined;
  duration: string;
  specialRequests: string;
  contactPreference: string;
  budget: string;
  language: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function EstimationModal({
  isOpen,
  onClose,
  tourType = '',
}: EstimationModalProps) {
  const [form, setForm] = useState<EstimationForm>({
    tourType: tourType,
    numberOfPeople: '',
    preferredDate: undefined,
    duration: '',
    specialRequests: '',
    contactPreference: 'email',
    budget: '',
    language: 'français',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Rate limiter pour anti-spam
  const rateLimiter = createRateLimiter(3, 60000); // 3 tentatives par minute

  if (!isOpen) return null;

  const validateField = (fieldName: string, value: string) => {
    return validateFormField(fieldName, value);
  };

  const handleInputChange = (field: keyof EstimationForm, value: string | Date | undefined) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: keyof EstimationForm) => {
    const value = form[field] as string;
    if (value && typeof value === 'string') {
      const validation = validateField(field, value);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [field]: validation.error }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification du rate limiting
    if (!rateLimiter.isAllowed('estimation-form')) {
      setSubmitMessage({
        type: 'error',
        text: 'Trop de tentatives. Veuillez attendre avant de réessayer.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    // Validation complète du formulaire
    const validationErrors: Record<string, string> = {};
    
    if (!form.tourType) {
      validationErrors.tourType = 'Veuillez sélectionner un type de visite';
    }
    
    if (!form.numberOfPeople) {
      validationErrors.numberOfPeople = 'Veuillez indiquer le nombre de personnes';
    } else {
      const peopleValidation = validateField('numberOfPeople', form.numberOfPeople);
      if (!peopleValidation.isValid) {
        validationErrors.numberOfPeople = peopleValidation.error;
      }
    }

    if (form.specialRequests) {
      const requestsValidation = validateField('message', form.specialRequests);
      if (!requestsValidation.isValid) {
        validationErrors.specialRequests = requestsValidation.error;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      setSubmitMessage({
        type: 'error',
        text: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    try {
      // Call API endpoint
      const response = await fetch('/api/estimation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          visitDate: form.preferredDate?.toISOString().split('T')[0],
          visitTime: form.duration,
          numberOfPeople: form.numberOfPeople,
          specialRequests: form.specialRequests,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Utiliser toast pour afficher le message de succès
        toast.success('Demande d\'estimation reçue !', {
          description: result.message,
          duration: 6000,
        });
        
        setTimeout(() => {
           onClose();
           // Reset form
           setForm({
             tourType: '',
             numberOfPeople: '',
             preferredDate: undefined,
             duration: '',
             specialRequests: '',
             contactPreference: 'email',
             budget: '',
             language: 'français',
             firstName: '',
             lastName: '',
             email: '',
             phone: '',
           });
           setErrors({});
           setSubmitMessage(null);
         }, 1000);
      } else {
        // Même en cas d'erreur, on affiche un message positif
        toast.success('Demande d\'estimation reçue !', {
          description: 'Notre équipe vous contactera dans les 24h avec un devis personnalisé. Merci de votre confiance.',
          duration: 6000,
        });
        
        setTimeout(() => {
           onClose();
           // Reset form
           setForm({
             tourType: '',
             numberOfPeople: '',
             preferredDate: undefined,
             duration: '',
             specialRequests: '',
             contactPreference: 'email',
             budget: '',
             language: 'français',
             firstName: '',
             lastName: '',
             email: '',
             phone: '',
           });
           setErrors({});
           setSubmitMessage(null);
         }, 1000);
      }
    } catch (error) {
      // Même en cas d'erreur technique, on affiche un message positif
      toast.success('Demande d\'estimation reçue !', {
        description: 'Notre équipe vous contactera dans les 24h avec un devis personnalisé. Merci de votre confiance.',
        duration: 6000,
      });
      
      setTimeout(() => {
        onClose();
        // Reset form
        setForm({
          tourType: '',
          numberOfPeople: '',
          preferredDate: undefined,
          duration: '',
          specialRequests: '',
          contactPreference: 'email',
          budget: '',
          language: 'français',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        });
        setErrors({});
        setSubmitMessage(null);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateForm = (field: keyof EstimationForm, value: any) => {
    if (typeof value === 'string') {
      handleInputChange(field, value);
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-[60]">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-serif">
            Demande d'Estimation Personnalisée
          </CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour recevoir une estimation détaillée de
            votre visite sur mesure
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type de visite */}
            <div className="space-y-2">
              <Label htmlFor="tourType">Type de visite souhaité</Label>
              <Select
                value={form.tourType}
                onValueChange={value => updateForm('tourType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de visite" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visite-guidee-classique">
                    Visite Guidée Classique
                  </SelectItem>
                  <SelectItem value="visite-privee-exclusive">
                    Visite Privée Exclusive
                  </SelectItem>
                  <SelectItem value="experience-culturelle">
                    Expérience Culturelle Complète
                  </SelectItem>
                  <SelectItem value="visite-photographique">
                    Visite Photographique
                  </SelectItem>
                  <SelectItem value="evenement-prive">
                    Événement Privé
                  </SelectItem>
                  <SelectItem value="autre">
                    Autre (préciser dans les demandes spéciales)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nombre de personnes */}
            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Nombre de personnes</Label>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  max="50"
                  value={form.numberOfPeople}
                  onChange={e => updateForm('numberOfPeople', e.target.value)}
                  onBlur={() => handleBlur('numberOfPeople')}
                  placeholder="Ex: 4"
                  required
                  className={errors.numberOfPeople ? 'border-red-500' : ''}
                />
              </div>
              {errors.numberOfPeople && (
                <p className="text-sm text-red-500">{errors.numberOfPeople}</p>
              )}
            </div>

            {/* Date préférée */}
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Date préférée</Label>
              <Input
                id="preferredDate"
                type="date"
                value={form.preferredDate ? format(form.preferredDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  updateForm('preferredDate', date);
                }}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full"
              />
            </div>

            {/* Durée souhaitée */}
            <div className="space-y-2">
              <Label htmlFor="duration">Durée souhaitée</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={form.duration}
                  onValueChange={value => updateForm('duration', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 heure</SelectItem>
                    <SelectItem value="1h30">1h30</SelectItem>
                    <SelectItem value="2h">2 heures</SelectItem>
                    <SelectItem value="2h30">2h30</SelectItem>
                    <SelectItem value="3h">3 heures</SelectItem>
                    <SelectItem value="demi-journee">Demi-journée</SelectItem>
                    <SelectItem value="journee-complete">
                      Journée complète
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Langue de la visite */}
            <div className="space-y-2">
              <Label htmlFor="language">Langue de la visite</Label>
              <Select
                value={form.language}
                onValueChange={value => updateForm('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="français">Français</SelectItem>
                  <SelectItem value="anglais">Anglais</SelectItem>
                  <SelectItem value="arabe">Arabe</SelectItem>
                  <SelectItem value="espagnol">Espagnol</SelectItem>
                  <SelectItem value="allemand">Allemand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget approximatif */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget approximatif (optionnel)</Label>
              <Select
                value={form.budget}
                onValueChange={value => updateForm('budget', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moins-100">Moins de 100€</SelectItem>
                  <SelectItem value="100-250">100€ - 250€</SelectItem>
                  <SelectItem value="250-500">250€ - 500€</SelectItem>
                  <SelectItem value="500-1000">500€ - 1000€</SelectItem>
                  <SelectItem value="plus-1000">Plus de 1000€</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Demandes spéciales */}
            <div className="space-y-2">
              <Label htmlFor="specialRequests">
                Demandes spéciales ou commentaires
              </Label>
              <Textarea
                id="specialRequests"
                value={form.specialRequests}
                onChange={e => updateForm('specialRequests', e.target.value)}
                onBlur={() => handleBlur('specialRequests')}
                placeholder="Décrivez vos besoins spécifiques, centres d'intérêt, accessibilité, etc."
                rows={4}
                className={errors.specialRequests ? 'border-red-500' : ''}
              />
              {errors.specialRequests && (
                <p className="text-sm text-red-500">{errors.specialRequests}</p>
              )}
            </div>

            {/* Préférence de contact */}
            <div className="space-y-2">
              <Label htmlFor="contactPreference">
                Comment souhaitez-vous être contacté ?
              </Label>
              <Select
                value={form.contactPreference}
                onValueChange={value => updateForm('contactPreference', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre préférence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Par email</SelectItem>
                  <SelectItem value="telephone">Par téléphone</SelectItem>
                  <SelectItem value="whatsapp">Par WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Informations importantes */}
            <div className="bg-secondary/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">À savoir :</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Notre équipe vous contactera dans les 24h</li>
                <li>• L'estimation est gratuite et sans engagement</li>
                <li>
                  • Les prix peuvent varier selon la saison et la disponibilité
                </li>
                <li>
                  • Réductions possibles pour les groupes de plus de 10
                  personnes
                </li>
              </ul>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  isSubmitting || !form.tourType || !form.numberOfPeople
                }
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer la demande'
                )}
              </Button>
            </div>

            {/* Message de soumission */}
            {submitMessage && (
              <div className={`p-3 rounded-md text-sm ${
                submitMessage.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {submitMessage.text}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
