import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditi Sharma — Product Designer & Creative Technologist",
  description: "Portfolio of Aditi Sharma: Product Designer, UX/Interaction Designer studying at NIFT Bengaluru. Featuring WebGL 3D card carousel and haptic audio interactions.",
  openGraph: {
    title: "Aditi Sharma — Product Designer",
    description: "Designing digital experiences where complex systems become intuitive, tactile, and visually effortless.",
    url: "https://aditisharma.design",
    siteName: "Aditi Sharma Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="home min-h-screen bg-[#f2f2f2] text-[#282B32] antialiased selection:bg-neutral-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
