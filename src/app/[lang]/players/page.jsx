import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import PlayersClient from "./PlayersClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: dict.players.title,
    description: dict.players.subtitle,
    keywords: [
      "football players",
      "soccer talent",
      "player profiles",
      "football recruitment",
      "player showcase",
      "football scouts",
      "talent discovery",
      "football opportunities"
    ],
    url: `/${lang}/players`,
    locale: lang,
  });
}

export default async function PlayersPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <PlayersClient lang={lang} dict={dict} />;
}