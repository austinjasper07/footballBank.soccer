import { Star, Gamepad2, Zap, Target, Users, ChevronDown, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sports = [
  { name: "FOOTBALL", icon: CircleDot, active: true },
  { name: "TENNIS", icon: Gamepad2 },
  { name: "BASKETBALL", icon: CircleDot },
  { name: "HOCKEY", icon: Zap },
  { name: "GOLF", icon: Target },
  { name: "VOLLEYBALL", icon: CircleDot },
  { name: "BASEBALL", icon: CircleDot },
  { name: "SNOOKER", icon: Users },
];

export function SportsHeader() {
  return (
    <div className="bg-card border-b">
      <div className="flex items-center gap-1 px-2 sm:px-4 py-2 overflow-x-auto">
        <Button className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] whitespace-nowrap">
          <Star className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">FAVORITES</span>
          <span className="sm:hidden">FAV</span>
          <Badge variant="secondary" className="ml-1 sm:ml-2">0</Badge>
        </Button>
        
        {sports.map((sport) => (
          <Button
            key={sport.name}
            className={`whitespace-nowrap ${sport.active ? "bg-[hsl(var(--sport-football))] text-white hover:bg-[hsl(var(--sport-football))]/90" : "hover:text-[hsl(var(--foreground))]"}`}
          >
            <sport.icon className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{sport.name}</span>
            <span className="sm:hidden">{sport.name.slice(0, 3)}</span>
          </Button>
        ))}
        
        <Button variant="ghost" size="sm" className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] whitespace-nowrap">
          MORE
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}