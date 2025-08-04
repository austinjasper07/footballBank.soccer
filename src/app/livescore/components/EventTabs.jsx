import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const tabs = ["ALL", "LIVE", "ODDS", "FINISHED", "SCHEDULED"];

export function EventTabs() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
      <div className="flex gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto">
        {tabs.map((tab, index) => (
          <Button
            key={tab}
            className={`whitespace-nowrap ${index === 0 ? "bg-[hsl(var(--sport-football))] text-white hover:bg-[hsl(var(--sport-football))]/90" : ""}`}
          >
            {tab}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        <Button>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
          <Calendar className="w-4 h-4" />
          <span className="text-xs sm:text-sm">18/07 FR</span>
        </Button>
        <Button>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}