"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { getProductsByCategory } from "@/lib/database"
import { Product } from "@/lib/types"
import Image from "next/image"
import { AuthModal } from "@/components/auth/auth-modal"
import { CartModal } from "@/components/cart/cart-modal"

interface CategoryProductsProps {
  categorySlug: string
}

export const CategoryProducts = memo(function CategoryProducts({ categorySlug }: CategoryProductsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAllProducts, setShowAllProducts] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { addToCart, getCartItemCount } = useCart()
  const { user } = useAuth()

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

  const allProducts = getProductsByCategory(categorySlug)
  const displayedProducts = showAllProducts ? allProducts : allProducts.slice(0, 3)

  const handleAddToCart = useCallback((product: Product) => {
    if (!user) {
      setSelectedProduct(product)
      setShowAuthModal(true)
      return
    }

    addToCart(product, 1)
    setShowCartModal(true)
  }, [user, addToCart])

  const handleShowMore = useCallback(() => {
    setShowAllProducts(true)
  }, [])

  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false)
    setSelectedProduct(null)
  }, [])

  const handleCloseCartModal = useCallback(() => {
    setShowCartModal(false)
  }, [])

  const handleAuthSuccess = () => {
    if (selectedProduct) {
      addToCart(selectedProduct)
      setShowCartModal(true)
    }
    setSelectedProduct(null)
  }

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
              Nos Produits
            </h2>
            <p
              className={`mt-6 text-lg leading-8 text-muted-foreground text-pretty transition-all duration-800 delay-200 ${
                isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"
              }`}
            >
              Découvrez notre sélection de produits artisanaux authentiques
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map((product, index) => (
              <Card
                key={product.id}
                className={`group overflow-hidden hover:shadow-xl transition-all duration-500 ${
                  isVisible ? "animate-scale-in" : "opacity-0 scale-95"
                }`}
                style={{ animationDelay: `${400 + index * 150}ms` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    quality={80}
                  />
                  {product.badge && (
                    <Badge
                      className={`absolute top-3 left-3 ${
                        product.badge === "Promo"
                          ? "bg-red-500 hover:bg-red-600"
                          : product.badge === "Nouveau"
                            ? "bg-green-500 hover:bg-green-600"
                            : product.badge === "Limité"
                              ? "bg-orange-500 hover:bg-orange-600"
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
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg text-foreground">{product.price.toFixed(2)} €</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toFixed(2)} €
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Stock: {product.stock}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            {!showAllProducts ? (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowAllProducts(true)}
              >
                Voir tous les produits 
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowAllProducts(false)}
              >
                Voir moins de produits
              </Button>
            )}
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false)
          setSelectedProduct(null)
        }}
      />
      
      <CartModal 
        isOpen={showCartModal} 
        onClose={() => setShowCartModal(false)}
      />
    </>
  )
})
