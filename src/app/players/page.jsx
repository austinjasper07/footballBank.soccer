// players/page.tsx``

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function PlayerPortfolioPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const router = useRouter();
  const perPage = 6;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
        console.log(data)
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

  return (
    <main className="container mx-auto px-4">
      <section className="py-10 text-center">
        <h1 className=" font-bold text-[clamp(1.2rem,2.5vw,2.5rem)] mb-4 text-primary-text/80">
          Player Portfolio
        </h1>
        <p className="text-primary-muted text-base md:text-lg max-w-2xl mx-auto">
          Discover talented football players from around the world. Find your
          next signing or explore career opportunities.
        </p>
      </section>

      <section className="py-8 bg-primary-card border-y border-divider">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex gap-4 mb-4 sm:mb-0 w-full">
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-primary-card border border-divider text-primary-text px-4 py-3 pr-10 rounded-md w-[60%]"
              >
                <option value="" className="text-primary-muted/70">All Countries</option>
                {countryList.map((country) => (
                  <option key={country} value={country.toLowerCase()} className="">
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
                className="bg-primary-card border border-divider text-primary-text px-4 py-3 pr-10 rounded-md w-[40%]"
              >
                <option value="">All Positions</option>
                <option value="forward">Forward</option>
                <option value="goalkeeper">Goalkeeper</option>
                <option value="defender">Defender</option>
                <option value="midfielder">Midfielder</option>
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
              className="w-full bg-primary-card border border-divider text-primary-text px-4 py-3 pl-12 rounded-md"
            />
            <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-muted" />
          </div>
        </div>
      </section>

      <section className="py-16">
        {loading ? (
          <div className="text-center text-primary-muted">
            Loading players...
          </div>
        ) : paginatedPlayers.length === 0 ? (
          <div className="text-center text-primary-muted">
            No players found.
          </div>
        ) : (
          <>
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPlayers.map((player) => {
                const fullName = `${player.firstName} ${player.lastName}`;
                return (
                  <div
                    key={player.id}
                    className="bg-primary-card rounded-xl cursor-pointer overflow-hidden border border-divider hover:border-accent-red transition-colors shadow-sm hover:shadow-md"
                    onClick={() => router.push(`/players/${player.id}`)}
                  >
                    <div className="relative w-full h-[320px]">
                      <Image
                        src={player.imageUrl[0]}
                        alt={fullName}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute top-4 left-4 bg-primary-card/95 rounded-full px-3 py-1 text-sm flex items-center gap-2 shadow-sm">
                        <Image
                          src={`https://flagcdn.com/w20/${player.countryCode.toLowerCase()}.png`}
                          alt={player.country}
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                        <span className="text-primary-text">
                          {player.country}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 bg-accent-green text-white rounded-full px-3 py-1 text-sm font-medium">
                        Available
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className=" font-semibold text-xl mb-2 text-primary-text">
                        {fullName}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-accent-red/10 text-accent-red px-3 py-1 rounded-full text-sm font-medium">
                          {player.position}
                        </span>
                        <span className="text-primary-muted text-sm">
                          Age:{" "}
                          {new Date().getFullYear() -
                            new Date(player.dob).getFullYear()}
                        </span>
                      </div>
                      <p className="text-primary-muted text-sm mb-4 line-clamp-4">
                        {player.description}
                      </p>
                      <button className="w-full bg-accent-red hover:bg-accent-red/90 text-white py-2 rounded-md font-medium transition-colors cursor-pointer">
                        View Profile
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination className="mt-12">
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </section>
    </main>
  );
}
