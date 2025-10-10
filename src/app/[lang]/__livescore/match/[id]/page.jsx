"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import AmazonAd from "@/components/AmazonAd";
import MatchSkeleton from "../../components/MatchSkeleton";

const TABS = ["Events", "Statistics", "Lineups", "Head2Head"];

export default function MatchPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [lineups, setLineups] = useState(null);
  const [h2h, setH2h] = useState(null);

  const [activeTab, setActiveTab] = useState("Events");
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 1024) {
      setIsLargeScreen(true);
    }
  }, []);

  // ✅ fetch events + base match info
  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/livescore/match/${id}`, {
        cache: "no-store",
      });
      const data = await res.json();

      setMatch(data.data?.match);
      setEvents(data.data?.event || []);
    } catch (err) {
      console.error("Failed to load match", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchMatch();
    const interval = setInterval(fetchMatch, 30000);
    return () => clearInterval(interval);
  }, [id]);

  // ✅ fetch additional data depending on tab
  useEffect(() => {
    if (!match) return;

    const fetchExtra = async () => {
      setTabLoading(true);
      try {
        if (activeTab === "Statistics") {
          const res = await fetch(`/api/livescore/match/${id}/stats`);
          const data = await res.json();
          setStats(data.data);
        }
        if (activeTab === "Lineups") {
          const res = await fetch(`/api/livescore/match/${id}/lineups`);
          const data = await res.json();
          // console.log(data)
          setLineups(data.data);
        }
        // if (activeTab === "Head2Head") {
        //   const res = await fetch(
        //     `/api/match/${id}/h2h?home_id=${match.home_id || match.home?.id}&away_id=${match.away_id || match.away?.id}`
        //   );
        //   setH2h(await res.json());
        // }
      } catch (err) {
        console.error(`Failed to load ${activeTab}`, err);
      } finally {
        setTabLoading(false);
      }
    };

    if (activeTab !== "Events") fetchExtra();
  }, [activeTab, match]);

  if (loading) return <MatchSkeleton />;
  if (!match)
    return <div className="p-8 text-center text-red-500">Match not found</div>;

  // Group events
  const groupedEvents = {
    "1ST HALF": events.filter((e) => parseInt(e.time) <= 45),
    "2ND HALF": events.filter((e) => parseInt(e.time) > 45),
  };

  // Event renderer
  const renderEventText = (ev) => {
    if (ev.event === "GOAL") {
      return (
        <span className="text-green-600 font-semibold">⚽ {ev.player}</span>
      );
    }
    if (ev.event.includes("YELLOW")) return <span>🟨 {ev.player}</span>;
    if (ev.event.includes("RED")) return <span>🟥 {ev.player}</span>;
    if (ev.event === "SUBSTITUTION") {
      return (
        <span className="flex items-center">
          <div className="mr-4">
            <FaArrowLeft className="text-accent-red" />
            <FaArrowRight className="text-accent-green" />
          </div>
          <div className="font-semibold flex flex-col">
            <span>{ev.info}</span> <span>{ev.player}</span>
          </div>
        </span>
      );
    }
    return <span>{ev.player}</span>;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Main Content */}
      <div className="flex-1">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-4">
          ⚽ Football &gt; {match.competition?.name}
        </div>

        {/* Match Summary */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            {/* Home */}
            <div className="flex flex-col items-center w-1/3">
              {(match?.home?.logo || match?.home_logo) && (
                <Image
                  src={match.home?.logo || match.home_logo}
                  alt={match.home_name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              )}
              <div className="text-sm lg:text-lg font-semibold">{match.home_name}</div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center">
              <span className="text-gray-500 text-xs md:text-sm">{match.date}</span>
              <span className="text-xl md:text-2xl font-bold my-2">{match.score}</span>
              <span className="text-red-600 text-sm font-semibold">
                {match.time} <span className="animate-pulse font-bold">'</span>
              </span>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center w-1/3">
              {(match?.away?.logo || match?.away_logo) && (
                <Image
                  src={match.away?.logo || match.away_logo}
                  alt={match.away_name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              )}
              <div className="text-sm lg:text-lg font-semibold">{match.away_name}</div>
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-500 text-center my-2">
            {match.location}
          </div>
        </div>
        {/* Ads Placement */}
        <div className="lg:hidden my-4">
          <AmazonAd lang={lang} />
        </div>

        {/* Tabs */}
        <div>
          <div className="flex border-b mb-4 overflow-x-scroll">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px font-semibold ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow p-6">
            {activeTab === "Events" && (
              <div>
                {Object.entries(groupedEvents)?.map(([half, evs]) => (
                  <div key={half} className="mb-6">
                    <h3 className="font-bold text-gray-700 mb-3">{half}</h3>

                    {evs.length === 0 ? (
                      <p className="text-gray-500 text-sm">No events</p>
                    ) : (
                      <ul className="space-y-3">
                        {evs.map((ev) => (
                          <li
                            key={ev.id}
                            className="flex items-center justify-between text-sm border-b pb-2"
                          >
                            <span className="text-gray-600 w-10">
                              {ev.time}'
                            </span>
                            <span className="flex-1 px-2">
                              {renderEventText(ev)}
                            </span>
                            <span className="text-gray-600 w-24 text-right">
                              {ev.home_away === "h"
                                ? match.home_name
                                : match.away_name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {half.toLowerCase().includes("1st") && (
                      <div className="my-6">
                        <AmazonAd lang={lang} displayInContent={isLargeScreen} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Statistics" && (
              <div>
                <h2 className="font-bold mb-4">Statistics</h2>
                {!stats ? (
                  <p className="text-gray-500">Loading…</p>
                ) : (
                  <table className="min-w-full border border-gray-300 text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-300">
                          Stat
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300">
                          Home
                        </th>
                        <th className="px-4 py-2 border-b border-gray-300">
                          Away
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stats || {}).map(([key, value], idx) => {
                        let home, away;
                        let formattedKey = key
                          .replace(/_/g, " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ");

                        if (typeof value === "string" && value.includes(":")) {
                          [home, away] = value.split(":");
                        } else if (
                          typeof value === "object" &&
                          value !== null
                        ) {
                          home = value.home;
                          away = value.away;
                        } else {
                          home = 0;
                          away = 0;
                        }

                        return (
                          <tr
                            key={key}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-2 border-b border-gray-200 font-medium text-gray-700">
                              {formattedKey}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200 text-center font-semibold text-blue-600">
                              {formattedKey.includes("Possesion") ||
                              formattedKey.includes("Attack")
                                ? home + "%"
                                : home}
                            </td>
                            <td className="px-4 py-2 border-b border-gray-200 text-center font-semibold text-red-600">
                              {formattedKey.includes("Possesion") ||
                              formattedKey.includes("Attack")
                                ? away + "%"
                                : away}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "Lineups" && (
              <div>
                <h2 className="font-bold mb-4">Lineups</h2>
                {!lineups ? (
                  <p className="text-gray-500">Loading…</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">{match.home_name}</h3>
                      <ul className="space-y-1">
                        {lineups?.home?.players.map((p) => (
                          <li key={p.id}>
                            {p.shirt_number}. {p.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{match.away_name}</h3>
                      <ul className="space-y-1">
                        {lineups?.away?.players?.map((p) => (
                          <li key={p.id}>
                            {p.shirt_number} {p.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Head2Head" && (
              <div className="flex justify-center items-center">
                {/* <h2 className="font-bold mb-4">Head to Head</h2>
                {!h2h ? (
                  <p className="text-gray-500">Loading…</p>
                ) : (
                  <ul className="space-y-2">
                    {h2h.matches.map((m) => (
                      <li
                        key={m.id}
                        className="flex justify-between border-b pb-1"
                      >
                        <span>{m.date}</span>
                        <span>
                          {m.home_name} {m.score} {m.away_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )} */}
                <p>Coming soon ...</p>
              </div>
            )}
          </div>
        </div>

        <div className="my-4 hidden lg:block">
          <AmazonAd lang={lang} displayInContent={isLargeScreen} />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-72 mt-4">
        <AmazonAd lang={lang} />
      </aside>
    </div>
  );
}
