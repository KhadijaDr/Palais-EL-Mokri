"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Product } from "@/lib/types"
import { AuthModal } from "@/components/auth/auth-modal"
import { CartModal } from "@/components/cart/cart-modal"

export const FeaturedProducts = memo(function FeaturedProducts() {
  const [isVisible, setIsVisible] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = useCallback((product: Product) => {
    if (!user) {
      setSelectedProduct(product)
      setShowAuthModal(true)
      return
    }

    addToCart(product, 1)
    setShowCartModal(true)
  }, [user, addToCart])

  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false)
    setSelectedProduct(null)
  }, [])

  const handleCloseCartModal = useCallback(() => {
    setShowCartModal(false)
  }, [])

  const handleAuthSuccess = useCallback(() => {
    if (selectedProduct) {
      addToCart(selectedProduct, 1)
      setShowCartModal(true)
      setSelectedProduct(null)
    }
    setShowAuthModal(false)
  }, [selectedProduct, addToCart])

  const handleViewAllProducts = useCallback(() => {
    router.push('/boutique/categorie/ceramiques-zellige')
  }, [router])

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

  const products: Product[] = [
    {
      id: "ceramic-001",
      name: "Vase en Céramique de Fès",
      description: "Magnifique vase en céramique traditionnelle de Fès, fait à la main par des artisans locaux.",
      price: 120,
      originalPrice: 150,
      image: "/optimized/moroccan-ceramic-vase-fez-traditional.webp",
      rating: 4.8,
      reviews: 24,
      badge: "Bestseller",
      artisan: "Maître Hassan",
      artisanId: "artisan-001",
      category: "Céramiques & Zellige",
      categorySlug: "ceramiques-zellige",
      stock: 15,
      tags: ["céramique", "vase", "fès", "traditionnel"],
      materials: ["Argile", "Émail"],
      origin: "Fès, Maroc",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "decoration-001",
      name: "Plateau en Cuivre Gravé",
      description: "Plateau en cuivre finement gravé selon les techniques ancestrales marocaines.",
      price: 85,
      image: "/optimized/engraved-copper-tray-moroccan-traditional.webp",
      rating: 4.9,
      reviews: 18,
      badge: "Nouveau",
      artisan: "Atelier Bennani",
      artisanId: "artisan-002",
      category: "Décoration",
      categorySlug: "decoration",
      stock: 8,
      tags: ["cuivre", "plateau", "gravé", "traditionnel"],
      materials: ["Cuivre"],
      origin: "Marrakech, Maroc",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "decoration-002",
      name: "Lampe Traditionnelle",
      description: "Lampe traditionnelle en laiton avec motifs ornementaux complexes.",
      price: 200,
      originalPrice: 250,
      image: "/optimized/traditional-moroccan-lamp-brass-ornate.webp",
      rating: 4.7,
      reviews: 31,
      badge: "Promo",
      artisan: "Maître Youssef",
      artisanId: "artisan-003",
      category: "Décoration",
      categorySlug: "decoration",
      stock: 5,
      tags: ["lampe", "laiton", "traditionnel", "ornements"],
      materials: ["Laiton", "Verre"],
      origin: "Tétouan, Maroc",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "textiles-001",
      name: "Coussin Brodé Main",
      description: "Coussin brodé à la main avec des motifs berbères authentiques.",
      price: 45,
      image: "/optimized/hand-embroidered-moroccan-cushion-traditional.webp",
      rating: 4.6,
      reviews: 12,
      artisan: "Coopérative Fatima",
      artisanId: "artisan-100",
      category: "Textiles",
      categorySlug: "textiles",
      stock: 18,
      tags: ["coussin", "broderie", "berbère", "textile"],
      materials: ["Coton", "Soie"],
      origin: "Atlas, Maroc",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <>
      <section ref={sectionRef} className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2
              className={`font-display text-4xl font-bold text-foreground sm:text-5xl transition-all duration-800 ${
                isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"
              }`}
            >
              Produits Vedettes
            </h2>
            <p
              className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
                isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"
              }`}
            >
              Découvrez notre sélection des plus belles pièces artisanales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <Card
                key={product.name}
                className={`group overflow-hidden hover:shadow-xl transition-all duration-500 ${
                  isVisible ? "animate-scale-in" : "opacity-0 scale-95"
                }`}
                style={{ animationDelay: `${400 + index * 150}ms` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <Badge
                      className={`absolute top-3 left-3 ${
                        product.badge === "Promo"
                          ? "bg-red-500 hover:bg-red-600"
                          : product.badge === "Nouveau"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-secondary hover:bg-secondary/90"
                      }`}
                    >
                      {product.badge}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-secondary text-secondary" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{product.artisan}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-foreground">{product.price} €</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{product.originalPrice} €</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ajouter au panier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/boutique/categorie/ceramiques-zellige')}
            >
              Voir tous les produits
            </Button>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleCloseAuthModal}
        onSuccess={handleAuthSuccess}
      />
      
      <CartModal 
        isOpen={showCartModal} 
        onClose={handleCloseCartModal}
      />
    </>
  )
})

export default FeaturedProducts;
