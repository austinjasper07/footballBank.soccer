"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingSplash({ 
  message = "Loading...", 
  showCard = true,
  className = "" 
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );

  if (showCard) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    );
  }

  return content;
}
