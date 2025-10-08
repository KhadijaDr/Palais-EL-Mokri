'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product, User } from '@/lib/types';
import { useAuth } from './auth-context';
import { CartService } from '@/lib/cart-service';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  checkout: (user: User) => Promise<boolean>;
}

type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CALCULATE_TOTAL' };

const initialCart: Cart = {
  items: [],
  total: 0,
};

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.product.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.productId === action.payload.product.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...state, items: updatedItems, total };
      } else {
        const newItem: CartItem = {
          productId: action.payload.product.id,
          quantity: action.payload.quantity,
          price: action.payload.product.price,
          addedAt: new Date(),
        };
        const updatedItems = [...state.items, newItem];
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...state, items: updatedItems, total };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.productId !== action.payload);
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...state, items: updatedItems, total };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const updatedItems = state.items.filter(item => item.productId !== action.payload.productId);
        const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...state, items: updatedItems, total };
      }
      
      const updatedItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...state, items: updatedItems, total };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 };
    
    case 'CALCULATE_TOTAL': {
      const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { ...state, total };
    }
    
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const { user } = useAuth();

  // Charger le panier depuis Supabase ou localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (user?.id) {
        // Utilisateur connecté : charger depuis Supabase
        try {
          const supabaseCart = await CartService.getOrCreateCart(user.id);
          if (supabaseCart) {
            dispatch({ type: 'SET_CART', payload: supabaseCart });
          }
        } catch (error) {
          console.error('Erreur lors du chargement du panier depuis Supabase:', error);
          // Fallback vers localStorage en cas d'erreur
          loadFromLocalStorage();
        }
      } else {
        // Utilisateur anonyme : charger depuis localStorage
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const savedCart = localStorage.getItem('cart_anonymous');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: parsedCart });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du panier depuis localStorage:', error);
      }
    };

    loadCart();
  }, [user]);

  // Synchroniser le panier local avec Supabase lors de la connexion
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (user?.id && cart.items.length > 0 && !cart.id) {
        // L'utilisateur vient de se connecter et a un panier local
        try {
          const syncedCart = await CartService.syncCartWithSupabase(user.id, cart);
          if (syncedCart) {
            dispatch({ type: 'SET_CART', payload: syncedCart });
            // Nettoyer le localStorage
            localStorage.removeItem('cart_anonymous');
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation du panier:', error);
        }
      }
    };

    syncCartOnLogin();
  }, [user, cart]);

  // Sauvegarder le panier
  const saveCart = async (updatedCart: Cart) => {
    if (user?.id && updatedCart.id) {
      // Utilisateur connecté : sauvegarder dans Supabase
      // La sauvegarde est déjà gérée par CartService
    } else {
      // Utilisateur anonyme : sauvegarder dans localStorage
      try {
        localStorage.setItem('cart_anonymous', JSON.stringify(updatedCart));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde dans localStorage:', error);
      }
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (user?.id) {
      // Utilisateur connecté : utiliser Supabase
      const userCart = await CartService.getOrCreateCart(user.id);
      if (userCart?.id) {
        const success = await CartService.addItemToCart(userCart.id, product.id, quantity, product.price);
        if (success) {
          const updatedCart = await CartService.getOrCreateCart(user.id);
          if (updatedCart) {
            dispatch({ type: 'SET_CART', payload: updatedCart });
          }
        }
      }
    } else {
      // Utilisateur anonyme : utiliser le reducer local
      dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
      // Sauvegarder après la mise à jour
      setTimeout(() => saveCart(cart), 0);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user?.id) {
      // Utilisateur connecté : utiliser Supabase
      const userCart = await CartService.getOrCreateCart(user.id);
      if (userCart?.id) {
        const success = await CartService.removeItemFromCart(userCart.id, productId);
        if (success) {
          const updatedCart = await CartService.getOrCreateCart(user.id);
          if (updatedCart) {
            dispatch({ type: 'SET_CART', payload: updatedCart });
          }
        }
      }
    } else {
      // Utilisateur anonyme : utiliser le reducer local
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      // Sauvegarder après la mise à jour
      setTimeout(() => saveCart(cart), 0);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (user?.id) {
      // Utilisateur connecté : utiliser Supabase
      const userCart = await CartService.getOrCreateCart(user.id);
      if (userCart?.id) {
        const success = await CartService.updateItemQuantity(userCart.id, productId, quantity);
        if (success) {
          const updatedCart = await CartService.getOrCreateCart(user.id);
          if (updatedCart) {
            dispatch({ type: 'SET_CART', payload: updatedCart });
          }
        }
      }
    } else {
      // Utilisateur anonyme : utiliser le reducer local
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
      // Sauvegarder après la mise à jour
      setTimeout(() => saveCart(cart), 0);
    }
  };

  const clearCart = async () => {
    if (user?.id) {
      // Utilisateur connecté : utiliser Supabase
      const userCart = await CartService.getOrCreateCart(user.id);
      if (userCart?.id) {
        const success = await CartService.clearCart(userCart.id);
        if (success) {
          dispatch({ type: 'CLEAR_CART' });
        }
      }
    } else {
      // Utilisateur anonyme : utiliser le reducer local
      dispatch({ type: 'CLEAR_CART' });
      // Sauvegarder après la mise à jour
      setTimeout(() => saveCart(cart), 0);
    }
  };

  const getCartTotal = () => {
    return cart.total;
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const checkout = async (user: User): Promise<boolean> => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          user,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du checkout');
      }

      const result = await response.json();

      if (result.success) {
        // Créer l'objet commande
        const order = {
          id: result.orderId || `order_${Date.now()}`,
          userId: user.id,
          items: cart.items,
          total: cart.total,
          status: 'pending',
          createdAt: new Date(),
          shippingAddress: user.address,
        };

        // Vider le panier après une commande réussie
        await clearCart();

        return true;
      } else {
        console.error('Erreur lors du checkout:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors du checkout:', error);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
