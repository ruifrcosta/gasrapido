-- Criação da tabela para reservas de botijas de gás
-- Esta tabela armazena as reservas feitas pelos clientes

-- Adicionar novo tipo enum para tipo de reserva
CREATE TYPE reservation_type AS ENUM (
  'entrega',
  'levantamento'
);

-- Adicionar novo tipo enum para status de pagamento de reserva
CREATE TYPE reservation_payment_status AS ENUM (
  'pending',
  'paid',
  'proof_uploaded',
  'failed',
  'rejected'
);

-- Adicionar novo tipo enum para status de reserva
CREATE TYPE reservation_status AS ENUM (
  'pending_reservation',
  'payment_pending',
  'proof_uploaded',
  'confirmed',
  'cancelled',
  'expired',
  'rejected'
);

-- Tabela de reservas
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  type reservation_type NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pickup_point TEXT,
  delivery_address JSON,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AOA',
  payment_method TEXT,
  payment_status reservation_payment_status DEFAULT 'pending',
  proof_file_path TEXT,
  proof_uploaded_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  status reservation_status DEFAULT 'pending_reservation',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX idx_reservations_supplier_id ON public.reservations(supplier_id);
CREATE INDEX idx_reservations_type ON public.reservations(type);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_reservations_payment_status ON public.reservations(payment_status);
CREATE INDEX idx_reservations_scheduled_time ON public.reservations(scheduled_time);
CREATE INDEX idx_reservations_created_at ON public.reservations(created_at);

-- Trigger para updated_at
CREATE TRIGGER update_reservations_updated_at 
  BEFORE UPDATE ON public.reservations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Criar bucket para comprovativos de reserva
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reservation-proofs',
  'reservation-proofs',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
);

-- Criar políticas RLS para o bucket de comprovativos de reserva
-- Clientes podem inserir seus próprios comprovativos
CREATE POLICY "Usuários podem inserir seus próprios comprovativos de reserva" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'reservation-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Clientes podem selecionar seus próprios comprovativos
CREATE POLICY "Usuários podem selecionar seus próprios comprovativos de reserva" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'reservation-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Financeiros e admins podem selecionar todos os comprovativos
CREATE POLICY "Financeiros e admins podem selecionar todos os comprovativos de reserva" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'reservation-proofs' 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'finance')
    )
  );

-- Criar políticas RLS para a tabela de reservas
-- Clientes podem inserir suas próprias reservas
CREATE POLICY "Usuários podem inserir suas próprias reservas" ON public.reservations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Clientes podem selecionar suas próprias reservas
CREATE POLICY "Usuários podem selecionar suas próprias reservas" ON public.reservations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Clientes podem atualizar suas próprias reservas (apenas em status específico)
CREATE POLICY "Usuários podem atualizar suas próprias reservas" ON public.reservations
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status IN ('pending_reservation'))
  WITH CHECK (user_id = auth.uid() AND status IN ('pending_reservation', 'cancelled'));

-- Financeiros e admins podem selecionar todas as reservas
CREATE POLICY "Financeiros e admins podem selecionar todas as reservas" ON public.reservations
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'finance')
  ));

-- Financeiros e admins podem atualizar reservas (para verificação)
CREATE POLICY "Financeiros e admins podem atualizar reservas" ON public.reservations
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'finance')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'finance')
  ));

-- Fornecedores podem selecionar reservas associadas a eles
CREATE POLICY "Fornecedores podem selecionar reservas associadas" ON public.reservations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'vendor'
    ) AND supplier_id = auth.uid()
  );

-- Habilitar RLS na tabela de reservas
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;