import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import ChromeGate from "@/components/ChromeGate";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PageCover from "@/components/PageCover";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeSwitch from "@/components/ThemeSwitch";
import "./globals.css";

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

const unica = localFont({
  src: "./fonts/UnicaOne-Regular.ttf",
  variable: "--font-unica",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bitandbytes.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bit & Bytes LLC | AI Agents, Voice AI & Software Development",
    template: "%s | Bit & Bytes LLC",
  },
  description:
    "Bit & Bytes builds AI agents, voice AI, RAG assistants and the software around them, from a one-day discovery workshop to production pilots and dedicated AI pods. HIPAA-aware delivery for healthcare, retail, automotive and SaaS teams.",
  keywords: [
    "AI agent development",
    "voice AI agents",
    "RAG knowledge assistants",
    "AI pilot development",
    "LLMOps",
    "HIPAA compliant software",
    "SaaS product development",
    "Bit and Bytes LLC",
  ],
  authors: [{ name: "Bit & Bytes LLC" }],
  creator: "Bit & Bytes LLC",
  publisher: "Bit & Bytes LLC",
  icons: { icon: "/brand/bnb-icon.png", apple: "/brand/bnb-icon.png" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Bit & Bytes LLC",
    title: "Bit & Bytes LLC | AI Agents, Voice AI & Software Development",
    description: "AI agents, voice AI and software that reach production. Discovery workshops, pilots and AI pods from Bit & Bytes LLC.",
    images: [{ url: "/brand/bnb-logo-full.png", width: 1024, height: 276, alt: "Bit & Bytes LLC Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bit & Bytes LLC | AI Agents, Voice AI & Software Development",
    description: "AI agents, voice AI and software that reach production.",
    images: ["/brand/bnb-logo-full.png"],
    creator: "@bitandbytes",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  category: "Technology",
};

export const viewport: Viewport = {
  themeColor: "#673493",
};

// Applies the saved theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${unica.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ChromeGate>
          <SmoothScroll />
          <Nav />
          <ThemeSwitch />
        </ChromeGate>
        <main>{children}</main>
        <ChromeGate>
          <Footer />
          <PageCover />
        </ChromeGate>
      </body>
    </html>
  );
}
