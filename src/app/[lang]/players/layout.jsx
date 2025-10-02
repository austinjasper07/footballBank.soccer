import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Football Players Directory",
  description: "Browse our comprehensive directory of football players from around the world. Discover talented players by position, country, and skills.",
  keywords: [
    "football players",
    "soccer players directory", 
    "player profiles",
    "football talent search",
    "soccer recruitment",
    "player database",
    "football scouts",
    "player showcase"
  ],
  url: "/players",
});

export default function PlayersLayout({ children }) {
  return children;
}
