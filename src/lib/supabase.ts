import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Use placeholders if missing to prevent immediate crash, 
// but log a clear error for the developer.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'MISSING SUPABASE CREDENTIALS: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  ff_uid: string;
  ign: string;
  phone: string;
  avatar_url: string;
  country: string;
  referral_code: string;
  wallet_balance: number;
  role: 'player' | 'admin';
};

export type Tournament = {
  id: string;
  title: string;
  description: string;
  type: 'solo' | 'squad';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  entry_fee: number;
  prize_pool: number;
  start_time: string;
  max_players: number;
  rules: string;
  banner_url: string;
  room_id?: string;
  room_password?: string;
  kill_points: number;
};
