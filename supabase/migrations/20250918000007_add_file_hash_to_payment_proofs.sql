-- Adicionar coluna file_hash à tabela payment_proofs para verificação de integridade de arquivos

-- Adicionar a coluna file_hash
ALTER TABLE public.payment_proofs 
ADD COLUMN IF NOT EXISTS file_hash TEXT;

-- Adicionar comentário para documentar a coluna
COMMENT ON COLUMN public.payment_proofs.file_hash IS 'SHA-256 hash do arquivo de comprovativo para verificação de integridade';

-- Criar índice para a coluna file_hash para melhorar a performance de consultas
CREATE INDEX IF NOT EXISTS idx_payment_proofs_file_hash ON public.payment_proofs(file_hash);