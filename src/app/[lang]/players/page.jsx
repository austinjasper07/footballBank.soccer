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
              {dict?.players?.title || "Player Portfolio"}
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
            <AmazonAdMobile />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {paginatedPlayers.map((player) => {
                      const fullName = `${player.firstName} ${player.lastName}`;
                      return (
                        <div
                          key={player.id}
                          className="bg-primary-card rounded-xl cursor-pointer overflow-hidden border border-divider hover:border-accent-red transition-colors shadow-sm hover:shadow-md"
                          onClick={() => router.push(`/players/${player.id}`)}
                        >
                          <div className="relative w-full h-[200px] sm:h-[240px] md:h-[280px] lg:h-[300px]">
                            <Image
                              src={player.imageUrl[0]}
                              alt={fullName}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                            <div className="absolute left-3 top-auto bottom-3 md:top-3 md:bottom-auto bg-primary-card/95 rounded-full px-2 py-0.5 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 shadow-sm">
                              <Image
                                src={`https://flagcdn.com/w20/${player.countryCode.toLowerCase()}.png`}
                                alt={player.country}
                                width={14}
                                height={14}
                                className="rounded-full"
                              />
                              <span className="text-primary-text">
                                {player.country}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3 bg-accent-green text-white rounded-full px-2 py-0.5 text-xs sm:text-sm font-medium">
                              Available
                            </div>
                          </div>

                          <div className="p-3 sm:p-4 md:p-6">
                            <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-primary-text">
                              {fullName}
                            </h3>
                            <div className="flex items-center justify-between mb-2 sm:mb-4">
                              <span className="bg-accent-red/10 text-accent-red px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium">
                                {player.position}
                              </span>
                              <span className="text-primary-muted text-xs sm:text-sm">
                                Age:{" "}
                                {new Date().getFullYear() -
                                  new Date(player.dob).getFullYear()}
                              </span>
                            </div>
                            <p className="text-primary-muted text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                              {player.description}
                            </p>
                            <button className="w-full bg-accent-red hover:bg-accent-red/90 text-white py-1.5 sm:py-2 rounded-md font-medium transition-colors cursor-pointer text-xs sm:text-sm">
                              View Profile
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <Pagination className="my-12">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
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

              <AmazonAdDesktop />
            </div>
          </section>

          <div className="my-4">
            <AmazonAdMobile />
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
