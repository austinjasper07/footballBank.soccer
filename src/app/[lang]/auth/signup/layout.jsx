import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";


export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: "Sign Up - FootballBank",
    description: "Join FootballBank to showcase your football talent, connect with scouts and clubs worldwide, and advance your football career. Free registration for players.",
    keywords: [
      "football signup",
      "soccer registration",
      "player signup",
      "football talent platform",
      "join footballbank",
      "football career platform",
      "player registration"
    ],
    url: "/auth/signup",
    noIndex: true
  });
}

export default function SignupLayout({ children }) {
  // Let the client-side handle authentication checks to avoid redirect loops
  // The signup page will handle redirects after successful authentication
  return children;
}

