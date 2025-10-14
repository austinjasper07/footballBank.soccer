import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsCard({ title, stats, icon: Icon, className = "" }) {
  const getTrendIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (value) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <Card className={`bg-primary-card border border-divider ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {Icon && <Icon className="w-5 h-5 text-accent-red" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={stat.id || `stat-${index}-${stat.label}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-primary-muted text-sm">
                  {stat.label}
                </span>
                {stat.trend !== undefined && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-xs ${getTrendColor(stat.trend)}`}>
                      {Math.abs(stat.trend)}%
                    </span>
                  </div>
                )}
              </div>
              <span className="font-semibold text-primary-text">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
