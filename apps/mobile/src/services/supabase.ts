// @ts-ignore
import { createClient } from '@supabase/supabase-js';

// Substitua essas variáveis com suas credenciais reais do Supabase
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// @ts-ignore
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);