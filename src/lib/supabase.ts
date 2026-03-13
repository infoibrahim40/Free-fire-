import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xtnmjtcrpdygdkkivgln.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bm1qdGNycGR5Z2Rra2l2Z2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTQ2MTksImV4cCI6MjA4ODk3MDYxOX0.IdhEnwmvmJww_FrsnDrqREC5NoXCaz6NCMC3SC1QaSM';

export const isSupabaseConfigured = true; // Set to true since we have fallbacks

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
  referred_by?: string;
  wallet_balance: number;
  role: 'player' | 'admin';
  created_at: string;
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
  created_at: string;
  created_by: string;
};

export type Registration = {
  id: string;
  tournament_id: string;
  player_id: string;
  squad_id?: string;
  payment_status: 'pending' | 'approved' | 'rejected';
  payment_screenshot_url?: string;
  slot_number?: number;
  created_at: string;
};

export type WalletTransaction = {
  id: string;
  player_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'winning' | 'referral' | 'entry_fee';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: string;
};

export type WithdrawRequest = {
  id: string;
  player_id: string;
  amount: number;
  payment_method: string;
  payment_details: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};
