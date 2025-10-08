-- Migration: Create cart and orders tables
-- Description: Tables pour la gestion du panier persistant et l'historique des commandes

-- Table pour les paniers des utilisateurs
CREATE TABLE IF NOT EXISTS carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les articles du panier
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les commandes
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    notes TEXT,
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les articles des commandes
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les adresses des commandes
CREATE TABLE IF NOT EXISTS order_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('shipping', 'billing')),
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les demandes de réservation/booking
CREATE TABLE IF NOT EXISTS booking_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('reservation', 'event', 'visit', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    preferred_date DATE,
    preferred_time TIME,
    number_of_guests INTEGER,
    contact_phone TEXT,
    contact_email TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'completed')),
    admin_response TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_addresses_order_id ON order_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_user_id ON booking_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created_at ON booking_requests(created_at);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_booking_requests_updated_at BEFORE UPDATE ON booking_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les paniers
CREATE POLICY "Users can view their own carts" ON carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own carts" ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own carts" ON carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own carts" ON carts FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour les articles du panier
CREATE POLICY "Users can view their own cart items" ON cart_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own cart items" ON cart_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);
CREATE POLICY "Users can update their own cart items" ON cart_items FOR UPDATE USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);
CREATE POLICY "Users can delete their own cart items" ON cart_items FOR DELETE USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid())
);

-- Politiques RLS pour les commandes
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Politiques RLS pour les articles des commandes
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own order items" ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Politiques RLS pour les adresses des commandes
CREATE POLICY "Users can view their own order addresses" ON order_addresses FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_addresses.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own order addresses" ON order_addresses FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_addresses.order_id AND orders.user_id = auth.uid())
);

-- Politiques RLS pour les demandes de réservation
CREATE POLICY "Users can view their own booking requests" ON booking_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own booking requests" ON booking_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own booking requests" ON booking_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own booking requests" ON booking_requests FOR DELETE USING (auth.uid() = user_id);

-- Commentaires pour la documentation
COMMENT ON TABLE carts IS 'Paniers des utilisateurs pour la persistance des articles';
COMMENT ON TABLE cart_items IS 'Articles contenus dans les paniers des utilisateurs';
COMMENT ON TABLE orders IS 'Commandes passées par les utilisateurs';
COMMENT ON TABLE order_items IS 'Articles contenus dans les commandes';
COMMENT ON TABLE order_addresses IS 'Adresses de livraison et facturation des commandes';
COMMENT ON TABLE booking_requests IS 'Demandes de réservation et événements des utilisateurs';