import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente - devem ser definidas no ambiente de execução
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);