-- Criação da tabela para comprovativos de pagamento
-- Esta tabela armazena os comprovativos de pagamento carregados pelos clientes

-- Adicionar novo tipo enum para métodos de pagamento com comprovativo
CREATE TYPE payment_method_with_proof AS ENUM (
  'multicaixa_express',
  'kwik',
  'unitel_money',
  'paypay',
  'bank_transfer'
);

-- Adicionar novo tipo enum para status de comprovativo
CREATE TYPE payment_proof_status AS ENUM (
  'pending_proof',
  'pending_verification',
  'approved',
  'rejected',
  'proof_failure'
);

-- Tabela de comprovativos de pagamento
CREATE TABLE IF NOT EXISTS public.payment_proofs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method payment_method_with_proof NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AOA',
  status payment_proof_status DEFAULT 'pending_verification',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  file_path TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_payment_proofs_user_id ON public.payment_proofs(user_id);
CREATE INDEX idx_payment_proofs_order_id ON public.payment_proofs(order_id);
CREATE INDEX idx_payment_proofs_status ON public.payment_proofs(status);
CREATE INDEX idx_payment_proofs_payment_method ON public.payment_proofs(payment_method);
CREATE INDEX idx_payment_proofs_created_at ON public.payment_proofs(created_at);

-- Trigger para updated_at
CREATE TRIGGER update_payment_proofs_updated_at 
  BEFORE UPDATE ON public.payment_proofs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Criar bucket para comprovativos de pagamento
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
);

-- Criar políticas RLS para o bucket de comprovativos de pagamento
-- Clientes podem inserir seus próprios comprovativos
CREATE POLICY "Usuários podem inserir seus próprios comprovativos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Clientes podem selecionar seus próprios comprovativos
CREATE POLICY "Usuários podem selecionar seus próprios comprovativos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'payment-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Financeiros e admins podem selecionar todos os comprovativos
CREATE POLICY "Financeiros e admins podem selecionar todos os comprovativos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-proofs' 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'finance')
    )
  );

-- Criar políticas RLS para a tabela de comprovativos de pagamento
-- Clientes podem inserir seus próprios comprovativos
CREATE POLICY "Usuários podem inserir seus próprios comprovativos" ON public.payment_proofs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Clientes podem selecionar seus próprios comprovativos
CREATE POLICY "Usuários podem selecionar seus próprios comprovativos" ON public.payment_proofs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Clientes podem atualizar seus próprios comprovativos (apenas em status específico)
CREATE POLICY "Usuários podem atualizar seus próprios comprovativos" ON public.payment_proofs
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status IN ('rejected', 'pending_proof'))
  WITH CHECK (user_id = auth.uid() AND status IN ('pending_verification'));

-- Financeiros e admins podem selecionar todos os comprovativos
CREATE POLICY "Financeiros e admins podem selecionar todos os comprovativos" ON public.payment_proofs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'finance')
  ));

-- Financeiros e admins podem atualizar comprovativos (para verificação)
CREATE POLICY "Financeiros e admins podem atualizar comprovativos" ON public.payment_proofs
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'finance')
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'finance')
  ));

-- Habilitar RLS na tabela de comprovativos de pagamento
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;