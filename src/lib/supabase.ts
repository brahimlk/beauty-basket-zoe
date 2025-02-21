
import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = window.__env?.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseAnonKey = window.__env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required. Please make sure you have connected your Supabase project in the Lovable dashboard.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
