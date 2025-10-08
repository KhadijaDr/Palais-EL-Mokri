"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Users, Award, Download } from "lucide-react"
import Image from "next/image"

export function DocumentarySection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2
            className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
              isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"
            }`}
          >
            Documentaire historique
          </h2>
          <p
            className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
              isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"
            }`}
          >
            Découvrez l'histoire du Palais El Mokri à travers un documentaire exclusif
          </p>
        </div>

        <div
          className={`transition-all duration-800 delay-400 ${isVisible ? "animate-scale-in" : "opacity-0 scale-95"}`}
        >
          <Card className="overflow-hidden max-w-4xl mx-auto">
            <div className="relative aspect-video group">
              <Image
                src="/optimized/palais-el-mokri-f-s-morocco-architecture-tradition.webp"
                alt="Documentaire Palais El Mokri - Aperçu"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group cursor-pointer hover:bg-black/50 transition-all duration-300">
                <div className="rounded-full bg-white/20 p-8 backdrop-blur-sm group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                  <Play className="h-16 w-16 text-white ml-1 drop-shadow-lg" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-white/20">
                <Clock className="inline h-4 w-4 mr-2" />
                45 min
              </div>

              {/* Quality Badge */}
              <div className="absolute top-4 left-4 bg-secondary/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                HD
              </div>
            </div>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="rounded-full bg-secondary/10 p-3 w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div className="font-display text-2xl font-bold text-foreground">12</div>
                <div className="text-sm text-muted-foreground">Témoins historiques</div>
              </div>
              <div className="text-center">
                <div className="rounded-full bg-secondary/10 p-3 w-fit mx-auto mb-3">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div className="font-display text-2xl font-bold text-foreground">2023</div>
                <div className="text-sm text-muted-foreground">Prix du patrimoine</div>
              </div>
              <div className="text-center">
                <div className="rounded-full bg-secondary/10 p-3 w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div className="font-display text-2xl font-bold text-foreground">45</div>
                <div className="text-sm text-muted-foreground">Minutes d'histoire</div>
              </div>
            </div>

            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              "Palais El Mokri : Mémoires de Fès"
            </h3>

            <p className="text-muted-foreground leading-7 mb-6">
              Ce documentaire exceptionnel retrace l'histoire du Palais El Mokri à travers les témoignages de
              descendants de la famille, d'historiens renommés et d'artisans traditionnels. Des images d'archives
              inédites révèlent la splendeur passée du palais et les défis de sa préservation contemporaine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={() => window.open('https://youtu.be/A4NFWfNRzmI?si=3qX0stf992RGAHDh', '_blank')}
              >
                <Play className="mr-2 h-5 w-5" />
                Regarder le documentaire
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  // Créer un lien de téléchargement pour la bande-annonce
                  const link = document.createElement('a');
                  link.href = '/documentary.mp4';
                  link.download = 'Palais_El_Mokri_Bande_Annonce.mp4';
                  link.click();
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Télécharger la bande-annonce
              </Button>
            </div>
        </CardContent>
        </Card>
        </div>
      </div>
    </section>
  )
}
