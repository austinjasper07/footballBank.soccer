// app/layout.tsx
import "./globals.css";
import { DM_Serif_Text, Funnel_Display } from "next/font/google";
import Script from "next/script";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { KindeClientProvider } from "./KindeClientProvider";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/context/CartContext";
import AOSProvider from "@/components/AOSProvider";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-funnel-display",
  display: "swap",
});

const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif-text",
  display: "swap",
});

export const metadata = {
  title: "FootballBank.soccer",
  description: "Empowering football talent worldwide",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${funnelDisplay.variable} ${dmSerifText.variable}`}
    >
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
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
      <body className="font-body bg-primary-bg text-primary-text">
        <Analytics />
        <AOSProvider>
          <KindeClientProvider>
            <AuthProvider>
              <CartProvider>
                <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
              </CartProvider>
            </AuthProvider>
          </KindeClientProvider>
        </AOSProvider>
      </body>
    </html>
  );
}
