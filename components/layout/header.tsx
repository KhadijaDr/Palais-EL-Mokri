"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/ui/language-selector"
import { Menu, X, Facebook, Instagram, Youtube, ChevronDown, ShoppingCart, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { AuthModal } from "@/components/auth/auth-modal"
import { CartModal } from "@/components/cart/cart-modal"
import { ClientAccount } from "@/components/client/client-account"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visitDropdownOpen, setVisitDropdownOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCartModal, setShowCartModal] = useState(false)
  const [showClientAccount, setShowClientAccount] = useState(false)
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const { getCartItemCount } = useCart()

  const navigation = [
    { name: t("nav.history"), href: "/histoire" },
    { name: t("nav.gallery"), href: "/galerie" },
    {
      name: t("nav.visit"),
      href: "/visite",
      hasDropdown: true,
      subItems: [
        { name: t("nav.visitSub.accommodation"), href: "/visite/hebergement" },
        { name: t("nav.visitSub.palaceTour"), href: "/visite/palais" },
      ],
    },
    { name: t("nav.association"), href: "/association" },
    { name: t("nav.boutique"), href: "/boutique" },
    { name: t("nav.contact"), href: "/contact" },
  ]

  return (
    <>
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1 md:pr-8">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2 group min-w-0">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
              <Image
                  src="/optimized/logo.webp"
                  alt="Palais El Mokri - Logo"
                  fill
                  className="object-contain transition-transform duration-200 group-hover:scale-105"
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 48px, 56px"
                />
              </div>
            </Link>
          </div>
          <div className="flex lg:hidden md:pl-8">
            <Button
              variant="ghost"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-primary-foreground hover:text-secondary hover:bg-transparent"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-8 w-8 md:h-12 md:w-12" aria-hidden="true" />
            </Button>
          </div>

          <div className="hidden lg:flex lg:gap-x-4">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setVisitDropdownOpen(true)}
                    onMouseLeave={() => setVisitDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm font-sans font-medium leading-6 text-primary-foreground hover:text-secondary transition-colors duration-200 tracking-wide min-w-[100px] justify-center truncate">
                      {item.name}
                      <ChevronDown className="h-3 w-3 flex-shrink-0" />
                    </button>
                    {visitDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                        {item.subItems?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-sans font-medium leading-6 text-primary-foreground hover:text-secondary transition-colors duration-200 tracking-wide min-w-[100px] text-center block truncate"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-[1.2] lg:justify-end lg:items-center lg:gap-3">
            <div className="flex items-center gap-2">
              <Link href="#" className="text-primary-foreground hover:text-secondary transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-primary-foreground hover:text-secondary transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-primary-foreground hover:text-secondary transition-colors">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
            <div className="w-px h-6 bg-primary-foreground/20 mx-1" />
            <LanguageSelector />
            
            {/* Bouton Panier */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-primary-foreground hover:text-secondary"
              onClick={() => setShowCartModal(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Button>
            
            {/* Bouton Connexion/Profil */}
            {user ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-sans bg-transparent text-xs px-2"
                  onClick={() => setShowClientAccount(true)}
                >
                  <User className="mr-1 h-3 w-3" />
                  {user.firstName}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:text-secondary hover:bg-transparent text-xs px-2"
                  onClick={logout}
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-sans bg-transparent text-xs"
                onClick={() => setShowAuthModal(true)}
              >
                CONNEXION
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50"></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2 group min-w-0">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image
                      src="/optimized/logo.webp"
                      alt="Palais El Mokri - Logo"
                      fill
                      className="object-contain transition-transform duration-200 group-hover:scale-105"
                      priority
                      unoptimized
                      sizes="40px"
                    />
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  className="-m-2.5 rounded-md p-2.5 text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-primary-foreground/10">
                  <div className="space-y-1 py-6">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        <Link
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-3 text-lg font-medium leading-7 text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                        {item.hasDropdown && item.subItems && (
                          <div className="ml-6 space-y-1 border-l border-primary-foreground/20 pl-4">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="-mx-3 block rounded-lg px-3 py-2 text-base leading-6 text-primary-foreground/80 hover:bg-primary-foreground/10 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="py-6 space-y-4">
                    <div className="flex justify-center gap-4">
                      <Link href="#" className="text-primary-foreground hover:text-secondary">
                        <Facebook className="h-5 w-5" />
                      </Link>
                      <Link href="#" className="text-primary-foreground hover:text-secondary">
                        <Instagram className="h-5 w-5" />
                      </Link>
                      <Link href="#" className="text-primary-foreground hover:text-secondary">
                        <Youtube className="h-5 w-5" />
                      </Link>
                    </div>
                    <div className="flex justify-center">
                      <LanguageSelector />
                    </div>
                    
                    {/* Mobile Cart Button */}
                    <Button
                      variant="outline"
                      className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                      onClick={() => {
                        setShowCartModal(true)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Panier ({getCartItemCount()})
                    </Button>
                    
                    {/* Mobile Auth Button */}
                    {user ? (
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                          onClick={() => {
                            setShowClientAccount(true)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          {user.firstName} {user.lastName}
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full text-primary-foreground hover:text-secondary"
                          onClick={logout}
                        >
                          Déconnexion
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                        onClick={() => {
                          setShowAuthModal(true)
                          setMobileMenuOpen(false)
                        }}
                      >
                        CONNEXION
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
      />
      
      <CartModal 
        isOpen={showCartModal} 
        onClose={() => setShowCartModal(false)}
      />
      
      {user && (
        <ClientAccount 
          isOpen={showClientAccount} 
          onClose={() => setShowClientAccount(false)}
        />
      )}
    </>
  )
}
