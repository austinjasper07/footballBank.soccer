"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Calendar, Camera, Download, Mail, MapPin, Maximize2, Phone, Play, ShieldCheck, X } from "lucide-react";
import ResumeRequestForm from "./ResumeRequestForm";

const sections = ["overview", "media", "contact"];

export default function PlayerMedia({ player, canViewDetails, canDownloadResume, lang }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(null);
  const images = player.imageUrl?.length ? player.imageUrl : ["/logo/logo3.svg"];
  const videos = [player.videoPrimary, ...(player.videoAdditional || [])].filter(Boolean);
  const fullName = `${player.firstName} ${player.lastName}`;

  return (
    <main className="min-h-screen bg-primary-surface text-primary-text">
      <section className="bg-primary-navy text-primary-text-inverse">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-10 lg:px-12 lg:py-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-5 sm:gap-7">
              <div className="relative size-24 shrink-0 overflow-hidden bg-primary-text-inverse/10 sm:size-32"><Image src={images[0]} alt={fullName} fill sizes="128px" className="object-cover" /></div>
              <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-accent">Player profile</p><h1 className="mt-3 font-heading text-4xl font-semibold leading-none tracking-tight sm:text-6xl">{fullName}</h1><p className="mt-3 text-base text-primary-text-inverse/65">{player.position} <span className="mx-2 text-primary-accent">/</span> {player.country}</p></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary-text-inverse/65"><ShieldCheck className="size-4 text-primary-accent" /> FootballBank talent collection</div>
          </div>
          <div className="mt-10 grid grid-cols-2 border-t border-primary-text-inverse/15 pt-6 sm:grid-cols-3">{[["Position", player.position], ["Country", player.country], ["Access", canViewDetails ? "Approved" : "Preview"]].map(([label, value]) => <div key={label} className="border-r border-primary-text-inverse/15 px-4 first:pl-0 last:border-0 sm:px-6"><p className="text-xs uppercase tracking-[0.14em] text-primary-text-inverse/50">{label}</p><p className="mt-2 font-heading text-xl font-semibold sm:text-2xl">{value || "-"}</p></div>)}</div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-10 lg:px-12 lg:py-12">
        <nav className="flex gap-2 overflow-x-auto border-b border-divider" aria-label="Player profile sections">{sections.map((section) => <button key={section} type="button" onClick={() => setActiveSection(section)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors ${activeSection === section ? "border-primary-action text-primary-action" : "border-transparent text-primary-muted hover:text-primary-text"}`}>{section}</button>)}</nav>

        {activeSection === "overview" && <section className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"><div><p className="eyebrow">About the player</p><h2 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">A profile built for the next opportunity.</h2><p className="mt-6 max-w-2xl text-base leading-8 text-primary-muted">{canViewDetails && player.description ? player.description : "Explore the player media, then request the full profile when you are ready to take the next step."}</p>{!canViewDetails && <div className="mt-8 max-w-xl"><ResumeRequestForm playerId={player.id} lang={lang} /></div>}</div><div className="border-l border-divider pl-6 sm:pl-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-action">Profile access</p><dl className="mt-5 space-y-5 text-sm"><div><dt className="text-primary-muted">Position</dt><dd className="mt-1 font-semibold">{player.position}</dd></div><div><dt className="text-primary-muted">Country</dt><dd className="mt-1 font-semibold">{player.country}</dd></div><div><dt className="text-primary-muted">Status</dt><dd className="mt-1 font-semibold">{canViewDetails ? "Approved access" : "Media preview"}</dd></div></dl></div></section>}

        {activeSection === "media" && <section className="mt-10"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow flex items-center gap-3"><Camera className="size-4" /> Visual profile</p><h2 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">Photos and footage.</h2></div><p className="hidden text-sm text-primary-muted sm:block">Select a photo to open the gallery.</p></div><div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">{images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setSelectedImage(index)} className="group relative aspect-square overflow-hidden bg-primary-navy"><Image src={image} alt={`${fullName} photo ${index + 1}`} fill sizes="(max-width: 640px) 33vw, 16vw" className="object-cover transition-transform group-hover:scale-105" /><span className="absolute right-2 bottom-2 inline-flex size-7 items-center justify-center bg-primary-card/90 text-primary-text"><Maximize2 className="size-3.5" /></span></button>)}</div>{videos.length > 0 && <div className="mt-12 grid gap-6 lg:grid-cols-2">{videos.map((video, index) => <div key={video} className="overflow-hidden border border-divider bg-primary-card"><video src={video} controls preload="metadata" className="aspect-video w-full bg-primary-navy" /><p className="p-4 text-sm font-semibold">{index === 0 ? "Primary highlights" : `Additional video ${index}`}</p></div>)}</div>}</section>}

        {activeSection === "contact" && <section className="mt-10 max-w-3xl"><p className="eyebrow">Representation</p><h2 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">Keep the conversation moving.</h2>{canViewDetails ? <div className="mt-8 grid gap-5 border-t border-divider pt-6 sm:grid-cols-2"><Info icon={Mail} label="Email" value={player.email} /><Info icon={Phone} label="Phone" value={player.phone} /><Info icon={MapPin} label="Country" value={player.country} /><Info icon={Calendar} label="Date of birth" value={player.dob ? new Date(player.dob).toLocaleDateString() : "-"} /></div> : <div className="mt-8 max-w-xl"><ResumeRequestForm playerId={player.id} lang={lang} /></div>}</section>}

        {canViewDetails && <section className="mt-16 border-t border-divider pt-10"><p className="eyebrow">Approved profile access</p><h2 className="mt-5 font-heading text-3xl font-semibold">Player information</h2><dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">{[["Contract status", player.contractStatus || "Unavailable"], ["Available from", player.availableFrom || "Unavailable"], ["Preferred leagues", player.preferredLeagues || "Unavailable"], ["Preferred foot", player.foot || "Unavailable"]].map(([label, value]) => <div key={label} className="border-b border-divider pb-3"><dt className="text-xs uppercase tracking-[0.14em] text-primary-muted">{label}</dt><dd className="mt-2 font-semibold">{value}</dd></div>)}</dl>{canDownloadResume && <a href={`/api/players/${player.id}/resume`} className="mt-8 inline-flex items-center gap-3 bg-primary-action px-5 py-3 text-sm font-semibold text-primary-text-inverse hover:bg-primary-action-hover"><Download className="size-4" /> Download professional resume</a>}</section>}
      </div>

      {selectedImage !== null && <div className="fixed inset-0 z-9999 flex items-center justify-center bg-primary-navy/95 p-5" role="dialog" aria-modal="true" aria-label="Player photo gallery"><button type="button" onClick={() => setSelectedImage(null)} className="absolute top-5 right-5 z-10 text-primary-text-inverse hover:text-primary-accent" aria-label="Close gallery"><X className="size-8" /></button><button type="button" onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)} className="absolute left-4 z-10 text-primary-text-inverse hover:text-primary-accent" aria-label="Previous photo"><ArrowLeft className="size-8" /></button><div className="relative h-[80vh] w-full max-w-5xl"><Image src={images[selectedImage]} alt={`${fullName} photo ${selectedImage + 1}`} fill sizes="100vw" className="object-contain" priority /></div><button type="button" onClick={() => setSelectedImage((selectedImage + 1) % images.length)} className="absolute right-4 z-10 text-primary-text-inverse hover:text-primary-accent" aria-label="Next photo"><ArrowRight className="size-8" /></button></div>}
    </main>
  );
}

function Info({ icon: Icon, label, value }) { return <div className="flex items-start gap-3"><Icon className="mt-0.5 size-4 text-primary-action" /><div><p className="text-xs uppercase tracking-[0.14em] text-primary-muted">{label}</p><p className="mt-1 font-medium">{value || "-"}</p></div></div>; }
