-- Funções auxiliares e triggers para GasRápido

-- Função para gerar número único de pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Gerar número baseado na data + sequencial
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.orders
    WHERE order_number LIKE TO_CHAR(NOW(), 'YYYYMMDD') || '%';
    
    new_number := TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(counter::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do pedido automaticamente
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Função para calcular distância entre dois pontos
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
    RETURN ST_Distance(
        ST_GeogFromText('POINT(' || lon1 || ' ' || lat1 || ')'),
        ST_GeogFromText('POINT(' || lon2 || ' ' || lat2 || ')')
    ) / 1000; -- Retorna em quilômetros
END;
$$ LANGUAGE plpgsql;

-- Função para calcular taxa de entrega baseada na distância
CREATE OR REPLACE FUNCTION calculate_delivery_fee(
    pickup_lat DECIMAL,
    pickup_lon DECIMAL,
    delivery_lat DECIMAL,
    delivery_lon DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
    distance DECIMAL;
    base_fee DECIMAL := 500.00; -- Taxa base em AOA
    per_km_fee DECIMAL := 100.00; -- Taxa por km em AOA
BEGIN
    distance := calculate_distance(pickup_lat, pickup_lon, delivery_lat, delivery_lon);
    
    -- Taxa mínima para distâncias menores que 2km
    IF distance < 2 THEN
        RETURN base_fee;
    END IF;
    
    -- Taxa base + taxa por km para distâncias maiores
    RETURN base_fee + (distance * per_km_fee);
END;
$$ LANGUAGE plpgsql;

-- Função para encontrar entregadores próximos
CREATE OR REPLACE FUNCTION find_nearby_couriers(
    pickup_lat DECIMAL,
    pickup_lon DECIMAL,
    radius_km DECIMAL DEFAULT 10
)
RETURNS TABLE(
    courier_id UUID,
    user_id UUID,
    distance_km DECIMAL,
    rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.user_id,
        ST_Distance(
            c.current_location,
            ST_GeogFromText('POINT(' || pickup_lon || ' ' || pickup_lat || ')')
        ) / 1000 AS distance_km,
        c.rating
    FROM public.couriers c
    WHERE 
        c.is_available = true 
        AND c.is_verified = true
        AND ST_DWithin(
            c.current_location,
            ST_GeogFromText('POINT(' || pickup_lon || ' ' || pickup_lat || ')'),
            radius_km * 1000
        )
    ORDER BY distance_km, c.rating DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar rating de fornecedor
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL;
    total_reviews INTEGER;
BEGIN
    -- Calcular nova média de rating
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(*)
    INTO avg_rating, total_reviews
    FROM public.reviews 
    WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id);
    
    -- Atualizar tabela de vendors
    UPDATE public.vendors 
    SET rating = avg_rating
    WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendor_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW 
    WHEN (NEW.vendor_id IS NOT NULL OR OLD.vendor_id IS NOT NULL)
    EXECUTE FUNCTION update_vendor_rating();

-- Função para atualizar rating de entregador
CREATE OR REPLACE FUNCTION update_courier_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL;
BEGIN
    -- Calcular nova média de rating
    SELECT COALESCE(AVG(rating), 0)
    INTO avg_rating
    FROM public.reviews 
    WHERE courier_id = COALESCE(NEW.courier_id, OLD.courier_id);
    
    -- Atualizar tabela de couriers
    UPDATE public.couriers 
    SET rating = avg_rating
    WHERE id = COALESCE(NEW.courier_id, OLD.courier_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courier_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW 
    WHEN (NEW.courier_id IS NOT NULL OR OLD.courier_id IS NOT NULL)
    EXECUTE FUNCTION update_courier_rating();

-- Função para criar notificação
CREATE OR REPLACE FUNCTION create_notification(
    user_id UUID,
    title TEXT,
    message TEXT,
    notification_type TEXT DEFAULT 'general',
    data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, data)
    VALUES (user_id, title, message, notification_type, data)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para notificar mudanças de status de pedido
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Notificar cliente sobre mudança de status
    IF NEW.status != OLD.status THEN
        PERFORM create_notification(
            NEW.customer_id,
            'Atualização do Pedido #' || NEW.order_number,
            'Seu pedido foi ' || 
            CASE NEW.status
                WHEN 'confirmed' THEN 'confirmado'
                WHEN 'preparing' THEN 'está sendo preparado'
                WHEN 'in_transit' THEN 'saiu para entrega'
                WHEN 'delivered' THEN 'entregue'
                WHEN 'cancelled' THEN 'cancelado'
                ELSE 'atualizado'
            END,
            'order_update',
            jsonb_build_object('order_id', NEW.id, 'status', NEW.status)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_order_status_change_trigger
    AFTER UPDATE ON public.orders
    FOR EACH ROW 
    EXECUTE FUNCTION notify_order_status_change();