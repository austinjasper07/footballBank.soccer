


"use client";

import AmazonAd from "@/components/AmazonAd";
import LiveScoresSkeleton from "./components/LiveScoresSkeleton";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LiveScores() {
  const [matches, setMatches] = useState({ live: [], finished: [], scheduled: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("LIVE");
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 1024) {
      setIsLargeScreen(true);
    }
  }, []);

  // Fetch matches
  useEffect(() => {
    async function fetchScores() {
      try {
        const res = await fetch("/api/livescore");
        const data = await res.json();
        console.log(data)

        if (data.success) {
          setMatches(data.matches);
        }
      } catch (err) {
        console.error("Failed to load scores", err);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  // Pick matches for current tab
  const filteredMatches =
    filter === "ALL"
      ? [...matches.live, ...matches.finished, ...matches.scheduled]
      : matches[filter.toLowerCase()] || [];

  // Apply league filter
  const leagueFiltered = selectedLeague
    ? filteredMatches.filter((m) => m.competition === selectedLeague)
    : filteredMatches;

  // Unique leagues
  const leagues = [
    ...new Set(
      [...matches.live, ...matches.finished, ...matches.scheduled].map(
        (m) => m.competition
      )
    ),
  ].sort();

  // Group matches by competition
  const grouped = leagueFiltered.reduce((acc, match) => {
    if (!acc[match.competition]) acc[match.competition] = [];
    acc[match.competition].push(match);
    return acc;
  }, {});

  // Fake ad component
  const AdBlock = ({ label }) => (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-center py-6 rounded-md shadow-sm">
      <p className="text-sm font-semibold">Advertisement</p>
      <p className="text-xs">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-56 bg-white border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-3 text-gray-700">📌 Leagues</h2>
        <ul className="space-y-2 text-sm">
          <li
            onClick={() => setSelectedLeague(null)}
            className={`cursor-pointer hover:text-red-600 ${
              selectedLeague === null ? "text-red-600 font-bold" : ""
            }`}
          >
            All Leagues
          </li>
          {leagues.map((league) => (
            <li
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`cursor-pointer hover:text-red-600 ${
                selectedLeague === league ? "text-red-600 font-bold" : ""
              }`}
            >
              {league}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <h1 className="text-lg lg:text-2xl font-bold text-red-600 mb-4">Live Scores</h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4 lg:mb-6 overflow-x-scroll">
          {["ALL", "LIVE", "FINISHED", "SCHEDULED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1 rounded-md font-medium text-xs md:text-sm ${
                filter === tab
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Matches */}
        {loading ? (
          <LiveScoresSkeleton />
        ) : Object.keys(grouped).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(grouped).map(([competition, compMatches], index) => (
              <div key={competition} className="space-y-4">
                <div className="bg-white rounded-md shadow-sm">
                  {/* Competition Header */}
                  <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
                    <h2 className="text-sm font-semibold text-gray-700">
                      {competition}
                    </h2>
                    <a
                      href="#"
                      className="text-xs text-red-600 hover:underline font-medium"
                    >
                      Live Standings
                    </a>
                  </div>

                  {/* Match Rows */}
                  <div>
                    {compMatches.map((match) => (
                      <Link href={`/livescore/match/${match.id}`} key={match.id}>
                        <div className="flex items-center justify-between px-4 py-3 border-b hover:bg-gray-50 transition">
                          {/* Time */}
                          <div className="w-12 text-sm font-bold text-red-600">
                            {match.time}
                            {match.status === "LIVE" ? "'" : ""}
                          </div>

                          {/* Teams */}
                          <div className="flex-1 flex flex-col text-sm">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center space-x-2">
                                {match.home.logo ? (
                                  <img
                                    src={match.home.logo}
                                    alt={match.home.name}
                                    className="w-5 h-5"
                                  />
                                ) : (
                                  <div className="w-5 h-5 bg-gray-300 rounded-sm flex items-center justify-center text-[10px] font-bold text-gray-600">
                                    {match.home.name?.charAt(0)}
                                  </div>
                                )}
                                <span>{match.home.name}</span>
                              </span>
                              <span className="font-bold text-gray-800">
                                {match.home.score}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="flex items-center space-x-2">
                                {match.away.logo ? (
                                  <img
                                    src={match.away.logo}
                                    alt={match.away.name}
                                    className="w-5 h-5"
                                  />
                                ) : (
                                  <div className="w-5 h-5 bg-gray-300 rounded-sm flex items-center justify-center text-[10px] font-bold text-gray-600">
                                    {match.away.name?.charAt(0)}
                                  </div>
                                )}
                                <span>{match.away.name}</span>
                              </span>
                              <span className="font-bold text-gray-800">
                                {match.away.score}
                              </span>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="w-14 text-right">
                            {match.status === "LIVE" && (
                              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                                LIVE
                              </span>
                            )}
                            {match.status === "SCHEDULED" && (
                              <span className="text-xs bg-gray-500 text-white px-2 py-0.5 rounded">
                                UPCOMING
                              </span>
                            )}
                            {match.status === "FINISHED" && (
                              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                                FT
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile + md ads: insert after every few competitions */}
                {index % 2 === 1 && (
                  <div className="my-4 w-full">
                    <AmazonAd displayInContent={isLargeScreen}/>
                  </div>
                  
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No matches available</p>
        )}
      </main>

      {/* Right Sidebar Ads (desktop only) */}
      <aside className="hidden lg:block w-64 border-l p-4 space-y-4">
        <AmazonAd />
        {/* <AdBlock /> */}
        {/* <AmazonAd /> */}
        
        
      </aside>
    </div>
  );
}
