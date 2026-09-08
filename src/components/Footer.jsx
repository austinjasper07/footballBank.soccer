import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CookieSettings from "@/components/CookieSettings";
import { getClientDictionary } from "@/lib/client-dictionaries";

export default function Footer({ lang = "en" }) {
  const [dict, setDict] = useState(null);

  useEffect(() => {
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  if (!dict) return null;
  return (
    <footer className="bg-primary-navy max-w-full px-4 lg:px-12 pt-10  pb-8 border-t border-white/10">
      <div className=" mx-auto px-4 max-w-8xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4 flex flex-col">
              <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-3 text-white"
              >
                <Image
                  src="/logo/logo3.png"
                  alt="FootballBank International"
                  width={48}
                  height={48}
                  className="size-12 object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-heading text-2xl font-semibold tracking-tight">
                    FootballBank
                  </span>
                  <h3 className="text-[8px] md:text-[10px] tracking-[0.15em] text-primary-accent">
                    INTERNATIONAL
                  </h3>
                </div>
              </Link>
              <div>
                <span className="text-primary-muted text-[12px]">
                  {" "}
                  {dict.footer.poweredBy}{" "}
                </span>{" "}
                <span className="text-gray-400 font-bold text-sm inline-block cursor-pointer">
                  Dojoglo&Fam
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-6">{dict.footer.description}</p>

            <div className="flex space-x-4">
              {/** SOCIAL MEDIA LINKS */}
              <Link
                href="https://x.com/footballbankhq?s=21&t=Ihzjw_SrtnHA4qE0nkgFfg"
                className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
              >
                <i className="fa-brands fa-twitter text-xl" />
              </Link>
              <Link
                href="https://www.instagram.com/footballbank.soccer"
                className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
              >
                <i className="fa-brands fa-instagram text-xl" />
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=61580081775450"
                className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
              >
                <i className="fa-brands fa-facebook-f text-xl" />
              </Link>
              <Link
                href="http://www.youtube.com/@footballbank.soccer"
                className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
              >
                <i className="fa-brands fa-youtube text-xl" />
              </Link>
              <Link
                href="http://www.tiktok.com/@footballbank.soccer"
                className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
              >
                <i className="fa-brands fa-tiktok text-xl" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className=" font-semibold text-lg mb-4 text-white">
              {dict.footer.quickLinks}
            </h3>
            <ul className="flex flex-col space-y-2">
              {[
                { title: dict.footer.home, href: `/${lang}` },
                { title: dict.footer.players, href: `/${lang}/players` },
                {
                  title: dict.navigation.clubsAndScouts || "Clubs & Scouts",
                  href: `/${lang}/clubs-scouts`,
                },
                {
                  title: dict.navigation.representation || "Representation",
                  href: `/${lang}/agent`,
                },
                {
                  title: dict.footer.submitProfile,
                  href: `/${lang}/submit-profile`,
                },
                { title: dict.footer.aboutUs, href: `/${lang}/about` },
              ].map((link) => (
                <Link
                  data-aos="fade-up"
                  href={link.href}
                  key={link.title}
                  className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
                >
                  {link.title}
                </Link>
              ))}
            </ul>
          </div>

          <div>
            <h3 className=" font-semibold text-lg mb-4 text-white">
              {dict.footer.resources}
            </h3>
            <ul className="flex flex-col space-y-2">
              {[
                { title: dict.footer.blog, href: `/${lang}/blog` },
                { title: dict.footer.careerTips, href: `/${lang}/career-tips` },
                { title: dict.footer.faq, href: `/${lang}/faq` },
              ].map((link) => (
                <Link
                  data-aos="fade-up"
                  href={link.href}
                  key={link.title}
                  className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
                >
                  {link.title}
                </Link>
              ))}
            </ul>
          </div>

          <div>
            <h3 className=" font-semibold text-lg mb-4 text-white">
              {dict.footer.contact}
            </h3>
            <ul className="flex flex-col space-y-2">
              <li className="text-gray-400">
                <a
                  href="mailto:contact@footballbank.soccer"
                  className="hover:text-primary-action transition-colors"
                >
                  contact@footballbank.soccer
                </a>
              </li>
              <li className="text-gray-400">
                <a
                  href="tel:+18443629881"
                  className="hover:text-primary-action transition-colors"
                >
                  +(844) 362-9881 (Toll Free)
                </a>
              </li>
              <li>
                <Link
                  href={`/${lang}/privacy-policy`}
                  className="text-gray-400 hover:text-primary-action transition-colors"
                >
                  {dict.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms-of-service`}
                  className="text-gray-400 hover:text-primary-action transition-colors"
                >
                  {dict.footer.termsOfService}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-2 text-center mb-6 sm:px-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-12">
            <div className="opacity-80 hover:opacity-100 transition-opacity duration-300 bg-white rounded-lg p-1 sm:p-2">
              <img
                src="/partners/crown-fc-nigeria-logo.png"
                alt="Crown FC"
                className="h-6 sm:h-8 md:h-10 object-contain"
              />
            </div>

            <div className="opacity-80 hover:opacity-100 transition-opacity duration-300 bg-white rounded-lg p-1 sm:p-2">
              <img
                src="/partners/Concacaf_logo.svg"
                alt="CONCACAF"
                className="h-8 sm:h-10 md:h-14 object-contain"
              />
            </div>

            <div className="opacity-80 hover:opacity-100 transition-opacity duration-300 bg-white rounded-lg p-1 sm:p-2">
              <img
                src="/partners/fifa.png"
                alt="FIFA"
                className="h-7 sm:h-9 md:h-12 object-contain"
              />
            </div>

            <div className="opacity-80 hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden">
              <img
                src="/partners/future-hero-football-academy.jpg"
                alt="Future Hero Football Academy"
                className="h-7 sm:h-9 md:h-12 object-contain"
              />
            </div>

            <div className="opacity-80 hover:opacity-100 transition-opacity duration-300 bg-white/5 rounded-lg p-1 sm:p-2">
              <img
                src="/partners/unknow.jpg"
                alt="Unknown Partner"
                className="h-7 sm:h-10 md:h-14 object-contain grayscale hover:grayscale-0"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-muted text-sm">
            © {new Date().getFullYear()} FootballBank.{" "}
            {dict.footer.allRightsReserved}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link
              href={`/${lang}/privacy-policy`}
              className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
            >
              {dict.footer.privacy}
            </Link>
            <Link
              href={`/${lang}/terms-of-service`}
              className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer"
            >
              {dict.footer.terms}
            </Link>
            <CookieSettings
              trigger={
                <span className="text-gray-400 hover:text-primary-action transition-colors cursor-pointer">
                  {dict.footer.cookies}
                </span>
              }
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
