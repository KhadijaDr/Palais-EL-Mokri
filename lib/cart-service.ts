import { supabase } from './supabase';
import { Cart, CartItem } from './types';

export interface SupabaseCart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price: number;
  added_at: string;
}

export class CartService {
  // Obtenir ou créer un panier pour l'utilisateur
  static async getOrCreateCart(userId: string): Promise<Cart | null> {
    try {
      // Chercher un panier existant
      const { data: existingCart, error: fetchError } = await supabase
        .from('carts')
        .select(`
          id,
          user_id,
          created_at,
          updated_at,
          cart_items (
            id,
            product_id,
            quantity,
            price,
            added_at
          )
        `)
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du panier:', fetchError);
        return null;
      }

      if (existingCart) {
        // Convertir le panier Supabase en format Cart
        return this.convertSupabaseCartToCart(existingCart);
      }

      // Créer un nouveau panier si aucun n'existe
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select(`
          id,
          user_id,
          created_at,
          updated_at
        `)
        .single();

      if (createError) {
        console.error('Erreur lors de la création du panier:', createError);
        return null;
      }

      return {
        id: newCart.id,
        userId: newCart.user_id,
        items: [],
        total: 0,
        createdAt: new Date(newCart.created_at),
        updatedAt: new Date(newCart.updated_at),
      };
    } catch (error) {
      console.error('Erreur dans getOrCreateCart:', error);
      return null;
    }
  }

  // Ajouter un article au panier
  static async addItemToCart(cartId: string, productId: string, quantity: number, price: number): Promise<boolean> {
    try {
      // Vérifier si l'article existe déjà
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Erreur lors de la vérification de l\'article:', fetchError);
        return false;
      }

      if (existingItem) {
        // Mettre à jour la quantité
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Erreur lors de la mise à jour de l\'article:', updateError);
          return false;
        }
      } else {
        // Ajouter un nouvel article
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([{
            cart_id: cartId,
            product_id: productId,
            quantity,
            price
          }]);

        if (insertError) {
          console.error('Erreur lors de l\'ajout de l\'article:', insertError);
          return false;
        }
      }

      // Mettre à jour le timestamp du panier
      await this.updateCartTimestamp(cartId);
      return true;
    } catch (error) {
      console.error('Erreur dans addItemToCart:', error);
      return false;
    }
  }

  // Supprimer un article du panier
  static async removeItemFromCart(cartId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId)
        .eq('product_id', productId);

      if (error) {
        console.error('Erreur lors de la suppression de l\'article:', error);
        return false;
      }

      // Mettre à jour le timestamp du panier
      await this.updateCartTimestamp(cartId);
      return true;
    } catch (error) {
      console.error('Erreur dans removeItemFromCart:', error);
      return false;
    }
  }

  // Mettre à jour la quantité d'un article
  static async updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<boolean> {
    try {
      if (quantity <= 0) {
        return await this.removeItemFromCart(cartId, productId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('cart_id', cartId)
        .eq('product_id', productId);

      if (error) {
        console.error('Erreur lors de la mise à jour de la quantité:', error);
        return false;
      }

      // Mettre à jour le timestamp du panier
      await this.updateCartTimestamp(cartId);
      return true;
    } catch (error) {
      console.error('Erreur dans updateItemQuantity:', error);
      return false;
    }
  }

  // Vider le panier
  static async clearCart(cartId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

      if (error) {
        console.error('Erreur lors du vidage du panier:', error);
        return false;
      }

      // Mettre à jour le timestamp du panier
      await this.updateCartTimestamp(cartId);
      return true;
    } catch (error) {
      console.error('Erreur dans clearCart:', error);
      return false;
    }
  }

  // Mettre à jour le timestamp du panier
  private static async updateCartTimestamp(cartId: string): Promise<void> {
    try {
      await supabase
        .from('carts')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', cartId);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du timestamp:', error);
    }
  }

  // Convertir un panier Supabase en format Cart
  private static convertSupabaseCartToCart(supabaseCart: any): Cart {
    const items: CartItem[] = (supabaseCart.cart_items || []).map((item: any) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: parseFloat(item.price),
      addedAt: new Date(item.added_at),
    }));

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      id: supabaseCart.id,
      userId: supabaseCart.user_id,
      items,
      total,
      createdAt: new Date(supabaseCart.created_at),
      updatedAt: new Date(supabaseCart.updated_at),
    };
  }

  // Synchroniser le panier local avec Supabase
  static async syncCartWithSupabase(userId: string, localCart: Cart): Promise<Cart | null> {
    try {
      // Obtenir ou créer un panier dans Supabase
      const supabaseCart = await this.getOrCreateCart(userId);
      if (!supabaseCart) return null;

      // Si le panier local a des articles, les synchroniser
      if (localCart.items.length > 0) {
        // Vider d'abord le panier Supabase
        if (supabaseCart.id) {
          await this.clearCart(supabaseCart.id);
        }

        // Ajouter tous les articles du panier local
        for (const item of localCart.items) {
          if (supabaseCart.id) {
            await this.addItemToCart(supabaseCart.id, item.productId, item.quantity, item.price);
          }
        }

        // Récupérer le panier mis à jour
        return await this.getOrCreateCart(userId);
      }

      return supabaseCart;
    } catch (error) {
      console.error('Erreur dans syncCartWithSupabase:', error);
      return null;
    }
  }
}