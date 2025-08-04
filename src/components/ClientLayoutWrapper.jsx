// components/ClientLayoutWrapper.tsx
"use client";

// import SplashScreen from './SplashScreen';
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from './ui/toaster';

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
      
      <main className={`${isAdminPage || isHomePage ? 'max-w-full' : 'max-w-6xl px-4 lg:px-0'} mx-auto `}>
        {children}
      </main>
      {
        !isAdminPage && <Footer />
      }
      
    </>
  );
}
