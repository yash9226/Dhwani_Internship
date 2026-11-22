import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase env vars are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Row type matching the n8n → Supabase tickets table ──────────────────────
export type TicketRow = {
  id: number;
  ticket_id: string;        // e.g. TKT-HWLGM5
  sender: string;
  message: string;
  contact: string | null;
  status: string;           // Open | In Progress | Escalated | Resolved
  category: string;         // Academic | Technical | Administrative | Facilities | Other
  urgency: string;          // Low | Medium | High
  department?: string | null;
  routed_to?: string | null;
  confidence?: number | null;
  escalated?: boolean | null;
  escalation_status?: string | null;
  source?: string | null;
  created_at?: string | null;
  raised_at?: string | null;
  updated_at?: string | null;
};
