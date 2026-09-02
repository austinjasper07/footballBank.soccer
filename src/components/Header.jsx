"use client";

import { useAuth } from "@/context/NewAuthContext";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { UserHeader } from "./UserHeader";
import LanguageSwitcher from "./LanguageSwitcher";
import { getClientDictionary } from "@/lib/client-dictionaries";

export default function Header({ lang = 'en' }) {
  const [dict, setDict] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  // Fallback navigation with default English labels to prevent empty header
  const defaultNavLinks = [
    { label: "Home", path: `/${lang}` },
    { label: "About", path: `/${lang}/about` },
    { label: "Players", path: `/${lang}/players` },
    { label: "Clubs & Scouts", path: `/${lang}/clubs-scouts` },
    { label: "Representation", path: `/${lang}/agent` },
    // { label: "Pricing", path: `/${lang}/pricing` },
    { label: "Blog", path: `/${lang}/blog` },
    // { label: "Shop", path: `/${lang}/shop/products` },
    { label: "Contact", path: `/${lang}/contact` },
  ];

  // Use consistent navigation links to prevent hydration mismatch
  const navLinks = (dict && mounted) ? [
    { label: dict.navigation.home, path: `/${lang}` },
    { label: dict.navigation.about, path: `/${lang}/about` },
    { label: dict.navigation.players, path: `/${lang}/players` },
    { label: dict.navigation.clubsAndScouts || "Clubs & Scouts", path: `/${lang}/clubs-scouts` },
    { label: dict.navigation.representation || "Representation", path: `/${lang}/agent` },
    // { label: dict.navigation.pricing || "Pricing", path: `/${lang}/pricing` },
    { label: dict.navigation.blog, path: `/${lang}/blog` },
    // { label: dict.navigation.shop, path: `/${lang}/shop/products` },
    { label: dict.navigation.contact, path: `/${lang}/contact` },
  ] : defaultNavLinks;

  const { isAuthenticated, loading: isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isShopPage = false;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-primary-navy sticky top-0 z-50 border-b border-white/10 shadow-sm lg:h-28 h-16 md:h-20 flex items-center">
      
      <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-12 w-full flex ">
        <div className="w-full flex items-center justify-between h-12 sm:h-14 md:h-16">
          {/* Logo - Fixed width */}
          <div className="shrink-0">
          <Link
              href={`/${lang}`}
              className="font-bold text-2xl cursor-pointer flex items-center gap-2"
          >
              <div className="flex items-center gap-2">
              <Image
                src="/logo/logo-1.png"
                alt="FootballBank Logo"
                width={60}
                height={60}
                  className="object-contain h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16"
              />
              <div className="flex flex-col">
                <h1 className="text-base sm:text-lg md:block md:text-xl font-semibold text-white tracking-wider">
                  FootballBank
                </h1>
                <h3 className="text-[8px] md:text-[10px] tracking-[0.15em] text-primary-accent">INTERNATIONAL</h3>
              </div>
            </div>
          </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <div className="flex space-x-4 xl:space-x-6 text-nowrap">
            {navLinks.map(({ label, path }) => {
              const isActive = mounted && (
                pathname === path || 
                (path !== `/${lang}` && pathname.startsWith(path)) ||
                (path === `/${lang}/shop/products` && pathname.startsWith(`/${lang}/shop`))
              );
              return (
                <Link
                  key={path}
                  href={path}
                  className={`transition-colors text-sm xl:text-lg ${
                    isActive
                      ? "text-primary-action font-semibold"
                      : "text-white hover:text-primary-action"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            </div>
          </nav>

          {/* Right Actions - Fixed width */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Language Switcher */}
            {mounted && <LanguageSwitcher currentLang={lang} />}
            
            {/* Submit Profile CTA - Hidden on shop pages */}
            {!isShopPage && (
              <Link
                href={`/${lang}/submit-profile`}
                className="hidden md:block bg-primary-action hover:bg-primary-action-hover text-white px-3 lg:px-4 py-2 rounded-md font-medium text-nowrap transition-all duration-200 shadow-sm hover:shadow-md text-sm lg:text-base"
              >
                {(dict && mounted) ? dict?.navigation?.submitProfile : "Submit Profile"}
              </Link>
            )}
            
            {/* Shop/cart shortcut disabled */}
            {mounted && !isLoading && (
              isAuthenticated ? (
                <UserHeader slug={"Dashboard"} href={"/admin"}/>
              ) : (
                <Link
                  href={`/${lang}/auth/login`}
                  className="hidden lg:block border border-primary-action text-primary-action hover:bg-primary-action hover:text-white hover:border-primary-action px-4 py-2 rounded-md font-medium text-nowrap transition-all duration-200"
                >
                  {(dict && mounted) ? dict?.navigation?.signIn : "Sign in"}
                </Link>
              )
            )}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-white"
            >
              {menuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mounted && (
      <div
          className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-primary-navy z-50 shadow-lg transform transition-transform duration-300 ease-in-out border-l border-white/10 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
          <div className="flex flex-col p-4 sm:p-6 space-y-3 sm:space-y-4 pt-20 sm:pt-24">
          {navLinks.map(({ label, path }) => {
            const isActive = mounted && (
              pathname === path || 
              (path !== `/${lang}` && pathname.startsWith(path)) ||
              (path === `/${lang}/shop/products` && pathname.startsWith(`/${lang}/shop`))
            );
            return (
              <Link
                key={path}
                href={path}
                className={`text-base sm:text-lg py-2 px-3 rounded-md transition-colors ${
                  isActive
                    ? "text-primary-action font-semibold bg-primary-action/10"
                    : "text-white/80 hover:text-primary-action hover:bg-white/5"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          
          {/* Mobile Submit Profile Button - Hidden on shop pages */}
          {!isShopPage && (
            <Link
                href={`/${lang}/submit-profile`}
              onClick={() => setMenuOpen(false)}
              className="bg-primary-action hover:bg-primary-action-hover text-white text-center py-3 rounded-md block font-medium transition-colors"
            >
                {(dict && mounted) ? dict?.navigation?.submitProfile : "Submit Profile"}
            </Link>
          )}
          
          {!isLoading && (
            isAuthenticated ? (
              <button
                onClick={async () => {
                  setMenuOpen(false);
                  await logout(true);
                }}
                className="border border-primary-action text-primary-action text-center py-2 rounded-md w-full"
              >
                Logout
              </button>
            ) : (
              <Link
                  href={`/${lang}/auth/login`}
                onClick={() => setMenuOpen(false)}
                className="border border-primary-action text-primary-action text-center py-2 rounded-md block"
              >
                  {(dict && mounted) ? dict?.navigation?.signIn : "Sign in"}
              </Link>
            )
          )}
        </div>
      </div>
      )}

      {/* Backdrop */}
      {mounted && menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};
