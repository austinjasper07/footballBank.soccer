import { SportsHeader } from "./components/SportsHeader";
import { PinnedLeagues } from "./components/PinnedLeagues";
import { PromoBanners } from "./components/PromoBanners";
import { EventTabs } from "./components/EventTabs";
import { EventList } from "./components/EventList";
import { Bet365Ad } from "./components/Bet365Ad";

const Index = () => {
  return (
    <div className="min-h-screen bg-primary-bg text-[hsl(var(--foreground))] py-16">
      { false ? (
        <>
        <SportsHeader />
      
      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block">
          <PinnedLeagues />
        </div>
        
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          <PromoBanners />
          <EventTabs />
          <EventList />
          <Bet365Ad />
        </div>
      </div>
      </>) : (

        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-2xl font-bold">Coming Soon</p>
        </div>
      )
      }
    </div>
  );
};

export default Index;
