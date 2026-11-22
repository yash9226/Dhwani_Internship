export type Category = "Academic" | "Technical" | "Administrative" | "Facilities" | "Other";
export type Urgency = "Low" | "Medium" | "High";
export type Status = "Open" | "In Progress" | "Escalated" | "Resolved";

export const CATEGORIES: Category[] = [
  "Academic",
  "Technical",
  "Administrative",
  "Facilities",
  "Other",
];
export const URGENCIES: Urgency[] = ["Low", "Medium", "High"];
export const STATUSES: Status[] = ["Open", "In Progress", "Escalated", "Resolved"];

export type TimelineEvent = {
  label: string;
  detail: string;
  at: string;
  done: boolean;
};

export type Ticket = {
  id: string;
  sender: string;
  contact?: string;
  message: string;
  category: Category;
  urgency: Urgency;
  status: Status;
  department: string;
  escalated: boolean;
  confidence: number;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
};

const routing: Record<Category, string> = {
  Academic: "Examination Cell",
  Technical: "IT Support Desk",
  Administrative: "Administration Office",
  Facilities: "Campus Maintenance",
  Other: "Student Welfare Desk",
};

export const departmentFor = (category: Category) => routing[category];

function timeline(created: string, status: Status, category: Category): TimelineEvent[] {
  const base: TimelineEvent[] = [
    { label: "Ticket submitted", detail: "Received from student portal", at: created, done: true },
    { label: "AI analysis", detail: "Message parsed and classified", at: created, done: true },
    {
      label: "Category & urgency assigned",
      detail: `Classified as ${category}`,
      at: created,
      done: true,
    },
    {
      label: "Routed to department",
      detail: `Assigned to ${routing[category]}`,
      at: created,
      done: status !== "Open",
    },
    {
      label: status === "Escalated" ? "Escalated" : "In progress",
      detail:
        status === "Escalated"
          ? "SLA breached — escalated to department head"
          : "Handled by assigned team",
      at: created,
      done: status === "In Progress" || status === "Escalated" || status === "Resolved",
    },
    { label: "Resolved", detail: "Ticket closed", at: created, done: status === "Resolved" },
  ];
  return base;
}

type Seed = {
  id: string;
  sender: string;
  contact?: string;
  message: string;
  category: Category;
  urgency: Urgency;
  status: Status;
  confidence: number;
  createdAt: string;
  updatedAt: string;
};

