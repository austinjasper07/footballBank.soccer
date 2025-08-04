"use client";
import React from "react";

export default function ExplorePlayersBtn() {
  const scrollToPlayers = () => {
    const el = document.getElementById("players");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button
      onClick={scrollToPlayers}
      className="bg-[#1F6FEB] text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      Explore Players
    </button>
  );
}
