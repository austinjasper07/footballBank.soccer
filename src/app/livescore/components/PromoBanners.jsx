import { ChevronDown } from "lucide-react";

export function PromoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="bg-[hsl(var(--nairabet))] rounded-lg p-3 sm:p-4 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-lg sm:text-xl font-bold">nairabet</div>
          <div className="text-xs sm:text-sm opacity-90">400% match Freebet, up to</div>
          <div className="text-base sm:text-lg font-bold">₦10,000</div>
        </div>
        <ChevronDown className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      
      <div className="bg-[hsl(var(--oneXbet))] rounded-lg p-3 sm:p-4 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-lg sm:text-xl font-bold">1XBET</div>
          <div className="text-base sm:text-lg font-bold">300% deposit bonus</div>
        </div>
        <ChevronDown className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      
      <div className="bg-[hsl(var(--betano))] rounded-lg p-3 sm:p-4 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-lg sm:text-xl font-bold">Betano</div>
          <div className="text-xs sm:text-sm opacity-90">Welcome Bonus up to</div>
          <div className="text-base sm:text-lg font-bold">₦200,000</div>
        </div>
        <ChevronDown className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </div>
  );
}