import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY!;
  return createSupabaseClient(supabaseUrl, serviceKey);
}
