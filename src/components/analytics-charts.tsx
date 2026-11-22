import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryBreakdown, heatmap, urgencySplit, volumeTrend } from "@/lib/mock-data";

const palette = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--popover-foreground)",
  fontSize: 12,
};

export function VolumeLineChart() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">Ticket volume · last 7 days</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={volumeTrend} margin={{ left: -20, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="gTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="tickets"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              fill="url(#gTickets)"
            />
            <Line type="monotone" dataKey="resolved" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CategoryBarChart() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">Tickets by category</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryBreakdown} margin={{ left: -20, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--accent)" }} />
            <Bar dataKey="value" radius={[8, 8, 4, 4]}>
              {categoryBreakdown.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function UrgencyPieChart() {
  return (
    <Card className="rounded-2xl border-border/60 shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">Urgency distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={urgencySplit}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={3}
              stroke="var(--card)"
            >
              {urgencySplit.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TicketHeatmap() {
  const max = Math.max(...heatmap.values.flat());
  return (
    <Card className="rounded-2xl border-border/60 shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">Submission heat map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[420px]">
            <div className="mb-2 grid grid-cols-[3rem_repeat(7,minmax(0,1fr))] gap-1.5 text-[11px] text-muted-foreground">
              <span />
              {heatmap.slots.map((s) => (
                <span key={s} className="text-center">
                  {s}
                </span>
              ))}
            </div>
            {heatmap.values.map((row, r) => (
              <div
                key={heatmap.days[r]}
                className="mb-1.5 grid grid-cols-[3rem_repeat(7,minmax(0,1fr))] items-center gap-1.5"
              >
                <span className="text-[11px] text-muted-foreground">{heatmap.days[r]}</span>
                {row.map((v, c) => (
                  <div
                    key={c}
                    title={`${heatmap.days[r]} ${heatmap.slots[c]} · ${v} tickets`}
                    className="h-7 rounded-md border border-border/40"
                    style={{ background: `color-mix(in oklab, var(--chart-1) ${(v / max) * 100}%, transparent)` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendCard() {
  return (
    <Card className="rounded-2xl border-border/60 bg-gradient-brand text-white shadow-elegant">
      <CardHeader>
        <CardTitle className="text-base text-white/90">Trend analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-semibold tracking-tight">+18.4%</p>
          <p className="text-sm text-white/75">Resolution rate vs. previous week</p>
        </div>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeTrend}>
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#ffffff"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-1.5 text-sm text-white/85">
          <li>· Technical tickets peak on Thursday afternoons</li>
          <li>· Escalations dropped 12% after smart routing</li>
          <li>· Average first response now 2m 41s</li>
        </ul>
      </CardContent>
    </Card>
  );
}
