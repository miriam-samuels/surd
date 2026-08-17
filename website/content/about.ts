export const ABOUT_INTRO = {
  title: "We are making saving feel simple, consistent, and trustworthy.",
  body: "Surd was created to help people save better, grow steadily, and manage money with more clarity and confidence.",
} as const;

export const VISION = {
  eyebrow: "Our vision",
  lead: "To see",
  body: "a future where savings is a normal part of your everyday life",
} as const;

export const MISSION = {
  eyebrow: "Our mission",
  lead: "To help people",
  body: "build consistent savings habits",
  tail: "with simple, trustworthy tools.",
} as const;

export type CoreValue = {
  title: string;
  body: string;
  tone: "pink" | "aqua" | "orange" | "green" | "purple";
};

export const CORE_VALUES: CoreValue[] = [
  {
    title: "Simplicity",
    body: "If it needs explaining, it's too complicated.",
    tone: "pink",
  },
  {
    title: "Consistency",
    body: "Small amounts. Every day. Every week. Every month.",
    tone: "aqua",
  },
  { title: "Trust", body: "Your money deserves clarity.", tone: "orange" },
  { title: "Continuity", body: "Savings should keep flowing.", tone: "green" },
  {
    title: "Progress",
    body: "Every money saved is a movement forward.",
    tone: "purple",
  },
];

export const OUR_STORY = {
  eyebrow: "Our Story",
  paragraphs: [
    "Many people want to save, but the process can feel stressful, unclear, or too easy to abandon. Surd was built to make saving feel more natural.",
    "We help users create savings goals, keep money active, lock funds for structured returns, and track progress in a way that is simple to understand.",
    "Every feature we ship starts from the same question: does this make it easier for someone to keep going?",
  ],
} as const;

export type TeamMember = {
  name: string;
  role: string;
  tone: "aqua" | "blue" | "pink" | "yellow";
};

export const TEAM: TeamMember[] = [
  { name: "Benjamin Masebinu", role: "CTO, Surd Technologies", tone: "aqua" },
  { name: "Benjamin Masebinu", role: "CTO, Surd Technologies", tone: "blue" },
  { name: "Benjamin Masebinu", role: "CTO, Surd Technologies", tone: "pink" },
  { name: "Benjamin Masebinu", role: "CTO, Surd Technologies", tone: "yellow" },
];

export const HIRING_CTA = {
  title: "Come take a sit with us, we're hiring",
  action: "See open positions",
} as const;
