import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Bell,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  Loader2,
  Play,
  Radio,
  Route as RouteIcon,
  Send,
  Sparkles,
} from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CategoryBadge, StatusBadge, UrgencyBadge } from "@/components/badges";
import {
  CategoryBarChart,
  TicketHeatmap,
  TrendCard,
  UrgencyPieChart,
  VolumeLineChart,
} from "@/components/analytics-charts";
import { classifyMock, tickets, type Category, type Urgency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live Judge Demonstration — University AI Helpdesk" },
      {
        name: "description",
        content:
          "Watch a student ticket get classified, prioritised, routed and tracked in real time — the full University AI Helpdesk pipeline in one screen.",
      },
      { property: "og:title", content: "Live Judge Demonstration — University AI Helpdesk" },
      {
        property: "og:description",
        content: "Real-time classification, urgency prediction and routing visualisation.",
      },
    ],
  }),
  component: DemoPage,
});

const samples = [
  "My examination timetable has not been updated.",
  "I lost my ID card yesterday.",
  "The student portal is not working.",
  "The classroom projector is not functioning.",
  "I have not received confirmation regarding an event registration.",
];

const stages = [
  { label: "Ingesting message", icon: Send },
  { label: "AI analysis", icon: BrainCircuit },
  { label: "Urgency prediction", icon: Gauge },
  { label: "Routing", icon: RouteIcon },
  { label: "Status updated", icon: CheckCircle2 },
];

type Feed = {
  id: string;
  message: string;
  category: Category;
  urgency: Urgency;
  department: string;
  confidence: number;
  at: string;
};

function DemoPage() {
  const [message, setMessage] = useState<string>(samples[0] ?? "");
  const [stage, setStage] = useState(-1);
  const [running, setRunning] = useState(false);
  const [feed, setFeed] = useState<Feed[]>(
    tickets.slice(0, 3).map((t) => ({
      id: t.id,
      message: t.message,
      category: t.category,
      urgency: t.urgency,
      department: t.department,
      confidence: t.confidence,
      at: new Date(t.createdAt).toLocaleTimeString(),
    })),
  );
  const [notifications, setNotifications] = useState<string[]>([
    "Escalation rule triggered for CMP-1042",
    "Duplicate merged into CMP-1036",
  ]);
  const counter = useRef(1100);
  const result = classifyMock(message);

  useEffect(() => {
    if (!running) return;
    if (stage >= stages.length) {
      const id = `CMP-${++counter.current}`;
      setFeed((f) => [
        {
          id,
          message,
          category: result.category,
          urgency: result.urgency,
          department: result.department,
          confidence: result.confidence,
          at: new Date().toLocaleTimeString(),
        },
        ...f,
      ].slice(0, 6));
      setNotifications((n) =>
        [`${id} routed to ${result.department} · ${result.urgency} priority`, ...n].slice(0, 6),
      );
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStage((s) => s + 1), 620);
    return () => clearTimeout(t);
  }, [running, stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = () => {
    if (!message.trim()) return;
    setStage(0);
    setRunning(true);
  };

  const progress = stage < 0 ? 0 : Math.min(100, ((stage + 1) / stages.length) * 100);

  return (
    <div className="relative overflow-hidden px-4 py-14 sm:px-6">
      <AuroraBackground dense />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3.5 py-1.5 text-xs font-medium text-danger">
            <Radio className="h-3.5 w-3.5 animate-pulse" /> Live demonstration mode
          </span>
        </div>
        <PageHeader
          eyebrow="Judge demonstration"
          title="Watch the pipeline run end to end"
          sub="Submit any message and follow it through classification, urgency prediction, routing and status updates — all on mock data."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          {/* Composer */}
          <Card className="rounded-2xl border-border/60 shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Real-time ticket submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none rounded-xl"
                aria-label="Demo ticket message"
              />
              <div className="flex flex-wrap gap-2">
                {samples.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setMessage(s)}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Sample {i + 1}
                  </button>
                ))}
              </div>
              <Button
                onClick={run}
                disabled={running}
                size="lg"
                className="w-full rounded-full bg-gradient-brand text-white shadow-elegant hover:opacity-95"
              >
                {running ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Run AI pipeline
                  </>
                )}
              </Button>

              <div className="space-y-3 pt-2">
                <Progress value={progress} className="h-1.5" />
                <div className="grid gap-2">
                  {stages.map((s, i) => (
                    <div
                      key={s.label}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors",
                        stage > i
                          ? "border-success/30 bg-success/10 text-foreground"
                          : stage === i
                            ? "border-primary/40 bg-primary/10 text-foreground"
                            : "border-border/50 text-muted-foreground",
                      )}
                    >
                      <s.icon className={cn("h-4 w-4", stage === i && "animate-pulse")} />
                      {s.label}
                      {stage > i && <CheckCircle2 className="ml-auto h-4 w-4 text-success" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prediction + routing */}
          <div className="space-y-4">
            <Card className="rounded-2xl border-border/60 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" /> Classification &amp; urgency preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <CategoryBadge value={result.category} />
                  <UrgencyBadge value={result.urgency} />
                  <StatusBadge value={stage >= stages.length ? "In Progress" : "Open"} />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Model confidence</span>
                    <span className="tabular-nums">{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-brand"
                      animate={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Routing visualisation
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-lg bg-card px-2.5 py-1.5 shadow-soft">Student</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="rounded-lg bg-card px-2.5 py-1.5 shadow-soft">AI engine</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="rounded-lg bg-gradient-brand px-2.5 py-1.5 text-white shadow-elegant">
                      {result.department}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-4 w-4 text-primary" /> Notification centre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {notifications.map((n) => (
                    <motion.div
                      key={n}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-border/60 bg-muted/40 px-3.5 py-2.5 text-sm"
                    >
                      {n}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity timeline / feed */}
        <Card className="mt-4 rounded-2xl border-border/60 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Live activity timeline</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence initial={false}>
              {feed.map((f) => (
                <motion.div
                  key={f.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-border/60 bg-card p-4"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">{f.id}</span>
                    <span>{f.at}</span>
                  </div>
                  <p className="mt-2 text-sm">{f.message}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <CategoryBadge value={f.category} />
                    <UrgencyBadge value={f.urgency} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">→ {f.department}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Analytics */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <VolumeLineChart />
          </div>
          <TrendCard />
          <CategoryBarChart />
          <UrgencyPieChart />
          <TicketHeatmap />
        </div>
      </div>
    </div>
  );
}
