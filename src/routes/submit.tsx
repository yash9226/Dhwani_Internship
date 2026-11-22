import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { CheckCircle2, Clock, Info, Loader2, Search, Send, Sparkles, XCircle } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryBadge, UrgencyBadge } from "@/components/badges";
import { classifyMock, type Ticket } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a Ticket — CMPICA AI Helpdesk" },
      {
        name: "description",
        content:
          "Describe your issue in one message. The AI helpdesk classifies, prioritises and routes it to the right CMPICA department automatically.",
      },
      { property: "og:title", content: "Submit a Ticket — CMPICA AI Helpdesk" },
      {
        property: "og:description",
        content: "Raise a student support request and let AI route it to the right department.",
      },
    ],
  }),
  component: SubmitPage,
});

const MAX = 600;

function SubmitPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({ name: false, message: false });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const timestamp = new Date();
  const nameError = touched.name && name.trim().length < 2 ? "Please enter your full name." : "";
  const messageError =
    touched.message && message.trim().length < 12
      ? "Describe the issue in at least 12 characters."
      : "";
  const valid = name.trim().length >= 2 && message.trim().length >= 12;
  const preview = classifyMock(message);

  const WEBHOOK_URL = (import.meta.env.VITE_WEBHOOK_URL as string | undefined) ?? "";

  const submit = async () => {
    setConfirmOpen(false);
    setLoading(true);
    setSubmitError(null);

    try {
      if (!WEBHOOK_URL) {
        throw new Error("VITE_WEBHOOK_URL is not set in .env — restart the dev server after adding it.");
      }

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Sender Name": name.trim(),
          "Message": message.trim(),
          "Contact Email": contact.trim(),
          "Source": "form",
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      // Parse the ticket ID returned by n8n
      let id: string;
      try {
        const data = await res.json();
        // n8n can return the ID under different field names — try all common ones
        id =
          data?.ticketId ??
          data?.ticket_id ??
          data?.["Ticket ID"] ??
          data?.["ticket_id"] ??
          data?.id ??
          data?.ticketID ??
          null;

        if (!id || typeof id !== "string") {
          // Response came back but with no recognisable ID field — log for debugging
          console.warn("n8n response did not contain a ticket ID field:", data);
          throw new Error("no_id");
        }
      } catch {
        // Fallback: generate a local ID so the success screen is never broken
        id = `TKT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      }

      setTicketId(id);

      // Cache ticket locally so it can immediately be tracked on /track
      try {
        const localTicket: Ticket = {
          id,
          sender: name.trim(),
          contact: contact.trim() || undefined,
          message: message.trim(),
          category: preview.category,
          urgency: preview.urgency,
          status: "Open",
          department: preview.department,
          escalated: false,
          confidence: preview.confidence,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [
            { label: "Ticket submitted", detail: "Received from student portal", at: new Date().toISOString(), done: true },
            { label: "AI analysis", detail: "Message parsed and classified", at: new Date().toISOString(), done: true },
            { label: "Category & urgency assigned", detail: `Classified as ${preview.category}`, at: new Date().toISOString(), done: true },
            { label: "Routed to department", detail: `Assigned to ${preview.department}`, at: new Date().toISOString(), done: false },
            { label: "In progress", detail: "Handled by assigned team", at: new Date().toISOString(), done: false },
            { label: "Resolved", detail: "Ticket closed", at: new Date().toISOString(), done: false },
          ],
        };
        const prev = JSON.parse(localStorage.getItem("cmpica_tickets") || "[]") as Ticket[];
        localStorage.setItem("cmpica_tickets", JSON.stringify([localTicket, ...prev.filter((t) => t.id !== id)]));
      } catch (e) {
        console.warn("Could not cache ticket locally:", e);
      }

      toast.success("Ticket submitted", {
        description: `Reference ${id} · routed to ${preview.department}`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Network error — please try again.";
      setSubmitError(message);
      toast.error("Submission failed", { description: message });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTicketId(null);
    setName("");
    setContact("");
    setMessage("");
    setTouched({ name: false, message: false });
    setSubmitError(null);
  };

  return (
    <div className="relative overflow-hidden px-4 py-16 sm:px-6">
      <AuroraBackground />
      <div className="relative mx-auto max-w-2xl">
        <PageHeader
          eyebrow="Submit ticket"
          title="Tell us what went wrong"
          sub="One message is enough. The AI figures out the category, urgency and the department that owns it."
        />

        <div className="mt-12">
          <Card className="rounded-2xl border-border/60 shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Ticket details</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {ticketId ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-6 text-center"
                  >
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">Ticket submitted</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Save this reference to track your request.
                    </p>
                    <p className="mt-4 font-mono text-2xl font-semibold text-primary">{ticketId}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <CategoryBadge value={preview.category} />
                      <UrgencyBadge value={preview.urgency} />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Routed to <span className="text-foreground">{preview.department}</span>
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <Button asChild className="rounded-full bg-gradient-brand px-6 text-white shadow-elegant hover:opacity-95">
                        <Link to="/track" search={{ id: ticketId }}>
                          <Search className="mr-2 h-4 w-4" />
                          Track this ticket
                        </Link>
                      </Button>
                      <Button onClick={reset} variant="outline" className="rounded-full">
                        Submit another ticket
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setTouched({ name: true, message: true });
                      if (valid) {
                        setSubmitError(null);
                        setConfirmOpen(true);
                      }
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="sender">
                        Sender Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="sender"
                        value={name}
                        placeholder="e.g. Ananya Patel"
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        aria-invalid={!!nameError}
                        className={cn("rounded-xl", nameError && "border-danger")}
                      />
                      {nameError && <p className="text-xs text-danger">{nameError}</p>}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message">
                          Message <span className="text-danger">*</span>
                        </Label>
                        <span
                          className={cn(
                            "text-xs tabular-nums text-muted-foreground",
                            message.length > MAX * 0.9 && "text-warning",
                          )}
                        >
                          {message.length}/{MAX}
                        </span>
                      </div>
                      <Textarea
                        id="message"
                        rows={6}
                        maxLength={MAX}
                        value={message}
                        placeholder="e.g. My examination timetable has not been updated."
                        onChange={(e) => setMessage(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                        aria-invalid={!!messageError}
                        className={cn("resize-none rounded-xl", messageError && "border-danger")}
                      />
                      {messageError && <p className="text-xs text-danger">{messageError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact">
                        Contact Email{" "}
                        <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="contact"
                        type="email"
                        value={contact}
                        placeholder="you@example.com"
                        onChange={(e) => setContact(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      Timestamp generated automatically ·{" "}
                      <span className="text-foreground">{timestamp.toLocaleString()}</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      className="w-full rounded-full bg-gradient-brand text-white shadow-elegant hover:opacity-95"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting ticket…
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Submit ticket
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm submission</DialogTitle>
            <DialogDescription>
              Review your ticket before it enters the AI pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4 text-sm">
            <p>
              <span className="text-muted-foreground">Sender:</span> {name}
            </p>
            <p>
              <span className="text-muted-foreground">Contact Email:</span> {contact || "Not provided"}
            </p>
            <p className="text-pretty">
              <span className="text-muted-foreground">Message:</span> {message}
            </p>
            <p className="text-xs text-muted-foreground">{timestamp.toLocaleString()}</p>
          </div>
          {submitError && (
            <div className="flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={loading}
              onClick={() => setConfirmOpen(false)}
            >
              Keep editing
            </Button>
            <Button
              className="rounded-full bg-gradient-brand text-white"
              disabled={loading}
              onClick={submit}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
              ) : (
                <>Confirm &amp; submit</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
