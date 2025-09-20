-- Enhanced Marketplace Schema
-- This migration enhances the existing product/marketplace structure to support
-- the comprehensive marketplace specification

-- First, let's enhance the existing products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS botija_type TEXT CHECK (botija_type IN ('6kg', '12kg', '45kg', 'outros')),
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS certification_photos JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'out_of_stock', 'pending_verification')),
ADD COLUMN IF NOT EXISTS certification_expiry DATE,
ADD COLUMN IF NOT EXISTS safety_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS supplier_rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Create marketplace listings table
CREATE TABLE IF NOT EXISTS marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('normal', 'reserva', 'entrega', 'levantamento')),
    reserved BOOLEAN DEFAULT false,
    reserved_until TIMESTAMP WITH TIME ZONE,
    reserved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    delivery_radius_km INTEGER DEFAULT 10,
    pickup_available BOOLEAN DEFAULT false,
    pickup_address TEXT,
    estimated_delivery_time INTEGER, -- in minutes
    priority_listing BOOLEAN DEFAULT false, -- for premium suppliers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    product_quality_rating INTEGER CHECK (product_quality_rating >= 1 AND product_quality_rating <= 5),
    verified_purchase BOOLEAN DEFAULT true,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace commission settings table
CREATE TABLE IF NOT EXISTS marketplace_commission_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.15, -- 15% default
    delivery_commission DECIMAL(5,4) NOT NULL DEFAULT 0.10, -- 10% delivery commission
    premium_tier TEXT DEFAULT 'standard' CHECK (premium_tier IN ('standard', 'premium', 'gold')),
    reduced_commission_rate DECIMAL(5,4), -- for premium tiers
    effective_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effective_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(supplier_id, effective_from)
);

-- Create dynamic pricing factors table
CREATE TABLE IF NOT EXISTS pricing_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factor_name TEXT NOT NULL UNIQUE,
    factor_type TEXT NOT NULL CHECK (factor_type IN ('weather', 'traffic', 'demand', 'supply', 'time_of_day', 'distance')),
    multiplier DECIMAL(4,3) NOT NULL DEFAULT 1.000,
    is_active BOOLEAN DEFAULT true,
    conditions JSONB, -- stores conditions when this factor applies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order pricing breakdown table
CREATE TABLE IF NOT EXISTS order_pricing_breakdown (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    base_product_price DECIMAL(10,2) NOT NULL,
    base_delivery_fee DECIMAL(10,2) NOT NULL,
    applied_factors JSONB DEFAULT '[]'::jsonb, -- array of applied pricing factors
    total_multiplier DECIMAL(4,3) DEFAULT 1.000,
    platform_commission DECIMAL(10,2) NOT NULL,
    supplier_earning DECIMAL(10,2) NOT NULL,
    delivery_earning DECIMAL(10,2),
    final_customer_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace metrics table
CREATE TABLE IF NOT EXISTS marketplace_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    total_listings INTEGER DEFAULT 0,
    active_listings INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    cancelled_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    platform_commission_earned DECIMAL(12,2) DEFAULT 0,
    average_delivery_time INTEGER, -- in minutes
    average_order_value DECIMAL(10,2) DEFAULT 0,
    supplier_count INTEGER DEFAULT 0,
    customer_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (metric_date)
);

-- Create supplier performance metrics table
CREATE TABLE IF NOT EXISTS supplier_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    metric_period DATE NOT NULL, -- monthly metrics
    total_orders INTEGER DEFAULT 0,
    completed_orders INTEGER DEFAULT 0,
    cancelled_orders INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    response_time_avg INTEGER, -- average response time in minutes
    stock_availability_rate DECIMAL(5,4) DEFAULT 1.0000, -- percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (supplier_id, metric_period)
);

-- Create marketplace fraud detection table
CREATE TABLE IF NOT EXISTS marketplace_fraud_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN ('suspicious_order', 'fake_review', 'price_manipulation', 'stock_manipulation')),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('supplier', 'customer', 'order', 'review')),
    entity_id UUID NOT NULL,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    details JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigated', 'resolved', 'dismissed')),
    investigated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Insert default pricing factors
INSERT INTO pricing_factors (factor_name, factor_type, multiplier, conditions) VALUES
('peak_hours', 'time_of_day', 1.2, '{"hours": [7, 8, 17, 18, 19]}'),
('rainy_weather', 'weather', 1.15, '{"weather_conditions": ["rain", "storm"]}'),
('high_traffic', 'traffic', 1.1, '{"traffic_level": "high"}'),
('low_stock', 'supply', 1.25, '{"stock_threshold": 5}'),
('high_demand', 'demand', 1.2, '{"demand_ratio": "> 0.8"}'),
('long_distance', 'distance', 1.1, '{"distance_km": "> 15"}')
ON CONFLICT (factor_name) DO NOTHING;

