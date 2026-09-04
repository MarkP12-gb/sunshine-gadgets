// ============================================================================
// Sunshine Gadgets — configuration
// ----------------------------------------------------------------------------
// This is the ONLY file you need to edit to connect real services.
// Both apps (buyer + admin) import their settings from here.
// ============================================================================

// Supabase → Project Settings → API
export const SUPABASE_URL = "https://hzcjcnjxvrwllurmqwin.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Y2pjbmp4dnJ3bGx1cm1xd2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzOTQzNDgsImV4cCI6MjEwMzk3MDM0OH0.q97DoRnACmkIiCdxjA5ILyjWGmtI56laPaU0Kd_e6nI";

// These point at the Edge Functions — already correct for this project,
// nothing to fill in here.
const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;
export const CREATE_PAYMENT_URL = `${FUNCTIONS_BASE}/create-payment`;
export const ORDER_STATUS_URL = `${FUNCTIONS_BASE}/order-status`;
