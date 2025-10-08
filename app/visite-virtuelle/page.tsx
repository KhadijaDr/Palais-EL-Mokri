'use client';

import { useEffect, useRef } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import Link from 'next/link';

export default function VirtualTourPage() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const photoSphereRef = useRef<any>(null);

  useEffect(() => {
    // Charger PhotoSphere Viewer depuis CDN
    const loadPhotoSphere = async () => {
      // Charger le CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css';
      document.head.appendChild(link);

      // Charger le JavaScript
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.js';
      script.onload = () => {
        if (viewerRef.current && (window as any).PhotoSphereViewer) {
          const PhotoSphereViewer = (window as any).PhotoSphereViewer;

          photoSphereRef.current = new PhotoSphereViewer.Viewer({
            container: viewerRef.current,
            panorama:
              '/palais-el-mokri-f-s-morocco-architecture-tradition.jpeg',
            caption: 'Palais El Mokri - Visite Virtuelle 360°',
            loadingImg:
              'https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg',
            navbar: [
              'autorotate',
              'zoom',
              'fullscreen',
              'caption',
              'spacer',
              'download',
            ],
            defaultZoomLvl: 30,
            minFov: 10,
            maxFov: 90,
            autorotateDelay: 3000,
            autorotateSpeed: '0.5rpm',
            plugins: [],
          });
        }
      };
      document.head.appendChild(script);
    };

    loadPhotoSphere();

    // Cleanup
    return () => {
      if (photoSphereRef.current) {
        photoSphereRef.current.destroy();
      }
    };
  }, []);

  const handleZoomIn = () => {
    if (photoSphereRef.current) {
      photoSphereRef.current.zoom(10);
    }
  };

  const handleZoomOut = () => {
    if (photoSphereRef.current) {
      photoSphereRef.current.zoom(-10);
    }
  };

  const handleReset = () => {
    if (photoSphereRef.current) {
      photoSphereRef.current.reset();
    }
  };

  const handleFullscreen = () => {
    if (photoSphereRef.current) {
      photoSphereRef.current.enterFullscreen();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Navigation Bar */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/galerie">
            <Button
              variant="outline"
              size="sm"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-sans bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la galerie
            </Button>
          </Link>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleFullscreen}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          ref={viewerRef}
          className="w-full h-[calc(100vh-200px)] min-h-[600px]"
          style={{ minHeight: '600px' }}
        />

        {/* Loading Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Chargement de la visite virtuelle...
            </p>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-background border-t py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-serif text-lg font-semibold mb-2">
                Navigation
              </h3>
              <p className="text-sm text-muted-foreground">
                Cliquez et glissez pour explorer l'espace à 360°
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg font-semibold mb-2">Zoom</h3>
              <p className="text-sm text-muted-foreground">
                Utilisez la molette de la souris pour zoomer
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-serif text-lg font-semibold mb-2">
                Plein Écran
              </h3>
              <p className="text-sm text-muted-foreground">
                Cliquez sur l'icône plein écran pour une immersion totale
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
