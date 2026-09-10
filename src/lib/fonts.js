import { Manrope, Oswald } from "next/font/google";

// Font configuration with fallbacks and error handling
export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: true,
});

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: true,
});

// CSS variables for fallback fonts
export const fontVariables = `
  :root {
    --font-oswald: ${oswald.style.fontFamily};
    --font-manrope: ${manrope.style.fontFamily};
  }
`;
