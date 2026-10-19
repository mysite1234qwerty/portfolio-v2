export interface ProjectStep {
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  role: string;
  disciplines: string[];
  themeColor: string;
  secondaryColor: string;
  behanceUrl?: string;
  coverImage: string;
  summary: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  steps: ProjectStep[];
  outcomes: string[];
  metrics?: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    slug: "canteen-2",
    index: "01",
    title: "Canteen 2.0",
    subtitle: "Campus Dining & Pickup Ecosystem",
    year: "2024",
    category: "Product & Service Design",
    role: "Lead Product Designer & UX Researcher",
    disciplines: ["Information Architecture", "Interaction Design", "Design System", "Field Research"],
    themeColor: "#FF5E3A",
    secondaryColor: "#1A0F0D",
    behanceUrl: "https://www.behance.net/gallery/256956757/Canteen-20",
    coverImage: "/images/projects/canteen-2/cover.png",
    summary: "A student-centric digital ordering and contactless pickup experience designed to eliminate campus lunch-hour bottlenecks and counter congestion.",
    challenge: "During peak class breaks, over 400 students simultaneously flooded the canteen counter, creating severe queue bottlenecks, order errors, and high food wait times.",
    approach: "Conducted on-site ethnographic shadowing, synthesized user journeys, and decoupled order customization from payment, introducing real-time preparation states with smart pickup lockers.",
    deliverables: ["Mobile Ordering App", "Counter Kiosk Interface", "Kitchen Display Terminal", "Scalable UI Kit"],
    steps: [
      {
        title: "Field Observation & Friction Mapping",
        description: "Shadowed 50+ meal transactions, pinpointing decision paralysis at printed menus as the root cause of queue halts."
      },
      {
        title: "Information Architecture Restructure",
        description: "Re-indexed 120+ menu items into fast-tap categorical clusters with real-time stock availability indicators."
      },
      {
        title: "Haptic Micro-Interactions & Cart Flow",
        description: "Designed rapid add-to-cart thumb gestures and a dual-tab meal customization drawer."
      },
      {
        title: "Staged Counter Handover Protocol",
        description: "Replaced verbal number shouting with numerical bay allocation and vibration notifications."
      }
    ],
    outcomes: [
      "Reduced average counter queue dwell time from 14 minutes to 3.5 minutes.",
      "Achieved 94% order pickup accuracy during pilot simulation.",
      "Published comprehensive Behance case study showcasing interaction architecture."
    ],
    metrics: [
      { label: "Dwell Time", value: "-75%" },
      { label: "Accuracy", value: "98.2%" },
      { label: "Satisfaction", value: "4.9/5" }
    ]
  },
  {
    slug: "breez",
    index: "02",
    title: "Breez Mobility",
    subtitle: "Premium Electric Chauffeur Platform",
    year: "2024",
    category: "Mobility & Responsive Web",
    role: "Product & Interaction Designer",
    disciplines: ["B2B & B2C Strategy", "Information Architecture", "Responsive Web", "Motion Design"],
    themeColor: "#3B82F6",
    secondaryColor: "#0A101D",
    behanceUrl: "https://www.behance.net/gallery/256963973/Breez-Premium-Mobility",
    coverImage: "/images/projects/breez/hero.webp",
    summary: "A unified digital mobility ecosystem providing frictionless chauffeur bookings for private high-net-worth riders and corporate enterprise travel managers.",
    challenge: "Enterprise corporate clients required multi-rider expense routing and scheduled itineraries, while individual riders demanded immediate luxury vehicle allocation without cognitive friction.",
    approach: "Designed a split-purpose dual routing architecture allowing instant ride requests on mobile while offering deep corporate dashboard fleet controls on widescreen views.",
    deliverables: ["Responsive Web Platform", "Executive Booking Flow", "Fleet Operations Dashboard", "Interactive Component Library"],
    steps: [
      {
        title: "B2B vs. B2C Stakeholder Segmentation",
        description: "Mapped distinct personas: executive assistants booking recurring trips vs. individual airport transfers."
      },
      {
        title: "One-Handed Mobile Itinerary Builder",
        description: "Crafted bottom-sheet booking controls optimized for thumb zones with fluid micro-animations."
      },
      {
        title: "Adaptive Dark Theme Luxury Palette",
        description: "Selected deep obsidian surfaces, precision sapphire accents, and tabular typography for corporate clarity."
      },
      {
        title: "Real-Time Telemetry & Chauffeur Status",
        description: "Designed live interactive vehicle arrival cards with route progression animations."
      }
    ],
    outcomes: [
      "Streamlined corporate bulk bookings down to a 3-step checkout funnel.",
      "Crafted an elevated, restrained visual identity embodying electric luxury.",
      "Delivered production-ready responsive Figma tokens and interaction prototypes."
    ],
    metrics: [
      { label: "Booking Speed", value: "2.1 min" },
      { label: "Task Success", value: "99.4%" },
      { label: "Conversion", value: "+38%" }
    ]
  },
  {
    slug: "evaara",
    index: "03",
    title: "Evaara Early Ed",
    subtitle: "Story-Led Progressive School Website",
    year: "2024",
    category: "Editorial & Visual Storytelling",
    role: "Digital Experience & Visual Designer",
    disciplines: ["Visual Storytelling", "Parent Journey Mapping", "Content Strategy", "Editorial Layout"],
    themeColor: "#EC4899",
    secondaryColor: "#1C0D15",
    coverImage: "/images/projects/evaara/hero.webp",
    summary: "A human-centered editorial digital experience translating a progressive child-led educational philosophy into an emotionally reassuring journey for prospective parents.",
    challenge: "Parents considering unconventional early-childhood pedagogy often feel apprehensive without clear curriculum transparency and tangible proof of developmental care.",
    approach: "Structured the site as a day-in-the-life exploratory narrative, replacing bureaucratic school catalogues with immersive classrooms vignettes and transparent educator portfolios.",
    deliverables: ["Editorial Website Experience", "Parent Inquiry Funnel", "Curriculum Interactive Journey", "Brand Guidelines"],
    steps: [
      {
        title: "Parent Anxiety Audit",
        description: "Conducted interviews with 24 parents to identify pivotal hesitation points during preschool selection."
      },
      {
        title: "Narrative Content Sequencing",
        description: "Arranged page hierarchies to answer emotional reassurance questions before technical admission details."
      },
      {
        title: "Warm Editorial Typography & Spacing",
        description: "Utilized generous editorial whitespace, warm organic tones, and tactile imagery containers."
      },
      {
        title: "Micro-Step Tour Scheduling",
        description: "Constructed a low-commitment tour calendar reducing abandonment rates."
      }
    ],
    outcomes: [
      "Overhauled parental perception with an authentic, calm digital aesthetic.",
      "Doubled school visitation inquiry requests within the initial launch quarter.",
      "Created a reusable modular editorial layout system for future campus updates."
    ],
    metrics: [
      { label: "Tour Inquiries", value: "+112%" },
      { label: "Scroll Depth", value: "82%" },
      { label: "Bounce Rate", value: "-28%" }
    ]
  },
  {
    slug: "lumina",
    index: "04",
    title: "Lumina Studio",
    subtitle: "Spatial Generative Interface Kit",
    year: "2024",
    category: "Design Engineering & Experimental",
    role: "Creative Technologist",
    disciplines: ["WebGL Prototyping", "Spatial UI", "Shader FX", "Design System"],
    themeColor: "#8B5CF6",
    secondaryColor: "#120B1F",
    coverImage: "/images/projects/lumina/hero.webp",
    summary: "An experimental design toolkit exploring GPU-accelerated spatial interfaces, dynamic tactile materials, and haptic feedback loops for generative creative workflows.",
    challenge: "Modern creative applications struggle to bridge dense toolsets with playful, visceral direct manipulation.",
    approach: "Engineered responsive WebGL canvas textures reacting to pointer inertia, audio frequencies, and spring-physics controls.",
    deliverables: ["Shader Component Library", "Interactive Sandbox", "Web Audio Feedback Engine", "Documentation"],
    steps: [
      {
        title: "Materiality & Glass Shaders",
        description: "Implemented real-time refractive vertex and fragment shaders in GLSL."
      },
      {
        title: "Audio-Haptic Integration",
        description: "Coupled sound synthesizers to UI state transitions for immediate visceral confirmation."
      }
    ],
    outcomes: [
      "Open-source prototype utilized by 500+ design engineers for spatial UI exploration."
    ],
    metrics: [
      { label: "Frame Rate", value: "60 FPS" },
      { label: "Bundle Size", value: "18 KB" }
    ]
  },
  {
    slug: "chronos",
    index: "05",
    title: "Chronos AI",
    subtitle: "Contextual Ambient Workspace",
    year: "2024",
    category: "Product Architecture",
    role: "Product Designer",
    disciplines: ["Cognitive Flow", "Information Architecture", "AI Interaction", "Design Tokens"],
    themeColor: "#10B981",
    secondaryColor: "#091712",
    coverImage: "/images/projects/chronos/hero.webp",
    summary: "A calm, zero-distraction focus tool that ambiently synthesizes research notes, calendar commitments, and proactive design reminders.",
    challenge: "Knowledge workers lose up to 40% of their creative flow switching between tab-heavy tools and static calendars.",
    approach: "Designed a single-surface stream with proactive timeline collapsing and adaptive typography.",
    deliverables: ["Cross-platform Desktop Client", "Focus Mode Tray", "Keyboard-First Command Bar"],
    steps: [
      {
        title: "Attention Span & Interruption Metrics",
        description: "Studied workflow interruptions across 30 design students and practitioners."
      },
      {
        title: "Calm UI Architecture",
        description: "Stripped away notification badges in favor of ambient color shifts and gentle sound cues."
      }
    ],
    outcomes: [
      "Crafted an ultra-minimal focus environment honored with community design praise."
    ],
    metrics: [
      { label: "Focus Duration", value: "+45m" },
      { label: "Context Switching", value: "-62%" }
    ]
  }
];

export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
