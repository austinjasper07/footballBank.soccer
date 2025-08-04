import { Star, ChevronUp, MessageSquare, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const events = [
  {
    id: 1,
    tournament: "ASIA: ASEAN Championship U23",
    flag: "🏆",
    pinned: true,
    matches: [
      { time: "11:00", team1: "Brunei U23", team2: "Malaysia U23", team1Flag: "🇧🇳", team2Flag: "🇲🇾" },
      { time: "14:00", team1: "Philippines U23", team2: "Indonesia U23", team1Flag: "🇵🇭", team2Flag: "🇮🇩" },
    ],
    standings: true
  },
  {
    id: 2,
    tournament: "EUROPE: Euro Women - Play Offs",
    flag: "🇪🇺",
    pinned: true,
    matches: [
      { time: "20:00", team1: "Spain W", team2: "Switzerland W", team1Flag: "🇪🇸", team2Flag: "🇨🇭", preview: true, analysis: true },
    ],
    draw: true
  },
  {
    id: 3,
    tournament: "SOUTH AMERICA: Copa América Women",
    flag: "🏆",
    pinned: true,
    matches: [
      { time: "22:00", team1: "Uruguay W", team2: "Peru W", team1Flag: "🇺🇾", team2Flag: "🇵🇪", analysis: true },
    ],
    standings: true
  }
];

export function EventList() {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 min-w-0">
              <Star className={`w-4 h-4 flex-shrink-0 ${event.pinned ? 'text-yellow-500 fill-yellow-500' : 'text-[hsl(var(--muted-foreground))]'}`} />
              <span className="text-xs sm:text-sm font-medium text-[hsl(var(--muted-foreground))] truncate">
                {event.flag} {event.tournament}
              </span>
              {event.pinned && <Star className="w-4 h-4 text-blue-500 fill-blue-500 flex-shrink-0" />}
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {event.standings && (
                <Button className="text-[hsl(var(--muted-foreground))] whitespace-nowrap btn-[hsl(var(--ghost))]">
                  <span className="hidden sm:inline">Standings</span>
                  <span className="sm:hidden">Stand</span>
                  <ChevronUp className="w-4 h-4 ml-1" />
                </Button>
              )}
              {event.draw && (
                <Button className="text-[hsl(var(--muted-foreground))] whitespace-nowrap btn-[hsl(var(--ghost))]">
                  Draw
                  <ChevronUp className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            {event.matches.map((match, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-2 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Star className="w-4 h-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
                  <span className="text-sm font-medium w-10 sm:w-12 flex-shrink-0">{match.time}</span>
                  
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex-shrink-0">{match.team1Flag}</span>
                      <span className="truncate">{match.team1}</span>
                      <span className="text-[hsl(var(--muted-foreground))]">-</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex-shrink-0">{match.team2Flag}</span>
                      <span className="truncate">{match.team2}</span>
                      <span className="text-[hsl(var(--muted-foreground))]">-</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 justify-end sm:justify-start">
                  {match.preview && (
                    <Button className="text-xs whitespace-nowrap border border-gray-300 px-2 py-1 rounded">
                      PREVIEW
                    </Button>
                  )}
                  <Button className="btn-[hsl(var(--ghost))] px-2 py-1">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  {match.analysis && (
                    <Button className="btn-[hsl(var(--ghost))] px-2 py-1">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}