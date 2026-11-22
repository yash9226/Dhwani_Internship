import { motion } from "motion/react";
import { Check, Circle } from "lucide-react";
import type { TimelineEvent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TicketTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-6 pl-8">
      <span className="absolute left-[11px] top-2 bottom-2 w-px bg-border" aria-hidden />
      {events.map((e, i) => (
        <motion.li
          key={e.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="relative"
        >
          <span
            className={cn(
              "absolute -left-8 grid h-6 w-6 place-items-center rounded-full border",
              e.done
                ? "border-primary/40 bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {e.done ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2" />}
          </span>
          <p className={cn("text-sm font-medium", !e.done && "text-muted-foreground")}>{e.label}</p>
          <p className="text-xs text-muted-foreground">{e.detail}</p>
          {e.done && (
            <p className="mt-0.5 text-[11px] text-muted-foreground/70">
              {new Date(e.at).toLocaleString()}
            </p>
          )}
        </motion.li>
      ))}
    </ol>
  );
}
