import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';

interface DonationCTAProps {
  variant?: 'default' | 'floating' | 'inline';
  className?: string;
}

export function DonationCTA({
  variant = 'default',
  className = '',
}: DonationCTAProps) {
  const baseClasses =
    'bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium transition-all duration-300';

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <Button
          size="lg"
          className={`${baseClasses} shadow-lg hover:shadow-xl animate-pulse`}
          asChild
        >
          <Link href="/don">
            <Heart className="mr-2 h-5 w-5" />
            Soutenir
          </Link>
        </Button>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <Button className={`${baseClasses} ${className}`} asChild>
        <Link href="/don">
          <Heart className="mr-2 h-4 w-4" />
          Soutenir la rénovation
        </Link>
      </Button>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <Button size="lg" className={`${baseClasses} px-8 py-4 text-lg`} asChild>
        <Link href="/don">
          <Heart className="mr-3 h-6 w-6" />
          Soutenir la rénovation du Palais
        </Link>
      </Button>
    </div>
  );
}
