import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, MapPin, Phone, Sparkles, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand">
              <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">University AI Helpdesk</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            AI-Powered Student Support System — built for the n8n Community Hackathon at CHARUSAT University.
          </p>
          <div className="mt-5 flex gap-2">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">University</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Institute of Computer Applications</li>
            <li>Departments &amp; Programmes</li>
            <li>Student Life</li>
            <li>Placements</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">CHARUSAT</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>Charotar University of Science and Technology</li>
            <li>Academics</li>
            <li>Research</li>
            <li>Campus Facilities</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">AI Helpdesk</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/submit" className="transition-colors hover:text-foreground">
                Submit a ticket
              </Link>
            </li>
            <li>
              <Link to="/track" className="transition-colors hover:text-foreground">
                Track a ticket
              </Link>
            </li>
            <li>
              <Link to="/demo" className="transition-colors hover:text-foreground">
                Judge demonstration
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-foreground">
                FAQ
              </Link>
            </li>
          </ul>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" /> helpdesk@charusat.ac.in
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" /> +91 2697 265 011
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" /> Changa, Anand, Gujarat 388421
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 University AI Helpdesk. Demonstration interface with mock data.</p>
          <p>n8n Community Hackathon · CHARUSAT</p>
        </div>
      </div>
    </footer>
  );
}