const seeds: Seed[] = [
  {
    id: "CMP-1042",
    sender: "Ananya Patel",
    contact: "ananya.patel@charusat.edu.in",
    message: "My examination timetable has not been updated.",
    category: "Academic",
    urgency: "High",
    status: "Escalated",
    confidence: 0.96,
    createdAt: "2026-08-05T09:14:00Z",
    updatedAt: "2026-08-06T11:02:00Z",
  },
  {
    id: "CMP-1041",
    sender: "Rohan Mehta",
    contact: "rohan.mehta@charusat.edu.in",
    message: "I lost my ID card yesterday.",
    category: "Administrative",
    urgency: "Medium",
    status: "In Progress",
    confidence: 0.93,
    createdAt: "2026-08-05T12:40:00Z",
    updatedAt: "2026-08-06T08:20:00Z",
  },
  {
    id: "CMP-1040",
    sender: "Krisha Shah",
    contact: "krisha.shah@charusat.edu.in",
    message: "The student portal is not working.",
    category: "Technical",
    urgency: "High",
    status: "Open",
    confidence: 0.98,
    createdAt: "2026-08-06T07:05:00Z",
    updatedAt: "2026-08-06T07:05:00Z",
  },
  {
    id: "CMP-1039",
    sender: "Devansh Joshi",
    message: "The classroom projector is not functioning.",
    category: "Facilities",
    urgency: "Medium",
    status: "In Progress",
    confidence: 0.91,
    createdAt: "2026-08-04T14:22:00Z",
    updatedAt: "2026-08-05T09:12:00Z",
  },
  {
    id: "CMP-1038",
    sender: "Isha Trivedi",
    contact: "+91 98250 11223",
    message: "I have not received confirmation regarding an event registration.",
    category: "Other",
    urgency: "Low",
    status: "Resolved",
    confidence: 0.87,
    createdAt: "2026-08-03T10:31:00Z",
    updatedAt: "2026-08-04T16:44:00Z",
  },
  {
    id: "CMP-1037",
    sender: "Meet Prajapati",
    contact: "meet.prajapati@charusat.edu.in",
    message: "Fee receipt for semester 5 is not reflecting in my account.",
    category: "Administrative",
    urgency: "High",
    status: "Escalated",
    confidence: 0.94,
    createdAt: "2026-08-02T08:55:00Z",
    updatedAt: "2026-08-05T13:10:00Z",
  },
  {
    id: "CMP-1036",
    sender: "Neel Dave",
    message: "Wi-Fi in the C block laboratory keeps disconnecting.",
    category: "Technical",
    urgency: "Medium",
    status: "In Progress",
    confidence: 0.9,
    createdAt: "2026-08-02T15:18:00Z",
    updatedAt: "2026-08-04T10:00:00Z",
  },
  {
    id: "CMP-1035",
    sender: "Priya Nair",
    contact: "priya.nair@charusat.edu.in",
    message: "Requesting a bonafide certificate for a scholarship application.",
    category: "Administrative",
    urgency: "Low",
    status: "Resolved",
    confidence: 0.89,
    createdAt: "2026-08-01T09:02:00Z",
    updatedAt: "2026-08-02T12:30:00Z",
  },
  {
    id: "CMP-1034",
    sender: "Aarav Solanki",
    message: "Internal marks for Data Structures are missing on the portal.",
    category: "Academic",
    urgency: "Medium",
    status: "Open",
    confidence: 0.92,
    createdAt: "2026-08-06T06:12:00Z",
    updatedAt: "2026-08-06T06:12:00Z",
  },
  {
    id: "CMP-1033",
    sender: "Sanya Desai",
    contact: "sanya.desai@charusat.edu.in",
    message: "Drinking water cooler on the second floor is out of order.",
    category: "Facilities",
    urgency: "Low",
    status: "Resolved",
    confidence: 0.85,
    createdAt: "2026-07-31T11:45:00Z",
    updatedAt: "2026-08-01T09:15:00Z",
  },
  {
    id: "CMP-1032",
    sender: "Harsh Vyas",
    message: "Library seat booking system shows an error at checkout.",
    category: "Technical",
    urgency: "Medium",
    status: "Resolved",
    confidence: 0.88,
    createdAt: "2026-07-30T16:20:00Z",
    updatedAt: "2026-08-01T10:05:00Z",
  },
  {
    id: "CMP-1031",
    sender: "Riya Bhatt",
    contact: "riya.bhatt@charusat.edu.in",
    message: "Hackathon volunteer certificate has not been issued.",
    category: "Other",
    urgency: "Low",
    status: "Open",
    confidence: 0.83,
    createdAt: "2026-08-06T05:40:00Z",
    updatedAt: "2026-08-06T05:40:00Z",
  },
];

export const tickets: Ticket[] = seeds.map((s) => ({
  ...s,
  department: routing[s.category],
  escalated: s.status === "Escalated",
  timeline: timeline(s.createdAt, s.status, s.category),
}));

export const stats = {
  total: 1284,
  open: 186,
  resolved: 1012,
  escalated: 42,
  avgResponse: "2m 41s",
  accuracy: "96.4%",
};

