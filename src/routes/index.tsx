import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BrainCircuit,
  Copy,
  Gauge,
  Globe,
  Languages,
  Route as RouteIcon,
  Search,
  Shield,
  Sparkles,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge, StatusBadge, UrgencyBadge } from "@/components/badges";
import { SectionHeading } from "@/components/section-heading";
import { faqs, stats } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CMPICA AI Helpdesk — AI-Powered Student Support System" },
      {
        name: "description",
        content:
          "Smart ticket management powered by artificial intelligence. Submit, classify, route and track student support requests at CMPICA, CHARUSAT.",
      },
      { property: "og:title", content: "CMPICA AI Helpdesk — AI-Powered Student Support" },
      {
        property: "og:description",
        content:
          "Smart ticket management powered by artificial intelligence for CMPICA students and administrators.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: BrainCircuit, title: "Smart Classification", desc: "Every message is read and mapped to one of five official categories in under a second." },
  { icon: Gauge, title: "Priority Detection", desc: "Urgency signals, deadlines and tone decide whether a ticket is Low, Medium or High." },
  { icon: RouteIcon, title: "Smart Routing", desc: "Tickets land directly with the department that can actually resolve them." },
  { icon: Search, title: "Ticket Tracking", desc: "Students follow a live timeline from submission to resolution with a single ID." },
  { icon: Copy, title: "Duplicate Detection", desc: "Repeat reports of the same issue are merged so teams work once, not five times." },
  { icon: Zap, title: "Automatic Escalation", desc: "SLA breaches escalate to department heads without anyone chasing a reminder." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Volume, urgency mix, response time and hotspots in one operational view." },
  { icon: Languages, title: "Multi-language Support", desc: "English, Hindi and Gujarati messages are normalised before classification." },
];

const steps = [
  { n: "01", title: "Student submits a ticket", desc: "A short message through the helpdesk form — no forms to decode, no dropdowns to guess.", icon: Sparkles },
  { n: "02", title: "The ticket enters the AI system", desc: "The request is queued, timestamped and handed to the classification pipeline.", icon: Zap },
  { n: "03", title: "Artificial intelligence analyses the ticket", desc: "Intent, entities and sentiment are extracted from the raw message.", icon: BrainCircuit },
  { n: "04", title: "Category and urgency are identified", desc: "One of five categories plus a Low / Medium / High priority, with a confidence score.", icon: Gauge },
  { n: "05", title: "The ticket is routed", desc: "It is assigned to the owning department along with the SLA timer.", icon: RouteIcon },
  { n: "06", title: "The ticket status is updated", desc: "Open, In Progress, Escalated or Resolved — visible to the student in real time.", icon: Bell },
];

const statCards = [
  { label: "Total Tickets", value: stats.total.toLocaleString(), icon: BarChart3 },
  { label: "Open Tickets", value: stats.open, icon: Timer },
  { label: "Resolved Tickets", value: stats.resolved.toLocaleString(), icon: Shield },
  { label: "Escalated Tickets", value: stats.escalated, icon: TrendingUp },
  { label: "Avg. Response Time", value: stats.avgResponse, icon: Zap },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28">
        <AuroraBackground dense />
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp} className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 glass px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Built for the n8n Community Hackathon · CMPICA, CHARUSAT
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
            >
              AI-Powered <span className="text-gradient">Student Helpdesk</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Smart ticket management powered by artificial intelligence.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-gradient-brand px-7 text-white shadow-elegant hover:opacity-95">
                <Link to="/submit">
                  Submit Ticket <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/track">Track Ticket</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating preview cards */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
              className="rounded-3xl border border-border/70 glass p-5 shadow-elegant sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Live classification stream</p>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" /> Realtime
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "CMP-1042", msg: "My examination timetable has not been updated.", c: "Academic", u: "High", s: "Escalated" },
                  { id: "CMP-1041", msg: "I lost my ID card yesterday.", c: "Administrative", u: "Medium", s: "In Progress" },
                  { id: "CMP-1040", msg: "The student portal is not working.", c: "Technical", u: "High", s: "Open" },
                  { id: "CMP-1039", msg: "The classroom projector is not functioning.", c: "Facilities", u: "Medium", s: "In Progress" },
                ].map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="rounded-2xl border border-border/60 bg-card/70 p-4 transition-transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-mono">{t.id}</span>
                      <StatusBadge value={t.s as never} />
                    </div>
                    <p className="mt-2.5 text-sm">{t.msg}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <CategoryBadge value={t.c as never} />
                      <UrgencyBadge value={t.u as never} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="animate-float absolute -left-4 -top-10 hidden rounded-2xl border border-border/70 glass px-4 py-3 shadow-soft lg:block"
            >
              <p className="text-xs text-muted-foreground">Classification accuracy</p>
              <p className="text-lg font-semibold">{stats.accuracy}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="animate-float absolute -bottom-8 -right-4 hidden rounded-2xl border border-border/70 glass px-4 py-3 shadow-soft [animation-delay:-3s] lg:block"
            >
              <p className="text-xs text-muted-foreground">Avg. response</p>
              <p className="text-lg font-semibold">{stats.avgResponse}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="h-full rounded-2xl border-border/60 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
                <CardContent className="p-5">
                  <s.icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-2xl font-semibold tracking-tight">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Capabilities"
            title="Everything the helpdesk does automatically"
            sub="Eight AI capabilities working on every single ticket, from the moment it is submitted."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 4) * 0.07 }}
              >
                <Card className="group h-full rounded-2xl border-border/60 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
                  <CardContent className="p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-white">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold tracking-tight">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How it works"
            title="From a sentence to a resolved ticket"
            sub="Six steps, fully automated — the student only does the first one."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.08 }}
                className="relative rounded-2xl border border-border/60 bg-card/60 p-6 shadow-soft"
              >
                <span className="font-mono text-xs text-primary">{s.n}</span>
                <s.icon className="mt-3 h-5 w-5 text-muted-foreground" />
                <h3 className="mt-4 text-base font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" sub="" />
          <Accordion type="single" collapsible defaultValue={faqs[0].q} className="mt-10">
            {faqs.slice(0, 5).map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border/60">
                <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/faq">See all questions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-8 sm:px-6">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-brand px-6 py-16 text-center text-white shadow-elegant sm:px-12">
          <Globe className="absolute -right-10 -top-10 h-48 w-48 opacity-15" />
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to see it working live?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            Open the judge demonstration to watch a ticket get classified, prioritised and routed in
            real time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="rounded-full px-7">
              <Link to="/demo">Open live demonstration</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
