-- Dados de teste para desenvolvimento do GasRápido

-- Inserir profiles de teste
INSERT INTO public.profiles (id, email, full_name, phone, role, address, location) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@gasrapido.com', 'Admin GasRápido', '+244 900 000 000', 'admin', 'Luanda, Angola', ST_GeogFromText('POINT(13.2317 -8.8383)')),
  ('22222222-2222-2222-2222-222222222222', 'fornecedor1@gasrapido.com', 'Posto Central Ltda', '+244 912 111 111', 'vendor', 'Rua da Missão, Luanda', ST_GeogFromText('POINT(13.2345 -8.8400)')),
  ('33333333-3333-3333-3333-333333333333', 'entregador1@gasrapido.com', 'João Entregador', '+244 923 222 222', 'courier', 'Bairro Operário, Luanda', ST_GeogFromText('POINT(13.2300 -8.8350)')),
  ('44444444-4444-4444-4444-444444444444', 'cliente1@gasrapido.com', 'Maria Cliente', '+244 934 333 333', 'client', 'Bairro Azul, Luanda', ST_GeogFromText('POINT(13.2280 -8.8420)'));

-- Inserir fornecedores
INSERT INTO public.vendors (id, user_id, business_name, license_number, address, location, operating_hours, is_verified, is_active, rating) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Posto Central', 'LIC-001', 'Rua da Missão, Luanda', ST_GeogFromText('POINT(13.2345 -8.8400)'), '{"monday": "07:00-19:00", "tuesday": "07:00-19:00", "wednesday": "07:00-19:00", "thursday": "07:00-19:00", "friday": "07:00-19:00", "saturday": "08:00-18:00", "sunday": "08:00-16:00"}', true, true, 4.8);

-- Inserir mais fornecedores de teste
INSERT INTO public.profiles (id, email, full_name, phone, role, address, location) VALUES
  ('55555555-5555-5555-5555-555555555555', 'fornecedor2@gasrapido.com', 'Gás Express Ltda', '+244 912 222 222', 'vendor', 'Rua Direita, Luanda', ST_GeogFromText('POINT(13.2380 -8.8350)')),
  ('66666666-6666-6666-6666-666666666666', 'fornecedor3@gasrapido.com', 'Botija Rápida', '+244 912 333 333', 'vendor', 'Bairro Popular, Luanda', ST_GeogFromText('POINT(13.2250 -8.8450)'));

INSERT INTO public.vendors (id, user_id, business_name, license_number, address, location, operating_hours, is_verified, is_active, rating) VALUES
  ('bbbb2222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Gás Express', 'LIC-002', 'Rua Direita, Luanda', ST_GeogFromText('POINT(13.2380 -8.8350)'), '{"monday": "06:00-20:00", "tuesday": "06:00-20:00", "wednesday": "06:00-20:00", "thursday": "06:00-20:00", "friday": "06:00-20:00", "saturday": "07:00-19:00", "sunday": "08:00-17:00"}', true, true, 4.5),
  ('cccc3333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'Botija Rápida', 'LIC-003', 'Bairro Popular, Luanda', ST_GeogFromText('POINT(13.2250 -8.8450)'), '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "09:00-17:00", "sunday": "closed"}', true, true, 4.7);

-- Inserir entregadores
INSERT INTO public.profiles (id, email, full_name, phone, role, address, location) VALUES
  ('77777777-7777-7777-7777-777777777777', 'entregador2@gasrapido.com', 'Carlos Motoqueiro', '+244 923 444 444', 'courier', 'Bairro Operário, Luanda', ST_GeogFromText('POINT(13.2320 -8.8370)')),
  ('88888888-8888-8888-8888-888888888888', 'entregador3@gasrapido.com', 'Pedro Delivery', '+244 923 555 555', 'courier', 'Zona 5, Luanda', ST_GeogFromText('POINT(13.2290 -8.8390)'));

