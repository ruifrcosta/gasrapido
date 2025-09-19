-- Criação das tabelas para o sistema de convites e verificação de documentos

-- Enum para tipos de convite
CREATE TYPE invitation_type AS ENUM ('client', 'vendor', 'courier');

-- Enum para status de convite
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');

-- Tabela de convites
CREATE TABLE IF NOT EXISTS public.invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type invitation_type NOT NULL,
    email VARCHAR(255) NOT NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    accepted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status invitation_status DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de documentos de verificação
CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'id', 'license', 'insurance', 'vehicle_registration'
    file_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    rejection_reason TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Tabela de solicitações de verificação
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    rejection_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Índices para performance
CREATE INDEX idx_invites_code ON public.invites(code);
CREATE INDEX idx_invites_email ON public.invites(email);
CREATE INDEX idx_invites_status ON public.invites(status);
CREATE INDEX idx_verification_documents_user ON public.verification_documents(user_id);
CREATE INDEX idx_verification_documents_status ON public.verification_documents(status);
CREATE INDEX idx_verification_requests_user ON public.verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON public.verification_requests(status);

-- Triggers para updated_at
CREATE TRIGGER update_invites_updated_at BEFORE UPDATE ON public.invites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_documents_updated_at BEFORE UPDATE ON public.verification_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON public.verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar código de convite único
CREATE OR REPLACE FUNCTION generate_unique_invite_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Gerar código aleatório de 8 caracteres
        new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        
        -- Verificar se o código já existe
        SELECT EXISTS(SELECT 1 FROM public.invites WHERE code = new_code)
        INTO code_exists;
        
        -- Se não existir, sair do loop
        IF NOT code_exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Função para criar convite
CREATE OR REPLACE FUNCTION create_invite(
    invite_type invitation_type,
    invite_email VARCHAR(255),
    invited_by_id UUID,
    expiry_days INTEGER DEFAULT 7
)
RETURNS TABLE(
    invite_id UUID,
    invite_code VARCHAR(50),
    invite_type invitation_type,
    invite_email VARCHAR(255),
    invited_by UUID,
    status invitation_status,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    new_invite_id UUID;
    new_invite_code TEXT;
BEGIN
    -- Gerar código único
    new_invite_code := generate_unique_invite_code();
    
    -- Inserir convite
    INSERT INTO public.invites (code, type, email, invited_by, expires_at)
    VALUES (new_invite_code, invite_type, invite_email, invited_by_id, NOW() + (expiry_days || ' days')::INTERVAL)
    RETURNING id INTO new_invite_id;
    
    -- Retornar dados do convite criado
    RETURN QUERY
    SELECT 
        i.id,
        i.code,
        i.type,
        i.email,
        i.invited_by,
        i.status,
        i.expires_at,
        i.created_at
    FROM public.invites i
    WHERE i.id = new_invite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para aceitar convite
CREATE OR REPLACE FUNCTION accept_invite(
    invite_code VARCHAR(50),
    user_id UUID
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    invite_id UUID
) AS $$
DECLARE
    invite_record public.invites%ROWTYPE;
BEGIN
    -- Buscar convite
    SELECT * INTO invite_record
    FROM public.invites
    WHERE code = invite_code;
    
    -- Verificar se convite existe
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 'Convite não encontrado'::TEXT, NULL::UUID;
        RETURN;
    END IF;
    
    -- Verificar se convite já foi aceito
    IF invite_record.status = 'accepted' THEN
        RETURN QUERY SELECT FALSE, 'Convite já foi aceito'::TEXT, invite_record.id;
        RETURN;
    END IF;
    
    -- Verificar se convite expirou
    IF invite_record.expires_at < NOW() THEN
        RETURN QUERY SELECT FALSE, 'Convite expirado'::TEXT, invite_record.id;
        RETURN;
    END IF;
    
    -- Verificar se convite foi revogado
    IF invite_record.status = 'revoked' THEN
        RETURN QUERY SELECT FALSE, 'Convite revogado'::TEXT, invite_record.id;
        RETURN;
    END IF;
    
    -- Atualizar convite como aceito
    UPDATE public.invites
    SET 
        status = 'accepted',
        accepted_by = user_id,
        accepted_at = NOW(),
        updated_at = NOW()
    WHERE id = invite_record.id;
    
    -- Retornar sucesso
    RETURN QUERY SELECT TRUE, 'Convite aceito com sucesso'::TEXT, invite_record.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;