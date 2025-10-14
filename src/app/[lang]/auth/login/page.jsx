import { Suspense } from "react";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import LoginForm from "@/components/auth/LoginForm";
import "aos/dist/aos.css";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: "Login - FootballBank",
    description: "Sign in to your FootballBank account to access your player profile, manage your football career, and connect with scouts and clubs worldwide.",
    keywords: [
      "football login",
      "soccer account",
      "player login",
      "football platform login",
      "talent platform",
      "football career"
    ],
    url: "/auth/login",
    noIndex: true
  });
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}