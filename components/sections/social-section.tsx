'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Youtube, ExternalLink } from 'lucide-react';

export function SocialSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socialNetworks = [
    {
      name: 'Instagram',
      icon: Instagram,
      handle: '@palaiselmokricom',
      description:
        'Découvrez nos photos exclusives et les coulisses de la restauration',
      followers: '2.4K',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      link: '#',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      handle: 'Palais El Mokri',
      description: 'Suivez nos actualités et événements culturels',
      followers: '5.1K',
      color: 'bg-blue-600',
      link: '#',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      handle: 'Palais El Mokri',
      description: 'Visites virtuelles et documentaires historiques',
      followers: '1.8K',
      color: 'bg-red-600',
      link: '#',
    },
  ];

  return (
    <section ref={sectionRef} className="py-2 bg-background">
      <div className="mx-auto max-w-2xl px-10">
        <div className="text-center mb-10">
          <h2
            className={`font-display text-3xl font-bold text-foreground transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            {t('common.followSocial')}
          </h2>
          <p
            className={`mt-2 text-lg text-muted-foreground transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            {t('common.stayConnected')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {socialNetworks.map((network, index) => (
            <Card
              key={network.name}
              className={`group hover:shadow-lg transition-all duration-300 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <CardContent className="p-3 text-center">
                <div
                  className={`w-10 h-10 rounded-full ${network.color} flex items-center justify-center mx-auto mb-2`}
                >
                  <network.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-serif text-sm font-semibold text-foreground mb-1">
                  {network.name}
                </h3>
                <p className="text-secondary font-medium text-xs mb-1">
                  {network.handle}
                </p>
                <div className="mb-2">
                  <div className="font-display text-sm font-bold text-foreground">
                    {network.followers}
                  </div>
                  <div className="text-xs text-muted-foreground">Abonnés</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="group bg-transparent w-full text-xs"
                  asChild
                >
                  <a
                    href={network.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('common.follow')}
                    <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialSection;
