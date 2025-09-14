-- Row Level Security (RLS) Policies para GasRápido

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Função helper para verificar role do usuário
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Função helper para verificar se usuário é owner
CREATE OR REPLACE FUNCTION public.is_profile_owner(profile_id UUID)
RETURNS BOOLEAN AS $$
  SELECT auth.uid() = profile_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Políticas para Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Public profiles for vendors/couriers" ON public.profiles
  FOR SELECT USING (role IN ('vendor', 'courier') AND is_active = true);

-- Políticas para Vendors
CREATE POLICY "Vendors can manage own data" ON public.vendors
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Public can view active vendors" ON public.vendors
  FOR SELECT USING (is_active = true AND is_verified = true);

CREATE POLICY "Admins can manage all vendors" ON public.vendors
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas para Couriers
CREATE POLICY "Couriers can manage own data" ON public.couriers
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Vendors can view available couriers" ON public.couriers
  FOR SELECT USING (
    is_available = true AND is_verified = true AND 
    public.get_user_role(auth.uid()) IN ('vendor', 'admin')
  );

CREATE POLICY "Admins can manage all couriers" ON public.couriers
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas para Products
CREATE POLICY "Vendors can manage own products" ON public.products
  FOR ALL USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Public can view available products" ON public.products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas para Orders
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create orders" ON public.orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Vendors can view orders for their products" ON public.orders
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Vendors can update orders for their products" ON public.orders
  FOR UPDATE USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
  );

CREATE POLICY "Couriers can view assigned orders" ON public.orders
  FOR SELECT USING (
    courier_id IN (SELECT id FROM public.couriers WHERE user_id = auth.uid())
  );

CREATE POLICY "Couriers can update assigned orders" ON public.orders
  FOR UPDATE USING (
    courier_id IN (SELECT id FROM public.couriers WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas para Payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid())
  );

CREATE POLICY "Vendors can view payments for their orders" ON public.payments
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM public.orders o
      INNER JOIN public.vendors v ON o.vendor_id = v.id
      WHERE v.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Políticas para Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Políticas para Reviews
CREATE POLICY "Users can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for own orders" ON public.reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid())
  );

CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');