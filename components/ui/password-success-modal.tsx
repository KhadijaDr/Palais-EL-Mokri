'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, X } from 'lucide-react';

interface PasswordSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

export function PasswordSuccessModal({
  isOpen,
  onClose,
  title = "Mot de passe modifié !",
  message = "Votre mot de passe a été modifié avec succès.",
  buttonText = "Parfait"
}: PasswordSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
          
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-display text-green-700">
            {title}
          </CardTitle>
          <CardDescription className="text-base">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <Button 
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}