// app/layout.tsx
import "./globals.css";
import { Oswald } from "next/font/google";
import Script from "next/script";
import { NewAuthProvider } from "@/context/NewAuthContext";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/context/CartContext";
import AOSProvider from "@/components/AOSProvider";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata = generateSEOMetadata({
  title: "Global Football Talent Platform",
  description: "Discover and showcase football talent worldwide. Connect players with scouts, clubs, and opportunities through our comprehensive talent banking platform.",
  keywords: [
    "football talent", 
    "soccer players", 
    "football scouts", 
    "player profiles", 
    "football recruitment",
    "player publication",
    "football agency",
    "football bank",
    "football talent management",
    "soccer agent services",
    "player representation",
    "football career development",
    "soccer talent scouting",
    "football player database",
    "soccer recruitment platform"
  ],
  url: "/",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${oswald.variable}`}
    >
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        
        {/* Preconnect for Critical Resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Fonts - DM Serif Text */}
        <link 
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital,wght@0,400;1,400&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData("organization"))
          }}
        />
        
        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData("website"))
          }}
        />
        
        {/* Font Awesome Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.FontAwesomeConfig = { autoReplaceSvg: 'nest' };`,
          }}
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-body bg-gray-50 text-primary-text">
        <Analytics />
        <AOSProvider>
          <NewAuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NewAuthProvider>
        </AOSProvider>
      </body>
    </html>
  );
}
