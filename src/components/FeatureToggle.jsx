"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";



export function FeaturedToggle({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">Featured Player?</Label>
      <RadioGroup
        value={value ? "yes" : "no"}
        onValueChange={(val) => onChange(val === "yes")}
        className="flex gap-6"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem id="featured-yes" value="yes" />
          <Label htmlFor="featured-yes">Yes</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="featured-no" value="no" />
          <Label htmlFor="featured-no">No</Label>
        </div>
      </RadioGroup>
    </div>
  );
}



export function PlayerOfTheWeekToggle({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">Player of the Week?</Label>
      <RadioGroup
        value={value ? "yes" : "no"}
        onValueChange={(val) => onChange(val === "yes")}
        className="flex gap-6"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem id="player-of-the-week-yes" value="yes" />
          <Label htmlFor="player-of-the-week-yes">Yes</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="player-of-the-week-no" value="no" />
          <Label htmlFor="player-of-the-week-no">No</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
