"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { getAffiliateProducts } from "@/actions/adminActions";
import { getClientDictionary } from "@/lib/client-dictionaries";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function AmazonAdMobile({ lang = "en" }) {
  const [products, setProducts] = useState([]);
  const [dict, setDict] = useState(null);

  useEffect(() => {
    getAffiliateProducts().then(setProducts);
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  const categories = [...new Set((products || []).map((p) => p.category))];

  // 🧩 Utility: chunk array into groups of n
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <aside className="lg:hidden w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-xl border border-slate-200/50 p-6 space-y-6" data-aos="fade-up">
      {/* 🔥 Modern Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">🔥</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {dict?.amazonAds?.title || "Amazon Deals"}
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          {dict?.amazonAds?.subtitle || "Handpicked products for football enthusiasts"}
        </p>
      </div>

      {/* 📱 Mobile Product Grid */}
      <div className="lg:hidden block">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-orange-500 !opacity-50',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-red-500 !opacity-100'
          }}
          loop
          slidesPerView={1}
          className="h-auto"
        >
          {chunkArray(products || [], 3).map((group, idx) => (
            <SwiperSlide key={idx}>
              <div className="grid grid-cols-3 gap-3">
                {group.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-slate-100"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.description}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Deal
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-red-600">
                          ${p.price}
                        </span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ⚠️ Modern Disclaimer */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <span className="font-semibold text-slate-600">{dict?.amazonAds?.disclosureLabel || "Affiliate Disclosure:"}</span> {dict?.amazonAds?.disclosureText || "We earn from qualifying purchases."}
        </p>
      </div>
    </aside>
  );
}

export function AmazonAdDesktop({ lang = "en" }) {
  const [products, setProducts] = useState([]);
  const [dict, setDict] = useState(null);

  useEffect(() => {
    getAffiliateProducts().then(setProducts);
    getClientDictionary(lang).then(setDict);
  }, [lang]);

  const categories = [...new Set((products || []).map((p) => p.category))];

  return (
    <aside className="hidden lg:block w-80 h-fit bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-xl border border-slate-200/50 p-6 space-y-6" data-aos="fade-left">
      {/* 🔥 Modern Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">🔥</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {dict?.amazonAds?.title || "Amazon Deals"}
          </h2>
        </div>
        <p className="text-sm text-slate-600">
          {dict?.amazonAds?.subtitle || "Curated products for football fans"}
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto"></div>
      </div>

      {/* 💻 Desktop Product Categories */}
      <div className="space-y-4">
        {(categories || []).slice(0, 3).map((cat) => {
          const catProducts = (products || []).filter((p) => p.category === cat);
          return (
            <div
              key={cat}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
            >
              {/* 🏷 Modern Category Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3">
                <h3 className="text-sm font-bold capitalize flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  {cat}
                </h3>
              </div>

              <Swiper
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                loop
                slidesPerView={1}
                className="h-32 relative"
              >
                {catProducts.map((p) => (
                  <SwiperSlide key={p.id}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative h-full group p-3"
                    >
                      <div className="flex gap-3 h-full">
                        <div className="flex-shrink-0">
                          <img
                            src={p.image}
                            alt={p.description}
                            className="w-16 h-16 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                            {p.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-red-600">
                              ${p.price}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">In Stock</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xs">★</span>
                              ))}
                            </div>
                            <span className="text-xs text-slate-500">4.8</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          );
        })}
      </div>

      {/* 🎯 Call to Action */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
        <div className="text-center space-y-2">
          <h4 className="text-sm font-bold text-slate-800">{dict?.amazonAds?.ctaTitle || "More Deals Available"}</h4>
          <p className="text-xs text-slate-600">{dict?.amazonAds?.ctaSubtitle || "Discover exclusive offers on Amazon"}</p>
          <a 
            href="https://amazon.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>{dict?.amazonAds?.ctaButton || "Shop Now"}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* ⚠️ Modern Disclaimer */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <span className="font-semibold text-slate-600">{dict?.amazonAds?.disclosureLabel || "Affiliate Disclosure:"}</span> {dict?.amazonAds?.disclosureText || "We earn from qualifying purchases."}
        </p>
      </div>
    </aside>
  );
}

// Default export that combines both components
export default function AmazonAd({ lang = "en", displayInContent = false }) {
  return (
    <>
      <AmazonAdMobile lang={lang} />
      <AmazonAdDesktop lang={lang} />
    </>
  );
}