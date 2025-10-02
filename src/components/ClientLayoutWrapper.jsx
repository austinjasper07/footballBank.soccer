// components/ClientLayoutWrapper.tsx
"use client";

// import SplashScreen from './SplashScreen';
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from './ui/toaster';
import CookieConsent from "@/components/CookieConsent";

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isHomePage = pathname === "/";

  
  return (
    <>
      <Toaster />
      {
        !isAdminPage && <Header />
      }
      
      <main className={`${isAdminPage || isHomePage ? 'max-w-full' : 'max-w-7xl px-6 lg:px-4'} mx-auto min-h-screen`}>
        {children}
      </main>
      {
        !isAdminPage && <Footer />
      }
      
      {/* Cookie Consent Banner - Show on all pages except admin */}
      {!isAdminPage && <CookieConsent />}
      
    </>
  );
}
