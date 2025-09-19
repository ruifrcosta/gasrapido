-- Criação dos buckets de armazenamento para o GasRápido

-- Criar bucket para documentos de verificação
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-documents',
  'verification-documents',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Criar bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif']
);

-- Criar bucket para evidências de entrega
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'delivery-evidence',
  'delivery-evidence',
  false,
  20971520, -- 20MB
  ARRAY['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime']
);

-- Criar políticas RLS para o bucket de documentos de verificação
CREATE POLICY "Usuários podem inserir seus próprios documentos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Usuários podem selecionar seus próprios documentos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'verification-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins podem selecionar todos os documentos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'verification-documents' AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Criar políticas RLS para o bucket de fotos de perfil
CREATE POLICY "Usuários podem inserir suas próprias fotos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-pictures' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Todos podem selecionar fotos de perfil" ON storage.objects
  FOR SELECT TO authenticated, anon
  USING (bucket_id = 'profile-pictures');

-- Criar políticas RLS para o bucket de evidências de entrega
CREATE POLICY "Usuários podem inserir suas próprias evidências" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'delivery-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Partes envolvidas podem selecionar evidências" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'delivery-evidence' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.orders o 
        JOIN public.couriers c ON o.courier_id = c.id
        WHERE (storage.foldername(name))[1] = c.user_id::text 
        AND o.customer_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )
    )
  );