// app/layout.tsx
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { KindeClientProvider } from "./KindeClientProvider";

import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "FootballBank.soccer",
  description: "Empowering football talent worldwide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
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
        <link rel="manifest" href="/site.webmanifest"></link>
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
      <body className="font-sans bg-primary-bg text-primary-text">
        <KindeClientProvider>
          <AuthProvider>
            <CartProvider>
              <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </CartProvider>
          </AuthProvider>
        </KindeClientProvider>
      </body>
    </html>
  );
}
