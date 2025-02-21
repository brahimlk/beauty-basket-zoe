
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uaouqvjikcgdeueoeftn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhb3Vxdmppa2NnZGV1ZW9lZnRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzY2MzcsImV4cCI6MjA1NTc1MjYzN30.ntPWX8k5GUQK6UVMM9vTKLh2k0klJo-7uVPStttj0wU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