-- Insert default commission settings
INSERT INTO marketplace_commission_settings (supplier_id, commission_rate, delivery_commission, premium_tier)
SELECT v.id, 0.15, 0.10, 'standard'
FROM vendors v
WHERE NOT EXISTS (
    SELECT 1 FROM marketplace_commission_settings mcs 
    WHERE mcs.supplier_id = v.id
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_supplier ON marketplace_listings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_product ON marketplace_listings(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_reserved ON marketplace_listings(reserved, reserved_until);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_supplier ON product_reviews(supplier_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_customer ON product_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_pricing_factors_active ON pricing_factors(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_factors_type ON pricing_factors(factor_type);

CREATE INDEX IF NOT EXISTS idx_marketplace_metrics_date ON marketplace_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_supplier_performance_supplier ON supplier_performance(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_performance_period ON supplier_performance(metric_period);

CREATE INDEX IF NOT EXISTS idx_fraud_logs_status ON marketplace_fraud_logs(status);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_entity ON marketplace_fraud_logs(entity_type, entity_id);

-- Create RLS policies
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_commission_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_pricing_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_fraud_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_listings
CREATE POLICY "Public can view active listings" ON marketplace_listings
    FOR SELECT USING (status = 'active');

CREATE POLICY "Suppliers can manage their listings" ON marketplace_listings
    FOR ALL USING (auth.jwt() ->> 'role' = 'vendor' AND supplier_id::text = auth.jwt() ->> 'vendor_id');

CREATE POLICY "Admins can manage all listings" ON marketplace_listings
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for product_reviews
CREATE POLICY "Public can view reviews" ON product_reviews
    FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their orders" ON product_reviews
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'client' 
        AND customer_id::text = auth.jwt() ->> 'user_id'
        AND EXISTS (
            SELECT 1 FROM orders o 
            WHERE o.id = order_id 
            AND o.customer_id::text = auth.jwt() ->> 'user_id'
            AND o.status = 'delivered'
        )
    );

-- RLS Policies for commission settings
CREATE POLICY "Suppliers can view their commission settings" ON marketplace_commission_settings
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'vendor' 
        AND supplier_id::text = auth.jwt() ->> 'vendor_id'
    );

CREATE POLICY "Admins and finance can manage commission settings" ON marketplace_commission_settings
    FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'finance'));

-- RLS Policies for pricing factors
CREATE POLICY "Public can view active pricing factors" ON pricing_factors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage pricing factors" ON pricing_factors
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for order pricing breakdown
CREATE POLICY "Users can view their order pricing breakdown" ON order_pricing_breakdown
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders o 
            WHERE o.id = order_id 
            AND (
                o.customer_id::text = auth.jwt() ->> 'user_id'
                OR o.vendor_id::text = auth.jwt() ->> 'vendor_id'
                OR auth.jwt() ->> 'role' IN ('admin', 'finance')
            )
        )
    );

-- RLS Policies for marketplace metrics
CREATE POLICY "Admins and finance can view marketplace metrics" ON marketplace_metrics
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'finance'));

-- RLS Policies for supplier performance
CREATE POLICY "Suppliers can view their performance" ON supplier_performance
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'vendor' 
        AND supplier_id::text = auth.jwt() ->> 'vendor_id'
    );

CREATE POLICY "Admins and finance can view all supplier performance" ON supplier_performance
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'finance'));

-- RLS Policies for fraud logs
CREATE POLICY "Admins can manage fraud logs" ON marketplace_fraud_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_supplier_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update supplier rating and review count
    UPDATE vendors v
    SET rating = (
        SELECT AVG(pr.rating)::decimal(3,2)
        FROM product_reviews pr
        WHERE pr.supplier_id = NEW.supplier_id
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM product_reviews pr
        WHERE pr.supplier_id = NEW.supplier_id
    )
    WHERE v.id = NEW.supplier_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating supplier ratings
DROP TRIGGER IF EXISTS trigger_update_supplier_rating ON product_reviews;
CREATE TRIGGER trigger_update_supplier_rating
    AFTER INSERT OR UPDATE OR DELETE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_supplier_rating();

-- Function to update listing timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_marketplace_listings_updated_at
    BEFORE UPDATE ON marketplace_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_factors_updated_at
    BEFORE UPDATE ON pricing_factors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();