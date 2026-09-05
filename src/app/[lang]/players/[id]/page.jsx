import { notFound } from "next/navigation";
import { getPlayerById } from "@/actions/publicActions";
import { hasApprovedResumeAccess } from "@/actions/resumeRequestActions";
import { getDictionary } from "@/lib/dictionaries";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import PlayerMedia from "./PlayerMedia";

export async function generateMetadata({ params }) {
  const { id, lang } = await params;
  const player = await getPlayerById(id);
  if (!player) return {};
  await getDictionary(lang);
  return generateSEOMetadata({
    title: `${player.firstName} ${player.lastName} | FootballBank`,
    description: `View photos and football footage for ${player.firstName} ${player.lastName}.`,
    image: player.imageUrl?.[0],
    url: `/${lang}/players/${id}`,
    type: "profile",
  });
}

export default async function PlayerPage({ params }) {
  const { id, lang } = await params;
  const player = await getPlayerById(id);
  if (!player) notFound();

  let canViewDetails = false;
  try {
    canViewDetails = await hasApprovedResumeAccess(id);
  } catch {
    canViewDetails = false;
  }

  const publicPlayer = {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    imageUrl: player.imageUrl || [],
    videoPrimary: player.videoPrimary,
    videoAdditional: player.videoAdditional || [],
  };
  const approvedPlayer = canViewDetails ? { ...publicPlayer, ...player } : publicPlayer;

  return <PlayerMedia player={approvedPlayer} canViewDetails={canViewDetails} lang={lang} />;
}
