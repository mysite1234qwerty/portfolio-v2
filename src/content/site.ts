export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const site = {
  name: "Aditi Sharma",
  title: "Aditi Sharma — Product & UX Designer",
  role: "Product Designer & Creative Technologist",
  roles: ["Product Designer", "Interaction Designer", "Creative Technologist"],
  location: "Bengaluru, India",
  education: "National Institute of Fashion Technology, Bengaluru",
  statement: "Designing digital experiences where complex systems become intuitive, tactile, and visually effortless.",
  bio: "Studying at NIFT Bengaluru with a focus on product thinking, human-computer interaction, and design engineering. I bridge deep research and information architecture with tactile, motion-led interfaces.",
  
  about: {
    paragraphs: [
      "I'm a product designer based in Bengaluru, exploring the intersection of human intent, digital systems, and tactile interfaces.",
      "My process begins with qualitative research and strict information architecture, progressing into high-fidelity interaction prototypes. By understanding the underlying engineering materials—whether responsive layout engines, state models, or GPU shaders—I design systems that are both emotionally resonant and production-viable.",
      "Currently interested in spatial UI paradigms, micro-interactions, generative workflows, and accessible design systems.",
    ],
    practices: [
      "User Experience (UX) Research",
      "Information Architecture",
      "Interaction Design & Prototyping",
      "Visual & Design Systems",
      "Creative Front-End Prototyping",
      "Usability Evaluation",
    ],
    toolkit: [
      "Figma",
      "Framer",
      "Three.js / WebGL",
      "React / Next.js",
      "Tailwind CSS",
      "Adobe Creative Cloud",
    ]
  },

  skills: [
    {
      category: "Cognition & IA",
      tag: "Research",
      items: ["Qualitative Interviews", "Affinity Mapping", "Journey Modeling", "Information Architecture", "Heuristic Audits"]
    },
    {
      category: "Interaction & Motion",
      tag: "Design",
      items: ["Micro-interactions", "Design Systems", "Prototyping", "Design Tokens", "Wireframing & Spec"]
    },
    {
      category: "Creative Technology",
      tag: "Code",
      items: ["React / TypeScript", "Tailwind CSS", "WebGL & 3D Shaders", "Web Audio API", "State Architecture"]
    }
  ],

  contact: {
    headline: "Let's build something remarkable.",
    email: "aditi.sharma.design@gmail.com",
    behance: "https://www.behance.net/",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
  },

  nav: [
    { id: "work", label: "Work", href: "#work" },
    { id: "about", label: "About", href: "#about" },
    { id: "archive", label: "Index", href: "#archive" },
    { id: "contact", label: "Contact", href: "#contact" },
  ] as NavItem[]
};
