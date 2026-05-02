import { createClient } from '@supabase/supabase-js';

// Ponemos las llaves fijas para que no desaparezcan al refrescar
const supabaseUrl = 'https://qqysbxfxetqbnucsmagc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxeXNieGZ4ZXRxYm51Y3NtYWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDA5MjcsImV4cCI6MjA5MjA3NjkyN30.JUbbOKWp-V0X7Md3BRoP6xTw02iPbQH-n1QyMKGUW5E'; // Pega aquí tu llave anon real entre las comillas

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export const LOGO_URL = 'https://qqysbxfxetqbnucsmagc.supabase.co/storage/v1/object/public/assets/logocuadrado-png1024.png';