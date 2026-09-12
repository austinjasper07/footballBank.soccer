import localFont from "next/font/local";

// Self-hosted variable fonts avoid a live Google Fonts fetch at build time.
export const oswald = localFont({
  src: "../fonts/Oswald-Variable.woff2",
  weight: "200 700",
  variable: "--font-oswald",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: true,
});

export const manrope = localFont({
  src: "../fonts/Manrope-Variable.woff2",
  weight: "400 800",
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
