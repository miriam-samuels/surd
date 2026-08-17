export const HERO = {
  eyebrow: "Your money is growing",
  titleMuted: "Small Habits.",
  title: "Bigger Possibilities.",
  body: "Surd helps build your everyday income into sustainable savings habit. Automated deposits, flexible plans. Clear progress. Whenever your goal — Surd gets you there.",
  action: "Start saving",
} as const;

export type Product = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  tone: "green" | "yellow" | "pink";
};

export const PRODUCTS_INTRO = {
  eyebrow: "Products",
  title: "One app. Different ways to save.",
  body: "Whether you're saving for a goal, locking away funds for higher returns, or building a habit, Surd has a savings option designed for you.",
} as const;

export const PRODUCTS: Product[] = [
  {
    id: "target-savings",
    eyebrow: "12-16% P.A",
    title: "Target Savings",
    body: "Create a savings goal, set your target amount, choose your currency, and save consistently toward what matters.",
    action: "Explore Target Savings",
    tone: "green",
  },
  {
    id: "fixed-deposit",
    eyebrow: "12-16% P.A",
    title: "Fixed Deposit",
    body: "Set aside a fixed amount for 30, 60, 90, 120, or 180 days and receive your interest upfront.",
    action: "Explore Fixed Deposit",
    tone: "yellow",
  },
  {
    id: "flexi-wallet",
    eyebrow: "12-16% P.A",
    title: "Flexi Wallet",
    body: "Save when you want. Withdraw when you need. Your money stays within reach while your savings keep growing.",
    action: "Explore Flexi Wallet",
    tone: "pink",
  },
];

export const WHY_SURD = {
  eyebrow: "Why Surd",
  title: "Built for people who\nwant saving to finally stick.",
  action: "Get the app",
  cards: [
    {
      id: "less-thinking",
      title: "Less thinking. More saving.",
      body: "Automate your savings and spend less time remembering.",
      media: "Auto-save settings screen",
    },
    {
      id: "progress",
      title: "Progress over perfection.",
      body: "Missed a week? That's okay. Just keep going.",
      media: "Progress tracker screen",
    },
    {
      id: "designed-around",
      title: "Designed around real life.",
      body: "Plans change. Goals change. Your savings should be flexible too.",
      media: "Plan settings screen",
    },
    {
      id: "celebrate",
      title: "Celebrate consistency.",
      body: "Big balances don't happen overnight. Good habits do.",
      media: "Celebrating customer",
    },
  ],
} as const;

export const BENEFITS_INTRO = {
  eyebrow: "Benefits",
  title: "Everything you need to keep saving.",
  aside:
    "Surd is built with account protection and secure infrastructure that helps keep your money and personal information safe.",
} as const;

export type Benefit = {
  id: string;
  title: string;
  body: string;
  illustration: string;
  media: string;
};

export const BENEFITS: Benefit[] = [
  {
    id: "auto-save",
    title: "Stay consistent with auto-save",
    body: "Set your savings schedule once and let Surd help you keep going automatically.",
    illustration: "/clips/Frame 2147207377.svg",
    media: "Piggy bank illustration",
  },
  {
    id: "multi-currency",
    title: "Save in multiple currencies",
    body: "Save in NGN or USD where supported, so your savings can match your local or international goals.",
    illustration: "/clips/Frame 2147207377-1.svg",
    media: "Vault illustration",
  },
  {
    id: "flexible-withdrawal",
    title: "Flexible withdrawal options",
    body: "Choose savings options that either keep you disciplined or give you access when you need it.",
    illustration: "/clips/Frame 2147207377-2.svg",
    media: "Card and laptop illustration",
  },
  {
    id: "withdraw-anytime",
    title: "Withdraw your earnings anytime",
    body: "Access your earned interest when eligible, without waiting for your full savings plan to end.",
    illustration: "/clips/Frame 2147207377-3.svg",
    media: "Wallet illustration",
  },
  {
    id: "smart-reminders",
    title: "Smart reminders",
    body: "Get helpful reminders that keep your savings goals in view without making money management feel stressful.",
    illustration: "/clips/Frame 2147207377-4.svg",
    media: "Calendar illustration",
  },
  {
    id: "track-progress",
    title: "Track your saving progress per plan",
    body: "See how each savings plan is growing, how close you are to your target, and what step comes next.",
    illustration: "/clips/Frame 2147207377-5.svg",
    media: "Progress chart illustration",
  },
];

export const SAVINGS_GOALS = [
  { label: "Rent", emoji: "\u{1F3E0}" },
  { label: "Travel", emoji: "✈️" },
  { label: "New Gadget", emoji: "\u{1F4BB}" },
  { label: "New Car", emoji: "\u{1F697}" },
  { label: "School Fees", emoji: "\u{1F393}" },
  { label: "Wedding", emoji: "\u{1F48D}" },
  { label: "Emergency Fund", emoji: "\u{1F6E1}️" },
  { label: "Just Because", emoji: "❤️" },
];

export const CALCULATOR = {
  eyebrow: "Calculator",
  title: "You don\u2019t become a saver overnight.",
  body: "You become one, one deposit at a time.",
  amountLabel: "If you saved",
  amount: "5,000",
  frequencyLabel: "every month",
  durationLabel: "3 years ago",
  currency: "Naira",
  resultLabel: "Today you'd have",
  result: "218,382",
  image: "/clips/calculator.svg",
  imageAlt: "Customer saving on her phone",
  disclaimer:
    "Calculator results are estimates. Actual returns may vary based on product type, rate, duration, currency, and applicable terms",
  footerTitle: "Small steps today.",
  footerTitleMuted: "Big wins tomorrow.",
  footerBody:
    "Anyone can save once. The real win is becoming someone who keeps saving. That's why every part of Surd is designed to help you stay consistent, not perfect.",
  action: "Get the app",
} as const;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export const TESTIMONIALS_INTRO = {
  eyebrow: "Testimonials",
  title: "Not our word, hear from other Surd users",
} as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I used to save only when I had extra money, which was almost never. With Surd, I save a little every week without even thinking about it. Looking back, consistency made a bigger difference than the amount.",
    name: "David A.",
    role: "Software Engineer, Lagos",
  },
  {
    quote:
      "I opened Surd to save for a new laptop. A few months later, I had enough without feeling like I was forcing myself to save. It completely changed how I think about money.",
    name: "Michael T.",
    role: "Product Designer",
  },
  {
    quote:
      "Locking money away for a fixed term was the push I needed. Knowing I could not touch it made me treat saving as a real commitment rather than an afterthought.",
    name: "Adaeze N.",
    role: "Operations Lead",
  },
];

export const LANDING_FAQ_INTRO = {
  eyebrow: "FAQs",
  title: "Frequently asked questions",
  body: "Couldn't find the answers you need?",
  linkLabel: "Contact us",
} as const;
