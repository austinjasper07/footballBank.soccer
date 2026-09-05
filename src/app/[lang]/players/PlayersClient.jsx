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
import { ArrowUpRight, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PlayersClient({ lang, dict }) {
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
    currentPage * perPage,
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <main className="relative z-10 min-h-screen w-full bg-primary-surface text-primary-text">
        <div className="mx-auto max-w-7xl px-5 sm:px-10 lg:px-12">
          {/* Page title */}
          <section className="border-b border-divider py-8 sm:py-10">
            <p className="eyebrow">The player collection</p>
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              {dict?.players?.title || "Find the profile. See the potential."}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-muted">
              {dict?.players?.subtitle || "Explore player footage and football profiles. Request the full profile through FootballBank International"}
            </p>
          </section>

          {/* Filters */}
          <section className="border-b border-divider py-2 lg:mb-3">
            <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
                <div className="flex w-full gap-3 sm:mb-0">
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-[60%] rounded-md border border-divider bg-primary-card px-4 py-3 pr-10 text-primary-text outline-none transition-colors focus:border-primary-action focus:ring-2 focus:ring-primary-action/20"
                  >
                    <option value="" className="bg-primary-card text-primary-text">
                      All Countries
                    </option>
                    {countryList.map((country) => (
                      <option
                        key={country}
                        value={country.toLowerCase()}
                        className="bg-primary-card text-primary-text"
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
                    className="w-[40%] rounded-md border border-divider bg-primary-card px-4 py-3 pr-10 text-primary-text outline-none transition-colors focus:border-primary-action focus:ring-2 focus:ring-primary-action/20"
                  >
                    <option value="" className="bg-primary-card text-primary-text">
                      All Positions
                    </option>
                    <option value="forward" className="bg-primary-card text-primary-text">
                      Forward
                    </option>
                    <option
                      value="goalkeeper"
                      className="bg-primary-card text-primary-text"
                    >
                      Goalkeeper
                    </option>
                    <option value="defender" className="bg-primary-card text-primary-text">
                      Defender
                    </option>
                    <option
                      value="midfielder"
                      className="bg-primary-card text-primary-text"
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
                  className="w-full rounded-md border border-divider bg-primary-card px-4 py-3 pl-12 text-primary-text outline-none placeholder:text-primary-muted transition-colors focus:border-primary-action focus:ring-2 focus:ring-primary-action/20"
                />
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-primary-muted" />
              </div>
            </div>
          </section>

          {/* Main content */}
          <section className=" bg-primary-bg py-5 sm:py-8">
            <div className="w-full">
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {paginatedPlayers.map((player) => {
                      const fullName = `${player.firstName} ${player.lastName}`;
                      const playerAge = player.dob
                        ? new Date().getFullYear() -
                          new Date(player.dob).getFullYear()
                        : "N/A";
                      return (
                        <article
                          key={player.id}
                          className="group overflow-hidden rounded-lg border border-divider bg-primary-card"
                        >
                          <div className="relative">
                            <Image
                              src={player.imageUrl[0]}
                              alt={player.firstName}
                              width={600}
                              height={800}
                              loading="lazy"
                              className="h-48 w-full object-scale-down bg-blue-100  rounded-t-md md:object-fill lg:object-cover sm:h-50 lg:h-54"
                            />
                            <span className="absolute top-4 left-4 rounded-sm bg-primary-navy/90 px-2.5 py-1 text-[0.6rem] tracking-[0.18em] text-primary-text-inverse uppercase">
                              {player.position}
                            </span>
                            <span className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary-card text-primary-text transition-transform group-hover:-translate-y-1">
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </div>

                          <div className="px-5 py-2">
                            <p className="text-[0.6rem] tracking-[0.18em] text-primary-muted uppercase">
                              {player.country}
                            </p>
                            <h3 className="mt-2 font-heading text-xl">
                              {player.firstName} {player.lastName}
                            </h3>

                            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-divider pt-4 text-[0.7rem] text-primary-muted">
                              <span>
                                Age:{" "}
                                {player.dob
                                  ? new Date().getFullYear() -
                                    new Date(player.dob).getFullYear()
                                  : "N/A"}
                              </span>
                              {player.foot && <span>Foot: {player.foot}</span>}
                            </div>
                            <p className="mt-2 text-[0.7rem] text-primary-muted">
                              Club &amp; availability on confirmation
                            </p>
                            <div className="mt-3 flex items-center justify-center border-t border-divider pt-2">
                              <Link
                                href={`/${lang}/players/${player.id}`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-action hover:underline"
                              >
                                {dict.homepage.featuredPlayers.viewProfile}{" "}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </Link>
                              {/* <span className="inline-flex items-center gap-1.5 text-sm text-primary-text">
                                <Play className="h-3.5 w-3.5" /> Watch
                                highlights
                              </span> */}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <Pagination className="my-12 w-full">
                    <PaginationContent className="gap-2">
                      <PaginationItem>
                          <PaginationPrevious
                          href="#"
                          className="border border-divider bg-primary-card text-primary-text hover:border-primary-action hover:bg-primary-action hover:text-primary-text-inverse transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                ? "bg-primary-action text-primary-text-inverse border-primary-action shadow-lg"
                                : "bg-primary-card border border-divider text-primary-text hover:bg-primary-action hover:text-primary-text-inverse hover:border-primary-action"
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
                          className="border border-divider bg-primary-card text-primary-text hover:border-primary-action hover:bg-primary-action hover:text-primary-text-inverse transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            );
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </section>


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

        {/* CTA SECTION*/}
          <section className="bg-secondary-bg">
            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
              <div className=" text-center lg:text-left">
                <p className="eyebrow">The next conversation matters</p>
                <h2 className="mt-5 font-heading text-4xl leading-tight text-primary-text-inverse uppercase">
                  The right talent.
                  <br />
                  The right opportunity.
                </h2>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <p className="text-sm text-primary-text-inverse/70">
                  Recruiting for a club or ready for the next step in your
                  career? Start with FootballBank.
                </p>
                <div className="mt-6 flex flex-col lg:flex-row gap-3">
                  <Button variant="action" size="lg">
                    Request a player <ArrowUpRight />
                  </Button>
                  <Button variant="onNavy" size="lg">
                    Seek representation <ArrowUpRight />
                  </Button>
                </div>
              </div>
            </div>
          </section>
      </main>
    </>
  );
}
