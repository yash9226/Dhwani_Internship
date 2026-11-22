import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AuroraBackground } from "@/components/aurora-background";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/mock-data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — University AI Helpdesk" },
      {
        name: "description",
        content:
          "Answers about ticket categories, urgency levels, escalation rules, tracking and language support in the University AI Helpdesk.",
      },
      { property: "og:title", content: "FAQ — University AI Helpdesk" },
      {
        property: "og:description",
        content: "Common questions about the AI-powered student support system at the University.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="relative overflow-hidden px-4 py-16 sm:px-6">
      <AuroraBackground />
      <div className="relative mx-auto max-w-3xl">
        <PageHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          sub="Everything students usually ask before raising their first ticket."
        />
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border/60">
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl border border-border/60 glass p-8 text-center shadow-soft">
          <h2 className="text-lg font-semibold tracking-tight">Still stuck?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Raise a ticket and the helpdesk will route it to the right desk within seconds.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full bg-gradient-brand text-white shadow-elegant">
              <Link to="/submit">Submit a ticket</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/contact">Contact the team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
