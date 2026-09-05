"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Maximize2, Play, X } from "lucide-react";
import ResumeRequestForm from "./ResumeRequestForm";

export default function PlayerMedia({ player, canViewDetails, canDownloadResume, lang }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const images = player.imageUrl?.length ? player.imageUrl : ["/logo/logo-1.png"];
  const videos = [player.videoPrimary, ...(player.videoAdditional || [])].filter(Boolean);

  return (
    <main className="bg-primary-surface text-primary-text">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-10 lg:px-12 lg:py-16">
        <p className="eyebrow">Player media</p>
        <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          {player.firstName} {player.lastName}
        </h1>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button key={`${image}-${index}`} type="button" onClick={() => setSelectedImage(index)} className="group relative aspect-4/5 overflow-hidden border border-divider bg-primary-card text-left">
              <Image src={image} alt={`${player.firstName} ${player.lastName} photo ${index + 1}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute right-4 bottom-4 inline-flex size-10 items-center justify-center bg-primary-card text-primary-text"><Maximize2 className="size-4" aria-hidden="true" /></span>
            </button>
          ))}
        </section>

        {videos.length > 0 && (
          <section className="mt-16 border-t border-divider pt-10">
            <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">On the pitch</p><h2 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">Watch the footage.</h2></div><Play className="size-6 text-primary-accent" aria-hidden="true" /></div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {videos.map((video, index) => <div key={`${video}-${index}`} className="overflow-hidden border border-divider bg-primary-card"><video src={video} controls preload="metadata" className="aspect-video w-full bg-primary-navy" /><p className="p-4 text-sm font-semibold">{index === 0 ? "Primary highlights" : `Additional video ${index}`}</p></div>)}
            </div>
          </section>
        )}

        {canViewDetails ? (
          <section className="mt-16 border-t border-divider pt-10"><p className="eyebrow">Approved profile access</p><h2 className="mt-5 font-heading text-3xl font-semibold">Player information</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Position", player.position], ["Country", player.country], ["Height", player.height], ["Preferred foot", player.foot], ["Contract status", player.contractStatus || "Unavailable"], ["Available from", player.availableFrom || "Unavailable"], ["Preferred leagues", player.preferredLeagues || "Unavailable"], ["Salary expectation", player.salaryExpectation || "Unavailable"]].map(([label, value]) => <div key={label} className="border border-divider bg-primary-card p-5"><p className="text-xs uppercase tracking-[0.14em] text-primary-muted">{label}</p><p className="mt-2 font-semibold">{value}</p></div>)}</div>{player.description && <p className="mt-8 max-w-3xl text-base leading-7 text-primary-muted">{player.description}</p>}{canDownloadResume && player.cvUrl && <a href={`/api/players/${player.id}/resume`} className="mt-8 inline-flex items-center gap-3 bg-primary-action px-5 py-3 text-sm font-semibold text-primary-text-inverse hover:bg-primary-action-hover">Download professional resume<ArrowRight className="size-4" aria-hidden="true" /></a>}</section>
        ) : (
          <section className="mx-auto mt-16 max-w-2xl"><ResumeRequestForm playerId={player.id} lang={lang} /></section>
        )}
        {canViewDetails && !canDownloadResume && player.cvUrl && <section className="mx-auto mt-10 max-w-2xl"><ResumeRequestForm playerId={player.id} lang={lang} requestType="CV" /></section>}
      </div>

      {selectedImage !== null && <div className="fixed inset-0 z-9999 flex items-center justify-center bg-primary-navy/95 p-5" role="dialog" aria-modal="true" aria-label="Player photo gallery"><button type="button" onClick={() => setSelectedImage(null)} className="absolute top-5 right-5 z-10 text-primary-text-inverse hover:text-primary-accent" aria-label="Close gallery"><X className="size-8" /></button><button type="button" onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)} className="absolute left-4 z-10 text-primary-text-inverse hover:text-primary-accent" aria-label="Previous photo"><ArrowLeft className="size-8" /></button><div className="relative h-[80vh] w-full max-w-5xl"><Image src={images[selectedImage]} alt={`${player.firstName} ${player.lastName} photo ${selectedImage + 1}`} fill sizes="100vw" className="object-contain" priority /></div><button type="button" onClick={() => setSelectedImage((selectedImage + 1) % images.length)} className="absolute right-4 z-10 text-primary-text-inverse hover:text-primary-accent" aria-label="Next photo"><ArrowRight className="size-8" /></button></div>}
    </main>
  );
}
