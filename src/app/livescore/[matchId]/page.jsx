"use client";
import React, { useState } from "react";

export default function MatchDetails() {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Lineups":
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
              <h3 className="font-poppins font-semibold text-lg mb-6 text-primary-text">
                Starting XI
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-sm text-red-600 mb-3">
                    Manchester United
                  </h4>
                  <div className="space-y-2">
                    {[
                      { num: 1, name: "A. Onana" },
                      { num: 20, name: "D. Dalot" },
                      { num: 6, name: "L. Martinez" },
                      { num: 5, name: "H. Maguire" },
                      { num: 23, name: "L. Shaw" },
                    ].map((p, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                          {p.num}
                        </span>
                        <span className="text-sm text-primary-text">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-blue-600 mb-3">
                    Chelsea
                  </h4>
                  <div className="space-y-2">
                    {[
                      { num: 1, name: "R. Sanchez" },
                      { num: 27, name: "M. Gusto" },
                      { num: 2, name: "A. Disasi" },
                      { num: 6, name: "T. Silva" },
                      { num: 21, name: "B. Chilwell" },
                    ].map((p, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {p.num}
                        </span>
                        <span className="text-sm text-primary-text">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Events":
        return (
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-poppins font-semibold text-xl mb-6 text-primary-text">
              Match Events
            </h3>
            <div className="space-y-4">
              {[
                {
                  minute: "78'",
                  event: "GOAL! Marcus Rashford",
                  team: "Manchester United",
                  icon: "fa-futbol",
                  bg: "bg-accent-green",
                },
                {
                  minute: "65'",
                  event: "Yellow Card - N. Jackson",
                  team: "Chelsea",
                  icon: "fa-square",
                  bg: "bg-accent-amber",
                },
                {
                  minute: "52'",
                  event: "GOAL! Bruno Fernandes",
                  team: "Manchester United",
                  icon: "fa-futbol",
                  bg: "bg-accent-green",
                },
                {
                  minute: "34'",
                  event: "GOAL! Cole Palmer",
                  team: "Chelsea",
                  icon: "fa-futbol",
                  bg: "bg-accent-green",
                },
              ].map((e, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 text-center">
                    <span className="text-sm font-medium text-primary-text">
                      {e.minute}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${e.bg} rounded-full flex items-center justify-center`}
                    >
                      <i className={`fa-solid ${e.icon} text-white text-sm`} />
                    </div>
                    <div>
                      <p className="font-medium text-primary-text">{e.event}</p>
                      <p className="text-sm text-primary-muted">{e.team}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Stats":
        return (
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-poppins font-semibold text-xl mb-6 text-primary-text">
              Match Statistics
            </h3>
            <div className="space-y-6">
              {[
                {
                  label: "Possession",
                  teamA: "58%",
                  teamB: "42%",
                  widthA: "58%",
                  widthB: "42%",
                },
                {
                  label: "Shots",
                  teamA: "12",
                  teamB: "8",
                  widthA: "60%",
                  widthB: "40%",
                },
                {
                  label: "Shots on Target",
                  teamA: "7",
                  teamB: "3",
                  widthA: "70%",
                  widthB: "30%",
                },
                {
                  label: "Corners",
                  teamA: "4",
                  teamB: "6",
                  widthA: "40%",
                  widthB: "60%",
                },
                {
                  label: "Fouls",
                  teamA: "9",
                  teamB: "11",
                  widthA: "45%",
                  widthB: "55%",
                },
              ].map((stat, idx) => (
                <div key={idx} className="stat-row">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary-text">
                      {stat.teamA}
                    </span>
                    <span className="text-sm text-primary-muted">
                      {stat.label}
                    </span>
                    <span className="font-medium text-primary-text">
                      {stat.teamB}
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full">
                    <div
                      className="absolute left-0 top-0 h-full bg-red-600 rounded-l-full"
                      style={{ width: stat.widthA }}
                    ></div>
                    <div
                      className="absolute right-0 top-0 h-full bg-blue-600 rounded-r-full"
                      style={{ width: stat.widthB }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="bg-primary-bg min-h-screen">
      {false ? (
        <>
          {/* Match Header */}
          <section id="match-header" className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl p-6 md:p-8 border border-border shadow-lg">
                  <div className="text-center mb-6">
                    <span className="text-sm text-primary-muted">
                      Premier League • Matchday 15
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    {/* Team A */}
                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-lg md:text-xl">
                          MU
                        </span>
                      </div>
                      <h2 className="font-poppins font-semibold text-lg md:text-xl text-accent-blue">
                        Manchester United
                      </h2>
                    </div>

                    {/* Score & Status */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="bg-accent-red text-white text-xs px-3 py-1 rounded-full animate-pulse">
                          LIVE
                        </span>
                        <span className="text-sm text-primary-muted">
                          78&apos;
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <span className="font-poppins font-bold text-4xl md:text-5xl text-primary-text">
                          2
                        </span>
                        <span className="text-primary-muted text-2xl">-</span>
                        <span className="font-poppins font-bold text-4xl md:text-5xl text-primary-text">
                          1
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-primary-muted">
                          Old Trafford
                        </p>
                      </div>
                    </div>

                    {/* Team B */}
                    <div className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold text-lg md:text-xl">
                          CHE
                        </span>
                      </div>
                      <h2 className="font-poppins font-semibold text-lg md:text-xl text-accent-blue">
                        Chelsea
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <section
            id="match-tabs"
            className="sticky top-16 md:top-18 z-40 bg-white border-b border-border"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <nav className="flex overflow-x-auto">
                  {[
                    "Overview",
                    "Lineups",
                    "Events",
                    "Stats",
                    "Head-to-Head",
                  ].map((tab, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(tab)}
                      className={`tab-btn px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? "border-accent-blue text-accent-blue"
                          : "border-transparent text-primary-muted hover:text-primary-text"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </section>

          {/* Match Content */}
          <section id="match-content" className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">{renderTabContent()}</div>
            </div>
          </section>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-2xl font-bold">Coming Soon</p>
        </div>
      )}
    </main>
  );
}
