import { Pin, } from "lucide-react";
import { Button } from "@/components/ui/button";

const leagues = [
  { name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Ligue 1", flag: "🇫🇷" },
  { name: "Bundesliga", flag: "🇩🇪" },
  { name: "Serie A", flag: "🇮🇹" },
  { name: "Eredivisie", flag: "🇳🇱" },
  { name: "LaLiga", flag: "🇪🇸" },
  { name: "ASEAN Championship", flag: "🏆" },
  { name: "Euro", flag: "🇪🇺" },
  { name: "Champions League", flag: "🏆" },
  { name: "Europa League", flag: "🏆" },
];

export function PinnedLeagues() {
  return (
    <div className="w-64 bg-card border-r h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))]">
          <Pin className="w-4 h-4" />
          PINNED LEAGUES
        </div>
      </div>
      
      <div className="p-2">
        {leagues.map((league) => (
          <Button
            key={league.name}
            className="w-full justify-start text-left h-auto py-2 px-3 mb-1 hover:bg-muted"
          >
            <span className="mr-2">{league.flag}</span>
            <span className="text-sm">{league.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}