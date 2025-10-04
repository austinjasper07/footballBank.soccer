"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { getAffiliateProducts } from "@/actions/adminActions";
import "aos/dist/aos.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function AmazonAdMobile() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAffiliateProducts().then(setProducts);
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  // 🧩 Utility: chunk array into groups of n
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <aside className={`lg:hidden w-full border-gray-200 border-[0.4px] bg-gradient-to-b from-red-50 to-white rounded-lg shadow-lg p-3 space-y-4"`} data-aos="fade-down">
      {/* 🔥 Sidebar Title */}
      <h2 className="text-lg font-bold text-center text-red-600 tracking-wide">
        🔥 Amazon Hot Picks
      </h2>
      <p className="text-[11px] text-center text-gray-500 mb-2">
        Curated deals just for you
      </p>

      {/* 📱 Mobile & Tablet View (single swiper with groups of 3) */}
      <div className={"lg:hidden block"}>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          slidesPerView={1} // show 1 "group" per slide
          className="h-auto"
        >
          {chunkArray(products, 3).map((group, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex gap-3">
                {group.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-md shadow-md hover:shadow-lg transition overflow-hidden"
                  >
                    <img
                      src={p.image}
                      alt={p.description}
                      className="w-full h-32 object-fit"
                    />
                    <div className="p-2 text-xs">
                      <p className="line-clamp-2 text-gray-800 font-medium">
                        {p.description}
                      </p>
                      <p className="font-bold text-red-600 mt-1">
                        ${p.price}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


      {/* ⚠️ Disclaimer */}
      <p className="text-[10px] text-gray-500 text-center mt-3 p-2 border-t-[0.3px] border-gray-300">
        As an Amazon Associate I earn from qualifying purchases.
      </p>
    </aside>
  );
}

export function AmazonAdDesktop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAffiliateProducts().then(setProducts);
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  // 🧩 Utility: chunk array into groups of n
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <aside className={"hidden lg:block w-64 h-fit border-gray-200 border-[0.4px] bg-gradient-to-b from-red-50 to-white rounded-lg shadow-lg p-3 space-y-4"} data-aos="fade-down">
      {/* 🔥 Sidebar Title */}
      <h2 className="text-lg font-bold text-center text-red-600 tracking-wide">
        🔥 Amazon Hot Picks
      </h2>
      <p className="text-[11px] text-center text-gray-500 mb-2">
        Curated deals just for you
      </p>

      {/* 💻 Desktop View (stacked by category) */}
      <div className={"lg:flex lg:flex-col gap-6 hidden"}>
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat);
          return (
            <div
              key={cat}
              className="bg-white border-gray-200 border-[0.4px] rounded-md shadow-sm hover:shadow-md transition"
            >
              {/* 🏷 Category Title */}
              <h3 className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-t-md capitalize">
                {cat}
              </h3>

              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                loop
                slidesPerView={1}
                className="h-56"
              >
                {catProducts.map((p) => (
                  <SwiperSlide key={p.id}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative h-full group"
                    >
                      <img
                        src={p.image}
                        alt={p.description}
                        className="w-full h-32 object-fit"
                      />
                      <div className="p-2 text-xs">
                        <p className="line-clamp-2 text-gray-800 font-medium group-hover:text-red-600">
                          {p.description}
                        </p>
                        <p className="font-bold text-red-600 mt-1">
                          ${p.price}
                        </p>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          );
        })}
      </div>

      {/* ⚠️ Disclaimer */}
      <p className="text-[10px] text-gray-500 text-center mt-3 p-2 border-t-[0.3px] border-gray-300">
        As an Amazon Associate I earn from qualifying purchases.
      </p>
    </aside>
  );
}
