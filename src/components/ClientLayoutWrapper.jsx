// components/ClientLayoutWrapper.tsx
"use client";

// import SplashScreen from './SplashScreen';
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from './ui/toaster';
import CookieConsent from "@/components/CookieConsent";

export default function ClientLayoutWrapper({ children, lang }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  // Check if it's homepage for any language (e.g., /en, /es, or /)
  const isHomePage = pathname === "/" || pathname === `/${lang}` || /^\/[a-z]{2}$/.test(pathname);

  
  return (
    <>
      <Toaster />
      {
        !isAdminPage && <Header lang={lang} />
      }
      
      <main className={`${isAdminPage || isHomePage ? 'max-w-full' : 'max-w-7xl px-6 lg:px-4'} mx-auto min-h-screen`}>
        {children}
      </main>
      {
        !isAdminPage && <Footer lang={lang} />
      }
      
      {/* Cookie Consent Banner - Show on all pages except admin */}
      {!isAdminPage && <CookieConsent />}
      
    </>
  );
}
