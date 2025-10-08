'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Euro, Users, Calendar, Trophy } from 'lucide-react';

export function DonationProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const targetAmount = 500000;
  const currentAmount = 342000;
  const progressPercentage = (currentAmount / targetAmount) * 100;

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

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const increment = currentAmount / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= currentAmount) {
          setAnimatedAmount(currentAmount);
          clearInterval(timer);
        } else {
          setAnimatedAmount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, currentAmount]);

  const stats = [
    {
      icon: Euro,
      value: `${animatedAmount.toLocaleString('fr-FR')} MAD`,
      label: 'Collectés',
      sublabel: `sur ${targetAmount.toLocaleString('fr-FR')} MAD`,
    },
    {
      icon: Users,
      value: '1,247',
      label: 'Donateurs',
      sublabel: 'Merci à tous !',
    },
    {
      icon: Calendar,
      value: '127',
      label: 'Jours restants',
      sublabel: 'Campagne 2024',
    },
    {
      icon: Trophy,
      value: `${Math.round(progressPercentage)}%`,
      label: "De l'objectif",
      sublabel: 'Nous y sommes presque !',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Notre progression
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
            }`}
          >
            Grâce à votre générosité, nous nous rapprochons de notre objectif
          </p>
        </div>

        {/* Progress Bar */}
        <div
          className={`mb-16 transition-all duration-800 delay-400 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Campagne de rénovation 2024
                </h3>
                <div className="text-right">
                  <div className="font-display text-3xl font-bold text-secondary">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Complété</div>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-4 mb-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 MAD</span>
                <span className="font-medium text-foreground">
                  {animatedAmount.toLocaleString('fr-FR')} MAD collectés
                </span>
                <span>{targetAmount.toLocaleString('fr-FR')} MAD</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className={`text-center transition-all duration-800 ${
                isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
              }`}
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-secondary/10 p-3">
                    <stat.icon className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div className="font-display text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="font-serif text-lg text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.sublabel}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
