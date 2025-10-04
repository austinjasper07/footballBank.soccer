"use client";

import { useAuth } from "@/context/NewAuthContext";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaShoppingCart, FaBars, FaTimes, FaUser } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
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
    { label: "Agent", path: `/${lang}/agent` },
    { label: "Live Scores", path: `/${lang}/livescore` },
    { label: "Blog", path: `/${lang}/blog` },
    { label: "Shop", path: `/${lang}/shop/products` },
    { label: "Contact", path: `/${lang}/contact` },
  ];

  // Use consistent navigation links to prevent hydration mismatch
  const navLinks = (dict && mounted) ? [
    { label: dict.navigation.home, path: `/${lang}` },
    { label: dict.navigation.about, path: `/${lang}/about` },
    { label: dict.navigation.players, path: `/${lang}/players` },
    { label: dict.navigation.agent || "Agent", path: `/${lang}/agent` },
    { label: dict.navigation.liveScores, path: `/${lang}/livescore` },
    { label: dict.navigation.blog, path: `/${lang}/blog` },
    { label: dict.navigation.shop, path: `/${lang}/shop/products` },
    { label: dict.navigation.contact, path: `/${lang}/contact` },
  ] : defaultNavLinks;

  const { isAuthenticated, user, isLoading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();

  const isShopOrCart =
    pathname.includes("/shop") ||
    pathname.endsWith("/cart") ||
    pathname.includes("/shop/cart");
  const isCartPage = pathname.endsWith("/cart") || pathname.includes("/shop/cart");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-primary-card sticky top-0 z-50 border-b border-divider shadow-sm">
      {/* Partner Logos Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 py-2 px-4 md:px-8 lg:px-12">
        <div className="max-w-full mx-auto px-4 lg:px-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 font-medium">Trusted Partners:</span>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="flex items-center bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <Image
                  src="/partners/amazon-logo.svg"
                  alt="Amazon"
                  width={60}
                  height={20}
                  className="object-contain h-5"
                />
              </div>
              <div className="flex items-center bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <Image
                  src="/partners/concacaf-logo.svg"
                  alt="CONCACAF"
                  width={60}
                  height={20}
                  className="object-contain h-5"
                />
              </div>
              <div className="flex items-center bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <Image
                  src="/partners/fifa-logo.svg"
                  alt="FIFA"
                  width={60}
                  height={20}
                  className="object-contain h-5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-full mx-auto  lg:px-12">
        <div className="flex items-center px-8 sm:px-6 lg:px-12 justify-between h-14 sm:h-16 md:h-20">
          {/* Logo - Fixed width */}
          <div className="flex-shrink-0">
            <Link
              href={`/${lang}`}
              className="font-bold text-2xl text-accent-red cursor-pointer flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.jpg"
                  alt="FootballBank Logo"
                  width={40}
                  height={40}
                  className="object-contain h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                />
                <span className="text-lg sm:text-xl md:text-2xl font-semibold text-accent-red">
                  FootballBank
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <div className="flex space-x-4 xl:space-x-6 text-nowrap">
              {navLinks.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className={`transition-colors text-sm xl:text-base ${
                    pathname === path
                      ? "text-accent-red font-semibold"
                      : "text-primary-text hover:text-accent-red"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Actions - Fixed width */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Language Switcher */}
            {mounted && <LanguageSwitcher currentLang={lang} />}
            
            {/* Submit Profile CTA */}
            <Link
              href={`/${lang}/submit-profile`}
              className="hidden md:block bg-gradient-to-r from-accent-red to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 lg:px-4 py-2 rounded-md font-medium text-nowrap transition-all duration-200 shadow-sm hover:shadow-md text-sm lg:text-base"
            >
              {(dict && mounted) ? dict?.navigation?.submitProfile : "Submit Profile"}
            </Link>
            
            {isShopOrCart && mounted && (
              <Link href={`/${lang}/shop/cart`} className="relative">
                <FaShoppingCart
                  className={`text-xl ${
                    isCartPage
                      ? "text-accent-red"
                      : "text-accent-red hover:text-[var(--accent)]"
                  }`}
                />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {mounted && !isLoading && (
              isAuthenticated ? (
                <UserHeader slug={"Dashboard"} href={"/admin"}/>
              ) : (
                <Link
                  href={`/${lang}/auth/login`}
                  className="hidden lg:block border border-accent-red text-accent-red hover:bg-accent-red hover:text-white px-4 py-2 rounded-md font-medium text-nowrap transition-all duration-200"
                >
                  {(dict && mounted) ? dict?.navigation?.signIn : "Sign in"}
                </Link>
              )
            )}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-primary-text"
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
          className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-primary-card z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col p-4 sm:p-6 space-y-3 sm:space-y-4 pt-20 sm:pt-24">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                href={path}
                className={`text-base sm:text-lg py-2 px-3 rounded-md transition-colors ${
                  pathname === path
                    ? "text-accent-red font-semibold bg-red-50"
                    : "text-primary-text hover:text-accent-red hover:bg-gray-50"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            
            {/* Mobile Submit Profile Button */}
            <Link
              href={`/${lang}/submit-profile`}
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-to-r from-accent-red to-red-600 text-white text-center py-3 rounded-md block font-medium"
            >
              {(dict && mounted) ? dict?.navigation?.submitProfile : "Submit Profile"}
            </Link>
            
            {!isLoading && (
              isAuthenticated ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    // Handle logout - you can call logout function from context
                    window.location.href = '/auth/login';
                  }}
                  className="border border-accent-red text-accent-red text-center py-2 rounded-md w-full"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href={`/${lang}/auth/login`}
                  onClick={() => setMenuOpen(false)}
                  className="border border-accent-red text-accent-red text-center py-2 rounded-md block"
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
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
};