INSERT INTO public.couriers (id, user_id, vehicle_type, license_plate, is_verified, is_available, current_location, rating) VALUES
  ('dddd1111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'motorcycle', 'LD-001-AA', true, true, ST_GeogFromText('POINT(13.2300 -8.8350)'), 4.9),
  ('eeee2222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777777', 'motorcycle', 'LD-002-BB', true, true, ST_GeogFromText('POINT(13.2320 -8.8370)'), 4.6),
  ('ffff3333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', 'motorcycle', 'LD-003-CC', true, false, ST_GeogFromText('POINT(13.2290 -8.8390)'), 4.8);

-- Inserir produtos
INSERT INTO public.products (id, vendor_id, name, description, weight_kg, price_aoa, stock_quantity, is_available, image_url) VALUES
  ('pppp1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Botija de Gás 13kg', 'Botija de gás doméstico de 13kg', 13.00, 8500.00, 50, true, 'https://via.placeholder.com/300x200/1F3A93/FFFFFF?text=13KG'),
  ('pppp2222-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', 'Botija de Gás 6kg', 'Botija de gás doméstico de 6kg', 6.00, 4500.00, 30, true, 'https://via.placeholder.com/300x200/1F3A93/FFFFFF?text=6KG'),
  ('pppp3333-3333-3333-3333-333333333333', 'bbbb2222-2222-2222-2222-222222222222', 'Botija de Gás 13kg', 'Botija de gás doméstico de 13kg', 13.00, 8200.00, 40, true, 'https://via.placeholder.com/300x200/1F3A93/FFFFFF?text=13KG'),
  ('pppp4444-4444-4444-4444-444444444444', 'cccc3333-3333-3333-3333-333333333333', 'Botija de Gás 13kg', 'Botija de gás doméstico de 13kg', 13.00, 8800.00, 25, true, 'https://via.placeholder.com/300x200/1F3A93/FFFFFF?text=13KG'),
  ('pppp5555-5555-5555-5555-555555555555', 'cccc3333-3333-3333-3333-333333333333', 'Botija de Gás 6kg', 'Botija de gás doméstico de 6kg', 6.00, 4800.00, 20, true, 'https://via.placeholder.com/300x200/1F3A93/FFFFFF?text=6KG');

-- Inserir alguns pedidos de exemplo
INSERT INTO public.orders (id, order_number, customer_id, vendor_id, courier_id, product_id, quantity, unit_price, total_amount, delivery_fee, final_amount, status, delivery_address, delivery_location, pickup_address, pickup_location, estimated_delivery) VALUES
  ('oooo1111-1111-1111-1111-111111111111', '202509120001', '44444444-4444-4444-4444-444444444444', 'aaaa1111-1111-1111-1111-111111111111', 'dddd1111-1111-1111-1111-111111111111', 'pppp1111-1111-1111-1111-111111111111', 1, 8500.00, 8500.00, 500.00, 9000.00, 'delivered', 'Bairro Azul, Luanda', ST_GeogFromText('POINT(13.2280 -8.8420)'), 'Rua da Missão, Luanda', ST_GeogFromText('POINT(13.2345 -8.8400)'), NOW() + INTERVAL '1 hour'),
  ('oooo2222-2222-2222-2222-222222222222', '202509120002', '44444444-4444-4444-4444-444444444444', 'bbbb2222-2222-2222-2222-222222222222', 'eeee2222-2222-2222-2222-222222222222', 'pppp3333-3333-3333-3333-333333333333', 1, 8200.00, 8200.00, 600.00, 8800.00, 'in_transit', 'Bairro Azul, Luanda', ST_GeogFromText('POINT(13.2280 -8.8420)'), 'Rua Direita, Luanda', ST_GeogFromText('POINT(13.2380 -8.8350)'), NOW() + INTERVAL '45 minutes');

-- Inserir pagamentos
INSERT INTO public.payments (id, order_id, amount, method, status, transaction_id, processed_at) VALUES
  ('pay11111-1111-1111-1111-111111111111', 'oooo1111-1111-1111-1111-111111111111', 9000.00, 'multicaixa', 'completed', 'MCX_1694521234567', NOW() - INTERVAL '2 hours'),
  ('pay22222-2222-2222-2222-222222222222', 'oooo2222-2222-2222-2222-222222222222', 8800.00, 'cash', 'completed', 'CASH_1694525678901', NOW() - INTERVAL '30 minutes');

-- Inserir algumas avaliações
INSERT INTO public.reviews (id, order_id, reviewer_id, vendor_id, courier_id, rating, comment) VALUES
  ('rev11111-1111-1111-1111-111111111111', 'oooo1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'aaaa1111-1111-1111-1111-111111111111', 'dddd1111-1111-1111-1111-111111111111', 5, 'Excelente serviço! Entrega rápida e gás de qualidade.'),
  ('rev22222-2222-2222-2222-222222222222', 'oooo1111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'aaaa1111-1111-1111-1111-111111111111', null, 5, 'Posto muito confiável, recomendo!');

-- Inserir notificações de exemplo
INSERT INTO public.notifications (id, user_id, title, message, type, data, is_read) VALUES
  ('not11111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Pedido Entregue', 'Seu pedido #202509120001 foi entregue com sucesso!', 'order_update', '{"order_id": "oooo1111-1111-1111-1111-111111111111", "status": "delivered"}', true),
  ('not22222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Pedido em Trânsito', 'Seu pedido #202509120002 saiu para entrega!', 'order_update', '{"order_id": "oooo2222-2222-2222-2222-222222222222", "status": "in_transit"}', false);

-- Atualizar contadores
UPDATE public.vendors SET total_orders = 1 WHERE id = 'aaaa1111-1111-1111-1111-111111111111';
UPDATE public.vendors SET total_orders = 1 WHERE id = 'bbbb2222-2222-2222-2222-222222222222';
UPDATE public.couriers SET total_deliveries = 1 WHERE id = 'dddd1111-1111-1111-1111-111111111111';
UPDATE public.couriers SET total_deliveries = 1 WHERE id = 'eeee2222-2222-2222-2222-222222222222';