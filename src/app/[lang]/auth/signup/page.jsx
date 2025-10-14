import { Suspense } from "react";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import SignupForm from "@/components/auth/SignupForm";
import "aos/dist/aos.css";

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

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}