export const volumeTrend = [
  { day: "Mon", tickets: 128, resolved: 104 },
  { day: "Tue", tickets: 164, resolved: 131 },
  { day: "Wed", tickets: 142, resolved: 126 },
  { day: "Thu", tickets: 198, resolved: 158 },
  { day: "Fri", tickets: 176, resolved: 152 },
  { day: "Sat", tickets: 92, resolved: 84 },
  { day: "Sun", tickets: 64, resolved: 61 },
];

export const categoryBreakdown = [
  { name: "Academic", value: 412 },
  { name: "Technical", value: 336 },
  { name: "Administrative", value: 268 },
  { name: "Facilities", value: 174 },
  { name: "Other", value: 94 },
];

export const urgencySplit = [
  { name: "Low", value: 486 },
  { name: "Medium", value: 542 },
  { name: "High", value: 256 },
];

export const heatmap = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  slots: ["8a", "10a", "12p", "2p", "4p", "6p", "8p"],
  values: [
    [2, 8, 14, 11, 9, 5, 2],
    [3, 12, 18, 15, 10, 6, 3],
    [4, 10, 16, 13, 12, 7, 2],
    [5, 15, 22, 19, 14, 8, 4],
    [3, 11, 17, 16, 11, 6, 3],
    [1, 5, 8, 6, 4, 2, 1],
  ],
};

export const activity = [
  { id: 1, text: "CMP-1042 escalated to Examination Cell", time: "2 min ago", type: "escalation" },
  { id: 2, text: "CMP-1040 classified as Technical · High", time: "9 min ago", type: "ai" },
  { id: 3, text: "CMP-1035 resolved by Administration Office", time: "26 min ago", type: "resolved" },
  { id: 4, text: "Duplicate detected for CMP-1036", time: "41 min ago", type: "duplicate" },
  { id: 5, text: "CMP-1034 routed to Examination Cell", time: "1 hr ago", type: "routing" },
  { id: 6, text: "CMP-1031 received from student portal", time: "2 hr ago", type: "new" },
];

export const faqs = [
  {
    q: "How quickly is my ticket answered?",
    a: "Tickets are classified by AI within seconds and routed instantly. The current average first-response time across departments is under three minutes.",
  },
  {
    q: "Which categories can I raise a ticket for?",
    a: "Academic, Technical, Administrative, Facilities and Other. You do not need to pick one — the AI infers the category from your message.",
  },
  {
    q: "How does the AI decide urgency?",
    a: "It reads intent, tone and deadline signals in your message and assigns Low, Medium or High urgency, which drives the SLA timer.",
  },
  {
    q: "What happens if my ticket is not resolved in time?",
    a: "If an SLA is breached, the ticket automatically moves to Escalated and is surfaced to the department head on the admin dashboard.",
  },
  {
    q: "Can I track a ticket without logging in?",
    a: "Yes. Use the Track Ticket page with your ticket ID (for example CMP-1042) to see the full status timeline.",
  },
  {
    q: "Do I need to write in English?",
    a: "No. Messages in English, Hindi and Gujarati are supported and are normalised before classification.",
  },
];

export const classifyMock = (message: string) => {
  const m = message.toLowerCase();
  let category: Category = "Other";
  if (/exam|timetable|marks|syllabus|attendance|result|faculty|lecture/.test(m))
    category = "Academic";
  else if (/portal|wifi|wi-fi|login|website|password|system|error|software|server/.test(m))
    category = "Technical";
  else if (/fee|id card|certificate|admission|receipt|scholarship|document/.test(m))
    category = "Administrative";
  else if (/projector|classroom|ac |water|lab|bench|light|washroom|campus/.test(m))
    category = "Facilities";

  let urgency: Urgency = "Low";
  if (/urgent|immediately|today|tomorrow|not working|down|lost|deadline|exam/.test(m))
    urgency = "High";
  else if (m.length > 60) urgency = "Medium";

  const confidence = Math.min(0.99, 0.72 + Math.min(m.length, 160) / 500 + (category !== "Other" ? 0.12 : 0));
  return { category, urgency, department: routing[category], confidence };
};
