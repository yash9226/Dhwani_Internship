import { useEffect, useState } from "react";
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
import { tickets, type Ticket } from "@/lib/mock-data";
import { supabase, rowToTicket, type TicketRow } from "@/lib/supabase";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track a Ticket — University AI Helpdesk" },
      {
        name: "description",
        content:
          "Enter your ticket ID to follow its live status timeline: category, urgency, routing department and escalation state.",
      },
      { property: "og:title", content: "Track a Ticket — University AI Helpdesk" },
      {
        property: "og:description",
        content: "Follow your University support request from submission to resolution.",
      },
    ],
  }),
  component: TrackPage,
});

// ─── Component ────────────────────────────────────────────────────────────────
function TrackPage() {
  const { id: searchId } = Route.useSearch();
  const [query, setQuery] = useState(searchId ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Ticket | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const search = async (id: string) => {
    const raw = id.trim();
    if (!raw) return;

    const q = raw.toUpperCase();
    const cleanQ = q.replace(/^TKT-/, "");

    setLoading(true);
    setResult(null);
    setNotFound(false);
    setFetchError(null);

    try {
      let foundTicket: Ticket | null = null;

      // 1. Try Supabase
      try {
        const { data, error } = await supabase
          .from("tickets")
          .select("*")
          .or(`ticket_id.ilike.${q},ticket_id.ilike.%${cleanQ}%`)
          .maybeSingle();

        if (error) {
          console.warn("Supabase query warning:", error);
        } else if (data) {
          foundTicket = rowToTicket(data as TicketRow);
        }
      } catch (err) {
        console.warn("Supabase fetch failed:", err);
      }

      // 2. Check locally cached tickets (submitted during this session)
      if (!foundTicket && typeof window !== "undefined") {
        try {
          const local = JSON.parse(localStorage.getItem("cmpica_tickets") || "[]") as Ticket[];
          const match = local.find(
            (t) =>
              t.id.toUpperCase() === q ||
              t.id.toUpperCase().includes(cleanQ) ||
              cleanQ.includes(t.id.toUpperCase())
          );
          if (match) foundTicket = match;
        } catch {}
      }

      // 3. Fallback to mock tickets (CMP-1042, etc.) or demo sample
      if (!foundTicket) {
        const mockMatch = tickets.find(
          (t) =>
            t.id.toUpperCase() === q ||
            t.id.toUpperCase().includes(cleanQ) ||
            cleanQ.includes(t.id.toUpperCase())
        );
        if (mockMatch) {
          foundTicket = mockMatch;
        } else if (q === "TKT-WIXU53" || cleanQ === "WIXU53") {
          foundTicket = {
            id: "TKT-WIXU53",
            sender: "Ananya Patel",
            contact: "ananya.patel@charusat.edu.in",
            message: "Examination timetable has not been updated in the student portal.",
            category: "Academic",
            urgency: "High",
            status: "In Progress",
            department: "Examination Cell",
            escalated: false,
            confidence: 0.96,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeline: [
              { label: "Ticket submitted", detail: "Received from student portal", at: new Date().toISOString(), done: true },
              { label: "AI analysis", detail: "Message parsed and classified", at: new Date().toISOString(), done: true },
              { label: "Category & urgency assigned", detail: "Classified as Academic", at: new Date().toISOString(), done: true },
              { label: "Routed to department", detail: "Assigned to Examination Cell", at: new Date().toISOString(), done: true },
              { label: "In progress", detail: "Handled by assigned team", at: new Date().toISOString(), done: true },
              { label: "Resolved", detail: "Ticket closed", at: new Date().toISOString(), done: false },
            ],
          };
        }
      }

      if (foundTicket) {
        setResult(foundTicket);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchId) {
      setQuery(searchId);
      search(searchId);
    }
  }, [searchId]);

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

