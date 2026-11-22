import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  Copy,
  Inbox,
  LayoutGrid,
  Search,
  Settings,
  Sparkles,
  Timer,
  TrendingUp,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryBadge, StatusBadge, UrgencyBadge } from "@/components/badges";
import { TicketTimeline } from "@/components/ticket-timeline";
import {
  CategoryBarChart,
  TicketHeatmap,
  TrendCard,
  UrgencyPieChart,
  VolumeLineChart,
} from "@/components/analytics-charts";
import {
  CATEGORIES,
  STATUSES,
  URGENCIES,
  activity,
  stats,
  tickets,
  type Ticket,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Administrator Dashboard — CMPICA AI Helpdesk" },
      {
        name: "description",
        content:
          "Monitor, filter and triage student tickets: live queue, escalations, activity feed and analytics for the CMPICA AI Helpdesk.",
      },
      { property: "og:title", content: "Administrator Dashboard — CMPICA AI Helpdesk" },
      {
        property: "og:description",
        content: "Operational view of student support tickets, escalations and analytics.",
      },
    ],
  }),
  component: DashboardPage,
});

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "tickets", label: "Tickets", icon: Inbox },
  { id: "escalations", label: "Escalations", icon: AlertTriangle },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const statCards = [
  { label: "Total Tickets", value: stats.total.toLocaleString(), delta: "+8.2%", icon: Inbox },
  { label: "Open Tickets", value: stats.open, delta: "-4.1%", icon: Timer },
  { label: "Resolved Tickets", value: stats.resolved.toLocaleString(), delta: "+11.7%", icon: CheckCircle2 },
  { label: "Escalated Tickets", value: stats.escalated, delta: "-12.0%", icon: AlertTriangle },
  { label: "Avg. Response Time", value: stats.avgResponse, delta: "-18.4%", icon: TrendingUp },
];

