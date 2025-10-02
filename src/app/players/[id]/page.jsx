"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import PlayerTabs from "@/app/players/[id]/PlayerTabs";
import Head from "next/head";
import { getPlayerById } from "@/actions/publicActions";
import Link from "next/link";
import PlayerCarousel from "@/components/PlayerCarousel";
import { useEffect, useState } from "react";

export default function PlayerPage({ params }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setPlayerId(id);
        
        const data = await getPlayerById(id);
        if (!data) {
          notFound();
          return;
        }
        setPlayer(data);
      } catch (err) {
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [params]);

  // Lock/unlock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showModal]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showModal) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showModal]);

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const prevImage = () => {
    if (player?.imageUrl) {
      setCurrentIndex((prev) => (prev - 1 + player.imageUrl.length) % player.imageUrl.length);
    }
  };

  const nextImage = () => {
    if (player?.imageUrl) {
      setCurrentIndex((prev) => (prev + 1) % player.imageUrl.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-red"></div>
      </div>
    );
  }

  if (!player) {
    return notFound();
  }

  const age = new Date().getFullYear() - new Date(player.dob).getFullYear();

  return (
    <>
      <Head>
        <title>
          {player.firstName} {player.lastName} | FootballBank.soccer
        </title>
        <meta
          name="description"
          content="Empowering football talent worldwide through visibility and opportunity."
        />
      </Head>
      <main className="bg-primary-bg text-primary-text font-inter">
        {/* Container for first two sections with background carousel */}
        <div className="relative py-16">
          {/* Background Carousel - Full screen width, first two sections height */}
          <div className="absolute left-0 right-0 top-0 bottom-0 z-0 w-screen" style={{ marginLeft: 'calc(-50vw + 50%)' }}>
            <PlayerCarousel 
              images={player.imageUrl || [player.imageUrl?.[0]]} 
              interval={4000}
            />
          </div>
          
          {/* Overlay - Full screen width, first two sections height */}
          <div className="absolute left-0 right-0 top-0 bottom-0 z-5 bg-black/40 w-screen" style={{ marginLeft: 'calc(-50vw + 50%)' }}></div>
          
          {/* Hero */}
          <section className="pb-16 pt-8 relative z-10">
            <div className="flex lg:flex-row flex-col-reverse gap-12 items-center">
              <div className="shadow-md p-10 rounded-xl lg:w-[60%] relative bg-white/90 backdrop-blur-sm">
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <div className="absolute w-96 h-96 bg-[#f47474] rounded-full blur-[120px] -top-24 -left-20 opacity-20"></div>
                  <div className="absolute w-80 h-80 bg-[#86fcd1] rounded-full blur-[100px] bottom-10 right-10 opacity-20"></div>
                </div>
                <div className="flex gap-4 mb-6">
                  <span className="badge">Available</span>
                  <span className="badge-secondary">Featured Player</span>
                </div>
                <h1 className="text-[clamp(1.5rem,3.5vw,3.5rem)]  font-bold mb-4">
                  <span className="text-nowrap">{player.firstName}</span>{" "}
                  {player.lastName}
                </h1>
                <div className="flex gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`https://flagcdn.com/w40/${player.countryCode.toLowerCase()}.png`}
                      alt={player.country}
                      width={24}
                      height={16}
                      className="rounded"
                    />
                    <span className="text-primary-muted">{player.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-map-marker-alt text-accent-red"></i>
                    <span className="text-primary-muted">—</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <DetailCard label="Position" value={player.position} />
                  <DetailCard label="Age" value={`${age} years`} />
                </div>
                <p className="mb-6">{player.description}</p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary">
                    <i className="fa-solid fa-envelope mr-2" /> Contact Agent
                  </button>
                  {/* <a href={player.cvUrl} className="btn-outline" download target="_blank">
                    <i className="fa-solid fa-download mr-2" /> Download CV
                  </a> */}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-divider bg-white/90 backdrop-blur-sm p-4">
                <Image
                  src={player.imageUrl[0]}
                  alt={`${player.firstName} ${player.lastName}`}
                  width={600}
                  height={500}
                  className="object-cover w-full h-[500px] rounded-xl"
                />
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="relative z-10 bg-white/95 backdrop-blur-sm">
            <PlayerTabs player={player} onImageClick={openModal} />
          </div>
        </div>

        {/* Contact CTA */}
        <section className="py-16 my-16 bg-gradient-to-r from-accent-red to-accent-red/80 text-white relative z-10">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl  font-bold mb-6">
              Ready to Scout {player.firstName}?
            </h2>
            <p className="mb-8 opacity-90">
              Contact us today to learn more, arrange trials, or request
              additional information.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={"/contact"}
                className="text-accent-red bg-white border border-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-accent-red hover:text-white transition-colors"
              >
                <i className="fa-solid fa-envelope mr-2 "></i> Contact Agent
              </Link>
              <button className="text-accent-red bg-white border border-white px-6 py-3 rounded-md flex items-center gap-2 hover:bg-accent-red hover:text-white transition-colors">
                <i className="fa-solid fa-calendar mr-2"></i> Schedule Meeting
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Full-Screen Modal Carousel - At main page level */}
      {showModal && player?.imageUrl && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={player.imageUrl[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-full"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {player.imageUrl.length}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2 max-w-full overflow-x-auto px-4">
            {player.imageUrl.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIndex 
                    ? 'border-white' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

          {/* Keyboard Navigation Hint */}
          <div className="absolute top-4 left-4 z-10 text-white/70 text-sm">
            Use ← → keys or swipe to navigate
          </div>
        </div>
      )}
    </>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="bg-primary-secondary rounded-lg p-4 border border-divider">
      <span className="text-primary-muted text-sm">{label}</span>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}
