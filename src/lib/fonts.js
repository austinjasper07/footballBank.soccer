import { Oswald, DM_Serif_Text } from "next/font/google";

// Font configuration with fallbacks and error handling
export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: true,
});

export const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif-text",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  preload: true,
});

// CSS variables for fallback fonts
export const fontVariables = `
  :root {
    --font-oswald: ${oswald.style.fontFamily};
    --font-dm-serif-text: ${dmSerifText.style.fontFamily};
  }
`;
