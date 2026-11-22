import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Loader2, Search, Ticket as TicketIcon } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CategoryBadge, StatusBadge, UrgencyBadge } from "@/components/badges";
import { TicketTimeline } from "@/components/ticket-timeline";
import { type Ticket, type TimelineEvent } from "@/lib/mock-data";
import { supabase, type TicketRow } from "@/lib/supabase";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track a Ticket — CMPICA AI Helpdesk" },
      {
        name: "description",
        content:
          "Enter your ticket ID to follow its live status timeline: category, urgency, routing department and escalation state.",
      },
      { property: "og:title", content: "Track a Ticket — CMPICA AI Helpdesk" },
      {
        property: "og:description",
        content: "Follow your CMPICA support request from submission to resolution.",
      },
    ],
  }),
  component: TrackPage,
});

// ─── Map Supabase row → UI Ticket type ───────────────────────────────────────
function rowToTicket(row: TicketRow): Ticket {
  const status = (row.status ?? "Open") as Ticket["status"];
  const category = (row.category ?? "Other") as Ticket["category"];

  const timeline: TimelineEvent[] = [
    { label: "Ticket submitted",       detail: "Received from student portal",      at: row.created_at, done: true },
    { label: "AI analysis",            detail: "Message parsed and classified",      at: row.created_at, done: true },
    { label: "Category & urgency",     detail: `Classified as ${category}`,          at: row.created_at, done: true },
    { label: "Routed to department",   detail: `Assigned to ${row.department ?? "—"}`, at: row.created_at, done: status !== "Open" },
    { label: status === "Escalated" ? "Escalated" : "In progress",
      detail: status === "Escalated" ? "SLA breached — escalated to department head" : "Handled by assigned team",
      at: row.created_at,
      done: status === "In Progress" || status === "Escalated" || status === "Resolved" },
    { label: "Resolved", detail: "Ticket closed", at: row.created_at, done: status === "Resolved" },
  ];

  return {
    id: row.ticket_id,
    sender: row.sender,
    contact: row.contact ?? undefined,
    message: row.message,
    category,
    urgency: (row.urgency ?? "Low") as Ticket["urgency"],
    status,
    department: row.department ?? "—",
    escalated: row.escalated ?? status === "Escalated",
    confidence: row.confidence ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
    timeline,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
function TrackPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Ticket | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const search = async (id: string) => {
    const q = id.trim().toUpperCase();
    if (!q) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .ilike("ticket_id", q)
        .maybeSingle();

      if (error) throw new Error(error.message);

      if (!data) {
        setNotFound(true);
      } else {
        setResult(rowToTicket(data as TicketRow));
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden px-4 py-16 sm:px-6">
      <AuroraBackground />
      <div className="relative mx-auto max-w-4xl">
        <PageHeader
          eyebrow="Track ticket"
          title="Where is my ticket?"
          sub="Enter the reference you received after submission — for example TKT-WIXU53."
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(query);
          }}
          className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <TicketIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="TKT-WIXU53"
              aria-label="Ticket ID"
              className="h-12 rounded-full pl-10 font-mono"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="h-12 rounded-full bg-gradient-brand px-7 text-white shadow-elegant hover:opacity-95"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </form>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="rounded-2xl border-border/60">
                  <CardContent className="space-y-4 p-6">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-40 w-full rounded-xl" />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {fetchError && !loading && (
              <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>{fetchError}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {notFound && !loading && !fetchError && (
              <motion.div key="nf" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No ticket found</AlertTitle>
                  <AlertDescription>
                    We could not find a ticket with that reference. Check the ID and try again.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-4 lg:grid-cols-[1fr_1fr]"
              >
                <Card className="rounded-2xl border-border/60 shadow-soft">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="font-mono text-base">{result.id}</CardTitle>
                      <StatusBadge value={result.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <p className="text-pretty text-sm leading-relaxed">{result.message}</p>
                    <div className="flex flex-wrap gap-2">
                      <CategoryBadge value={result.category} />
                      <UrgencyBadge value={result.urgency} />
                    </div>
                    <dl className="grid gap-3 text-sm">
                      <Row label="Sender"       value={result.sender} />
                      <Row label="Contact"      value={result.contact ?? "Not provided"} />
                      <Row label="Department"   value={result.department} />
                      <Row label="Submitted"    value={new Date(result.createdAt).toLocaleString()} />
                      <Row label="Last updated" value={new Date(result.updatedAt).toLocaleString()} />
                      <Row label="Escalation"   value={result.escalated ? "Escalated to department head" : "Not escalated"} />
                    </dl>
                    {result.escalated && (
                      <Alert className="rounded-xl border-danger/30 bg-danger/10">
                        <AlertTriangle className="h-4 w-4 text-danger" />
                        <AlertTitle className="text-danger">Escalated</AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                          SLA target was missed — this ticket is now tracked by the department head.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/60 shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-base">Ticket timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TicketTimeline events={result.timeline} />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate">{value}</dd>
    </div>
  );
}

