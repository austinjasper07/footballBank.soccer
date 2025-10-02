import Link from "next/link";
import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CookieSettings from "@/components/CookieSettings";

export default function Footer() {
  return (
    <footer className="bg-primary-card max-w-full px-4 lg:px-12 pt-16 mt-20 pb-8 border-t border-divider">
      <div className=" mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex flex-col mb-4 ">
              <Link href={"/"} className="font-bold text-2xl inline-block cursor-pointer text-accent-red">
                FootballBank
              </Link>
              <div>

              <span className="text-primary-muted text-[12px]"> powered by </span> <span className="text-primary-muted font-bold text-sm inline-block cursor-pointer">Dojoglo&Fam</span>
              </div>
            </div>
            <p className="text-primary-muted mb-6">
              Empowering football talent worldwide through visibility and
              opportunity.
            </p>
            <div className="flex space-x-4">
              {[
                { 
                  name: "twitter", 
                  href: "https://x.com/footballbankhq?s=21&t=Ihzjw_SrtnHA4qE0nkgFfg" 
                },
                {
                  name: "instagram",
                  href: "https://www.instagram.com/footballbank.soccer",
                },
                { 
                  name: "facebook", 
                  href: "https://www.facebook.com/profile.php?id=61580081775450" 
                },
                {
                  name: "youtube",
                  href: "http://www.youtube.com/@footballbank.soccer",
                },
                {
                  name: "tiktok",
                  href: "http://www.tiktok.com/@footballbank.soccer",
                },
              ].map((brand) => (
                <Link
                  href={brand.href}
                  key={brand.name}
                  className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer"
                >
                  <i className={`fa-brands fa-${brand.name} text-xl`} />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className=" font-semibold text-lg mb-4 text-primary-text">
              Quick Links
            </h3>
            <ul className="flex flex-col space-y-2">
              {[
                { title: "Home", href: "/" },
                { title: "Players", href: "/players" },
                { title: "Live Scores", href: "/livescore" },
                { title: "Submit Profile", href: "/submit-profile" },
                { title: "About Us", href: "/about" },
              ].map((link) => (
                <Link
                  data-aos="fade-up"
                  href={link.href}
                  key={link.title}
                  className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer"
                >
                  {link.title}
                </Link>
              ))}
            </ul>
          </div>
          <div>
            <h3 className=" font-semibold text-lg mb-4 text-primary-text">
              Resources
            </h3>
            <ul className="flex flex-col space-y-2">
              {[
                { title: "Blog", href: "/blog" },
                { title: "Career Tips", href: "/career-tips" },
                { title: "Shop", href: "/shop/products" },
                { title: "Subscriptions", href: "/subscriptions" },
                { title: "FAQ", href: "/faq" },
              ].map((link) => (
                <Link
                  data-aos="fade-up"
                  href={link.href}
                  key={link.title}
                  className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer"
                >
                  {link.title}
                </Link>
              ))}
            </ul>
          </div>
          <div>
            <h3 className=" font-semibold text-lg mb-4 text-primary-text">
              Contact
            </h3>
            <ul className="flex flex-col space-y-2">
              <li className="text-primary-muted">
                <a href="mailto:contact@footballbank.soccer" className="hover:text-accent-red transition-colors">
                  contact@footballbank.soccer
                </a>
              </li>
              <li className="text-primary-muted">
                <a href="tel:+18623729817" className="hover:text-accent-red transition-colors">
                  +1 (862) 372-9817
                </a>
              </li>
              <li className="text-primary-muted">
                PO BOX 7268, Newark, NJ 07107
              </li>
              <li>
                <Link href="/privacy-policy" className="text-primary-muted hover:text-accent-red transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-primary-muted hover:text-accent-red transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-muted text-sm">
            © {new Date().getFullYear()} FootballBank. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link 
              href="/privacy-policy"
              className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer"
            >
              Privacy
            </Link>
            <Link 
              href="/terms-of-service"
              className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer"
            >
              Terms
            </Link>
            <CookieSettings 
              trigger={
                <span className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer">
                  Cookies
                </span>
              }
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