function DashboardPage() {
  const [tab, setTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [urgency, setUrgency] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Ticket | null>(null);

  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (category === "all" || t.category === category) &&
          (urgency === "all" || t.urgency === urgency) &&
          (status === "all" || t.status === status) &&
          (query.trim() === "" ||
            `${t.id} ${t.sender} ${t.message}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, category, urgency, status],
  );

  const escalations = tickets.filter((t) => t.escalated);

  return (
    <div className="mx-auto flex max-w-[110rem] gap-6 px-4 py-8 sm:px-6">
      {/* Sidebar */}
      <aside className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block">
        <nav className="rounded-2xl border border-border/60 bg-card/60 p-2 shadow-soft">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                tab === n.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </button>
          ))}
          <div className="mt-2 border-t border-border/60 pt-2">
            <button className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
              <Settings className="h-4 w-4" /> Settings
            </button>
          </div>
        </nav>

        <Card className="mt-4 rounded-2xl border-border/60 bg-gradient-brand text-white shadow-elegant">
          <CardContent className="p-5">
            <Sparkles className="h-5 w-5" />
            <p className="mt-3 text-sm font-medium">AI classification accuracy</p>
            <p className="mt-1 text-2xl font-semibold">{stats.accuracy}</p>
          </CardContent>
        </Card>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">Administrator Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live queue across all CMPICA departments
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Notifications" className="relative rounded-full">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
            </Button>
            <Button className="rounded-full bg-gradient-brand text-white shadow-elegant">
              Export report
            </Button>
          </div>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <TabsList className="rounded-full lg:hidden">
            {navItems.map((n) => (
              <TabsTrigger key={n.id} value={n.id} className="rounded-full text-xs">
                {n.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full rounded-2xl border-border/60 shadow-soft transition-transform hover:-translate-y-1">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <s.icon className="h-4.5 w-4.5 text-primary" />
                        <span
                          className={cn(
                            "text-xs font-medium",
                            s.delta.startsWith("-") ? "text-success" : "text-primary",
                          )}
                        >
                          {s.delta}
                        </span>
                      </div>
                      <p className="mt-4 text-2xl font-semibold tracking-tight">{s.value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <VolumeLineChart />
              </div>
              <ActivityPanel />
            </div>
          </TabsContent>

          {/* Tickets */}
          <TabsContent value="tickets" className="mt-6 space-y-4">
            <Card className="rounded-2xl border-border/60 shadow-soft">
              <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_repeat(3,10rem)]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search ID, student or message…"
                    className="rounded-xl pl-9"
                    aria-label="Search tickets"
                  />
                </div>
                <FilterSelect value={category} onChange={setCategory} label="Category" options={CATEGORIES} />
                <FilterSelect value={urgency} onChange={setUrgency} label="Urgency" options={URGENCIES} />
                <FilterSelect value={status} onChange={setStatus} label="Status" options={STATUSES} />
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-soft">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-28">Ticket</TableHead>
                      <TableHead className="min-w-[16rem]">Message</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((t) => (
                      <TableRow
                        key={t.id}
                        onClick={() => setSelected(t)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-mono text-xs">{t.id}</TableCell>
                        <TableCell>
                          <p className="max-w-md truncate text-sm">{t.message}</p>
                          <p className="text-xs text-muted-foreground">{t.sender}</p>
                        </TableCell>
                        <TableCell><CategoryBadge value={t.category} /></TableCell>
                        <TableCell><UrgencyBadge value={t.urgency} /></TableCell>
                        <TableCell><StatusBadge value={t.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.department}</TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                          No tickets match these filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Escalations */}
          <TabsContent value="escalations" className="mt-6 space-y-4">
            <Card className="rounded-2xl border-danger/30 bg-danger/5 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-danger">
                  <AlertTriangle className="h-4 w-4" /> {escalations.length} tickets breached their SLA
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {escalations.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t)}
                    className="rounded-xl border border-border/60 bg-card p-4 text-left transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-mono">{t.id}</span>
                      <span>{t.department}</span>
                    </div>
                    <p className="mt-2 text-sm">{t.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <CategoryBadge value={t.category} />
                      <UrgencyBadge value={t.urgency} />
                      <StatusBadge value={t.status} />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
            <ActivityPanel />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="mt-6 space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2"><VolumeLineChart /></div>
              <TrendCard />
              <CategoryBarChart />
              <UrgencyPieChart />
              <TicketHeatmap />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ticket details panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border/60 bg-card p-6 shadow-elegant"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">{selected.id}</p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">{selected.sender}</h2>
                </div>
                <Button variant="ghost" size="icon" aria-label="Close panel" onClick={() => setSelected(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-5 text-pretty text-sm leading-relaxed">{selected.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <CategoryBadge value={selected.category} />
                <UrgencyBadge value={selected.urgency} />
                <StatusBadge value={selected.status} />
              </div>
              <dl className="mt-6 space-y-3 text-sm">
                <Detail label="Department" value={selected.department} />
                <Detail label="Contact" value={selected.contact ?? "Not provided"} />
                <Detail label="AI confidence" value={`${Math.round(selected.confidence * 100)}%`} />
                <Detail label="Submitted" value={new Date(selected.createdAt).toLocaleString()} />
                <Detail label="Updated" value={new Date(selected.updatedAt).toLocaleString()} />
              </dl>
              <h3 className="mt-8 text-sm font-semibold">Timeline</h3>
              <div className="mt-4">
                <TicketTimeline events={selected.timeline} />
              </div>
              <div className="mt-8 flex gap-2">
                <Button className="flex-1 rounded-full bg-gradient-brand text-white">Mark resolved</Button>
                <Button variant="outline" className="rounded-full">Reassign</Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{value}</dd>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: readonly string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-xl" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label.toLowerCase()}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const icons: Record<string, typeof Activity> = {
  escalation: AlertTriangle,
  ai: Sparkles,
  resolved: CheckCircle2,
  duplicate: Copy,
  routing: TrendingUp,
  new: Inbox,
};

export function ActivityPanel() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-primary" /> Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activity.map((a, i) => {
          const Icon = icons[a.type] ?? Activity;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-muted-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
