import Link from "next/link";
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
    <footer className="bg-gray-50 max-w-full px-4 lg:px-12 pt-10 mt-20 pb-8 border-t border-divider">
      <div className=" mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex flex-col mb-4 ">
              <Link
                href={`/${lang}`}
                className="font-bold text-2xl inline-block cursor-pointer text-gray-600 "
              >
                FootballBank
                <span className="text-accent-red text-base"> .soccer</span>
              </Link>
              <div>
                <span className="text-primary-muted text-[12px]">
                  {" "}
                  {dict.footer.poweredBy}{" "}
                </span>{" "}
                <span className="text-primary-muted font-bold text-sm inline-block cursor-pointer">
                  Dojoglo&Fam
                </span>
              </div>
            </div>
            <p className="text-primary-muted mb-6">{dict.footer.description}</p>
            <div className="flex space-x-4">
              {[
                {
                  name: "twitter",
                  href: "https://x.com/footballbankhq?s=21&t=Ihzjw_SrtnHA4qE0nkgFfg",
                },
                {
                  name: "instagram",
                  href: "https://www.instagram.com/footballbank.soccer",
                },
                {
                  name: "facebook",
                  href: "https://www.facebook.com/profile.php?id=61580081775450",
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
              {dict.footer.quickLinks}
            </h3>
            <ul className="flex flex-col space-y-2">
              {[
                { title: dict.footer.home, href: `/${lang}` },
                { title: dict.footer.players, href: `/${lang}/players` },
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
                  className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer"
                >
                  {link.title}
                </Link>
              ))}
            </ul>
          </div>
          <div>
            <h3 className=" font-semibold text-lg mb-4 text-primary-text">
              {dict.footer.resources}
            </h3>
            <ul className="flex flex-col space-y-2">
              {[
                { title: dict.footer.blog, href: `/${lang}/blog` },
                { title: dict.footer.careerTips, href: `/${lang}/career-tips` },
                { title: dict.footer.shop, href: `/${lang}/shop/products` },
                {
                  title: dict.footer.pricing,
                  href: `/${lang}/pricing`,
                },
                { title: dict.footer.faq, href: `/${lang}/faq` },
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
              {dict.footer.contact}
            </h3>
            <ul className="flex flex-col space-y-2">
              <li className="text-primary-muted">
                <a
                  href="mailto:contact@footballbank.soccer"
                  className="hover:text-accent-red transition-colors"
                >
                  contact@footballbank.soccer
                </a>
              </li>
              <li className="text-primary-muted">
                <a
                  href="tel:+18443629881"
                  className="hover:text-accent-red transition-colors"
                >
                  +(844) 362-9881 (Toll Free)
                </a>
              </li>
              <li className="text-primary-muted">
                PO BOX 7268, Newark, NJ 07107
              </li>
              <li>
                <Link
                  href={`/${lang}/privacy-policy`}
                  className="text-primary-muted hover:text-accent-red transition-colors"
                >
                  {dict.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms-of-service`}
                  className="text-primary-muted hover:text-accent-red transition-colors"
                >
                  {dict.footer.termsOfService}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="container mx-auto px-6 text-center mb-6">
          {/* Heading */}
          {/* <h2 className="text-sm font-semibold tracking-wider text-primary-muted uppercase mb-8">
            Trusted by leading football organizations and brands
          </h2> */}

          {/* Logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {/* Logo item */}
            <div className="opacity-90 hover:opacity-100 transition-opacity duration-300">
              <img
                src="/partners/amazon-ads-logo.png"
                alt="Amazon Ads"
                className="h-8 md:h-10 object-contain"
              />
            </div>

            <div className="opacity-90 hover:opacity-100 transition-opacity duration-300">
              <img
                src="/partners/Concacaf_logo.svg"
                alt="CONCACAF"
                className="h-12 md:h-14 object-contain"
              />
            </div>

            <div className="opacity-90 hover:opacity-100 transition-opacity duration-300">
              <img
                src="/partners/fifa.png"
                alt="FIFA"
                className="h-10 md:h-12 object-contain"
              />
            </div>

            <div className="opacity-90 hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden">
              <img
                src="/partners/future-hero-football-academy.jpg"
                alt="Future Hero Football Academy"
                className="h-10 md:h-12 object-contain"
              />
            </div>

            <div className="opacity-90 hover:opacity-100 transition-opacity duration-300">
              <img
                src="/partners/unknow.jpg"
                alt="Unknown Partner"
                className="h-10 md:h-14 object-contain grayscale hover:grayscale-0"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-muted text-sm">
            © {new Date().getFullYear()} FootballBank.{" "}
            {dict.footer.allRightsReserved}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <Link
              href={`/${lang}/privacy-policy`}
              className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer"
            >
              {dict.footer.privacy}
            </Link>
            <Link
              href={`/${lang}/terms-of-service`}
              className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer"
            >
              {dict.footer.terms}
            </Link>
            <CookieSettings
              trigger={
                <span className="text-primary-muted hover:text-accent-red transition-colors cursor-pointer">
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
