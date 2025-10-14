// components/ClientLayoutWrapper.tsx
"use client";

// import SplashScreen from './SplashScreen';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from './ui/toaster';
import CookieConsent from "@/components/CookieConsent";

export default function ClientLayoutWrapper({ children, lang }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use a consistent base className to avoid hydration mismatches
  // Define className as a constant to ensure server/client consistency
  const mainClassName = "mx-auto min-h-screen max-w-full";

  // Only compute pathname-dependent logic on client side to avoid hydration mismatches
  const isAdminPage = isClient && (pathname.startsWith("/admin") || pathname.startsWith(`/${lang}/admin`));
  const isEditorPage = isClient && (pathname.startsWith("/editor") || pathname.startsWith(`/${lang}/editor`));
  // Check if it's homepage for any language (e.g., /en, /es, or /)
  const isHomePage = isClient && (pathname === "/" || pathname === `/${lang}` || /^\/[a-z]{2}$/.test(pathname));

  
  return (
    <>
      <Toaster />
      {
        !isAdminPage && !isEditorPage && <Header lang={lang} />
      }
      
      <main className={mainClassName}>
        {children}
      </main>
      {
        !isAdminPage && !isEditorPage && <Footer lang={lang} />
      }
      
      {/* Cookie Consent Banner - Show on all pages except admin */}
      {!isAdminPage && !isEditorPage && <CookieConsent />}
      
    </>
  );
}


