import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Martian_Mono, Overpass } from "next/font/google";
import "./globals.css";

// Big Shoulders was drawn for Chicago's city signage: the map's display voice.
const display = Big_Shoulders({ subsets: ["latin"], variable: "--font-display", display: "swap", axes: ["opsz"], adjustFontFallback: false });
const sans = Overpass({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// Martian Mono sets the departure board and line codes: data, not decoration.
const mono = Martian_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Anthony Nkwa · Software engineer",
  description:
    "Anthony Nkwa builds whole products in TypeScript: schema, API, payments, admin and customer apps. Fintech, a multi-tenant school system, an e-commerce store, and client sites.",
  authors: [{ name: "Anthony Nkwa" }],
  openGraph: {
    title: "Anthony Nkwa · Software engineer",
    description: "Five lines of work, drawn as a network: fintech, EduVault, Anchor Fit, GVR Labs and an MT5 trading bot.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07080A",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        {/* Before first paint: apply the remembered theme, and let typed text start hidden only when motion is allowed and JS runs. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('typing')",
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
