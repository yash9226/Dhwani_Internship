import { createClient } from "@supabase/supabase-js";
import { type Ticket, type TimelineEvent } from "./mock-data";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase env vars are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

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

// ─── Map Supabase row → UI Ticket type ───────────────────────────────────────
export function rowToTicket(row: TicketRow): Ticket {
  const status = (row.status ?? "Open") as Ticket["status"];
  const category = (row.category ?? "Other") as Ticket["category"];
  const department = row.routed_to ?? row.department ?? "—";
  const isEscalated = Boolean(
    row.escalated ||
    row.escalation_status === "Escalated" ||
    status === "Escalated"
  );
  const createdAt = row.raised_at ?? row.created_at ?? new Date().toISOString();
  const updatedAt = row.updated_at ?? createdAt;

  const timeline: TimelineEvent[] = [
    { label: "Ticket submitted",       detail: "Received from student portal",      at: createdAt, done: true },
    { label: "AI analysis",            detail: "Message parsed and classified",      at: createdAt, done: true },
    { label: "Category & urgency",     detail: `Classified as ${category}`,          at: createdAt, done: true },
    { label: "Routed to department",   detail: `Assigned to ${department}`,          at: createdAt, done: status !== "Open" },
    { label: isEscalated ? "Escalated" : "In progress",
      detail: isEscalated ? "SLA breached — escalated to department head" : "Handled by assigned team",
      at: createdAt,
      done: status === "In Progress" || isEscalated || status === "Resolved" },
    { label: "Resolved", detail: "Ticket closed", at: updatedAt, done: status === "Resolved" },
  ];

  return {
    id: row.ticket_id,
    sender: row.sender,
    contact: row.contact ?? undefined,
    message: row.message,
    category,
    urgency: (row.urgency ?? "Low") as Ticket["urgency"],
    status,
    department,
    escalated: isEscalated,
    confidence: row.confidence ?? 0.95,
    createdAt,
    updatedAt,
    timeline,
  };
}
