import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";

import { AuroraBackground } from "@/components/aurora-background";
import { PageHeader } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — CMPICA AI Helpdesk" },
      {
        name: "description",
        content:
          "Reach the CMPICA AI Helpdesk team at CHARUSAT, Changa: email, phone, office hours and campus location.",
      },
      { property: "og:title", content: "Contact — CMPICA AI Helpdesk" },
      {
        property: "og:description",
        content: "Get in touch with the CMPICA AI Helpdesk team at CHARUSAT.",
      },
    ],
  }),
  component: ContactPage,
});

const details = [
  { icon: Mail, label: "Email", value: "helpdesk@cmpica.charusat.ac.in" },
  { icon: Phone, label: "Phone", value: "+91 2697 265 011" },
  { icon: MapPin, label: "Campus", value: "CMPICA, CHARUSAT, Changa, Anand, Gujarat 388421" },
  { icon: Clock, label: "Helpdesk hours", value: "Monday – Saturday, 9:00 AM – 5:30 PM IST" },
];

function ContactPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative overflow-hidden px-4 py-16 sm:px-6">
      <AuroraBackground />
      <div className="relative mx-auto max-w-5xl">
        <PageHeader
          eyebrow="Contact"
          title="Talk to the helpdesk team"
          sub="For anything the AI cannot resolve, a human at CMPICA is one message away."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {details.map((d) => (
              <Card key={d.label} className="rounded-2xl border-border/60 shadow-soft">
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <d.icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{d.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{d.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-2xl border-border/60 shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Send a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    toast.success("Message sent", {
                      description: "The helpdesk team will reply within one working day.",
                    });
                    (e.target as HTMLFormElement).reset();
                  }, 1200);
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cname">Name</Label>
                    <Input id="cname" required placeholder="Your full name" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cmail">Email</Label>
                    <Input
                      id="cmail"
                      type="email"
                      required
                      placeholder="you@charusat.edu.in"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="csubject">Subject</Label>
                  <Input id="csubject" required placeholder="How can we help?" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cmsg">Message</Label>
                  <Textarea id="cmsg" required rows={6} className="resize-none rounded-xl" />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full rounded-full bg-gradient-brand text-white shadow-elegant hover:opacity-95"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
