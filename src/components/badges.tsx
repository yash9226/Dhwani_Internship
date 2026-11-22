import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Category, Status, Urgency } from "@/lib/mock-data";

const categoryStyles: Record<Category, string> = {
  Academic: "bg-primary/12 text-primary border-primary/25",
  Technical: "bg-cyan/15 text-cyan border-cyan/30",
  Administrative: "bg-indigo/15 text-indigo border-indigo/30",
  Facilities: "bg-warning/15 text-warning border-warning/30",
  Other: "bg-muted text-muted-foreground border-border",
};

const urgencyStyles: Record<Urgency, string> = {
  Low: "bg-success/12 text-success border-success/25",
  Medium: "bg-warning/15 text-warning border-warning/30",
  High: "bg-danger/15 text-danger border-danger/30",
};

const statusStyles: Record<Status, string> = {
  Open: "bg-primary/12 text-primary border-primary/25",
  "In Progress": "bg-cyan/15 text-cyan border-cyan/30",
  Escalated: "bg-danger/15 text-danger border-danger/30",
  Resolved: "bg-success/12 text-success border-success/25",
};

const base = "rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight";

export const CategoryBadge = ({ value, className }: { value: Category; className?: string }) => (
  <Badge variant="outline" className={cn(base, categoryStyles[value], className)}>
    {value}
  </Badge>
);

export const UrgencyBadge = ({ value, className }: { value: Urgency; className?: string }) => (
  <Badge variant="outline" className={cn(base, urgencyStyles[value], className)}>
    {value}
  </Badge>
);

export const StatusBadge = ({ value, className }: { value: Status; className?: string }) => (
  <Badge variant="outline" className={cn(base, statusStyles[value], className)}>
    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
    {value}
  </Badge>
);
