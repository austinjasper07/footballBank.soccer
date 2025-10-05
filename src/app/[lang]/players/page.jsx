// players/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getClientDictionary } from "@/lib/client-dictionaries";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { countryList } from "@/lib/variousCountryListFormats";
import "aos/dist/aos.css";
import { getAllPlayers } from "@/actions/publicActions";
import PlayerCarousel from "@/components/PlayerCarousel";
import { AmazonAdDesktop, AmazonAdMobile } from "@/components/AmazonAd";

export default function PlayerPortfolioPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [dict, setDict] = useState(null);
  const router = useRouter();
  const pathname = usePathname();


  // Extract language from pathname - ensure it's always a string
  const lang = pathname?.split("/")[1] || "en";

 
  useEffect(() => {
    // Load translations when lang changes
    if (lang) {
      getClientDictionary(lang).then(setDict);
    }
  }, [lang]);

  const perPage = 6;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = selectedCountry
      ? p.country.toLowerCase() === selectedCountry
      : true;
    const matchesPosition = selectedPosition
      ? p.position.toLowerCase() === selectedPosition
      : true;
    return matchesSearch && matchesCountry && matchesPosition;
  });

  const totalPages = Math.ceil(filteredPlayers.length / perPage);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Collect player images for background carousel
  const playerImages = players
    .filter((player) => player.imageUrl && player.imageUrl.length > 0)
    .slice(0, 10) // Limit to first 10 players with images
    .map((player) => player.imageUrl[0]); // Take first image from each player

  return (
    <>
      <main className="relative z-10 min-h-screen py-8">
        {/* Background Carousel - Covers entire main content area */}
        {playerImages.length > 0 && (
          <div className="absolute inset-0 z-0 w-screen left-1/2 transform -translate-x-1/2">
            <PlayerCarousel images={playerImages} interval={6000} />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
          {/* Page title */}
          <section className="py-8 text-center">
            <h1 className="font-bold text-[clamp(1.2rem,2.5vw,2.5rem)] mb-4 text-white drop-shadow-lg">
              {dict?.players?.title || "Talent Showcase"}
            </h1>
          </section>

          {/* Filters */}
          <section className="py-8 bg-white/10 backdrop-blur-md border-y border-white/20 lg:mb-6">
            <div className="w-full px-2 sm:px-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="flex gap-4 mb-4 sm:mb-0 w-full">
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-white/20 border border-white/30 text-white placeholder-white/70 px-4 py-3 pr-10 rounded-md w-[60%] backdrop-blur-sm"
                  >
                    <option value="" className="bg-gray-800 text-white">
                      All Countries
                    </option>
                    {countryList.map((country) => (
                      <option
                        key={country}
                        value={country.toLowerCase()}
                        className="bg-gray-800 text-white"
                      >
                        {country}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedPosition}
                    onChange={(e) => {
                      setSelectedPosition(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-white/20 border border-white/30 text-white placeholder-white/70 px-4 py-3 pr-10 rounded-md w-[40%] backdrop-blur-sm"
                  >
                    <option value="" className="bg-gray-800 text-white">
                      All Positions
                    </option>
                    <option value="forward" className="bg-gray-800 text-white">
                      Forward
                    </option>
                    <option
                      value="goalkeeper"
                      className="bg-gray-800 text-white"
                    >
                      Goalkeeper
                    </option>
                    <option value="defender" className="bg-gray-800 text-white">
                      Defender
                    </option>
                    <option
                      value="midfielder"
                      className="bg-gray-800 text-white"
                    >
                      Midfielder
                    </option>
                  </select>
                </div>
              </div>

              <div className="relative w-full lg:w-80">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search players..."
                  className="w-full bg-white/20 border border-white/30 text-white placeholder-white/70 px-4 py-3 pl-12 rounded-md backdrop-blur-sm"
                />
                <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
              </div>
            </div>
          </section>

          {/* Mobile ad after filters */}
          <div className="my-4">
            <AmazonAdMobile lang={lang} />
          </div>
          

          {/* Main content */}
          <section className="py-8 sm:py-16 bg-white/5 backdrop-blur-md rounded-lg px-3 sm:px-6">
            <div className="grid lg:grid-cols-[3fr_1fr] gap-4 lg:gap-8">
              {loading ? (
                <div className="text-center text-primary-muted">
                  Loading players...
                </div>
              ) : paginatedPlayers.length === 0 ? (
                <div className="text-center text-primary-muted">
                  No players found.
                </div>
              ) : (
                <div>
                  {/* Player cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {paginatedPlayers.map((player) => {
                      const fullName = `${player.firstName} ${player.lastName}`;
                      const playerAge = player.dob ? new Date().getFullYear() - new Date(player.dob).getFullYear() : 'N/A';
                      return (
                        <div
                          key={player.id}
                          className="group relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-3xl cursor-pointer"
                          onClick={() => router.push(`/${lang}/players/${player.id}`)}
                        >
                          {/* Full Player Image */}
                          <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
                            <Image
                              src={player.imageUrl[0]}
                              alt={fullName}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            {/* Country Badge */}
                            <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2 shadow-lg">
                              <Image
                                src={`https://flagcdn.com/w20/${player.countryCode.toLowerCase()}.png`}
                                alt={player.country}
                                width={16}
                                height={16}
                                className="rounded-full"
                              />
                              <span>{player.country}</span>
                            </div>
                            
                            {/* Available Badge */}
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                              Available
                            </div>
                            
                            {/* Player Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                                {fullName}
                              </h3>
                              
                              {/* Player Stats */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                  {player.position}
                                </span>
                                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                  Age: {playerAge}
                                </span>
                                {player.foot && (
                                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                    {player.foot}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Card Content */}
                          <div className="p-4 lg:p-6 space-y-4">
                            <p className="text-blue-200 text-sm leading-relaxed line-clamp-3">
                              {player.description?.slice(0, 120)}...
                            </p>
                            
                            <button className="group/btn inline-flex items-center w-full justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base shadow-lg">
                              View Profile
                              <svg className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <Pagination className="my-12">
                    <PaginationContent className="gap-2">
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) => Math.max(prev - 1, 1));
                          }}
                        />
                      </PaginationItem>

                      {pageNumbers.map((num) => (
                        <PaginationItem key={num}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === num}
                            className={`${
                              currentPage === num
                                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 shadow-lg"
                                : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white"
                            } transition-all duration-300 font-semibold`}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(num);
                            }}
                          >
                            {num}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            );
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              {/* Mobile ad after pagination */}

              {/* <AmazonAdMobile /> */}

              {/* Right Sidebar Ads (desktop only) */}

              <AmazonAdDesktop lang={lang} />
            </div>
          </section>

          <div className="my-4">
            <AmazonAdMobile lang={lang} />
          </div>

          {/* Animation styles */}
          <style jsx global>{`
            @keyframes dropdown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-dropdown {
              animation: dropdown 0.6s ease-out forwards;
            }
          `}</style>
        </div>
      </main>
    </>
  );
}
