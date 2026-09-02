"use client";
export default function MatchSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 animate-pulse">
      {/* Match Header */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="flex items-center justify-between">
          {/* Home */}
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          {/* Score */}
          <div className="text-center">
            <div className="h-10 w-16 bg-gray-300 rounded mx-auto mb-2"></div>
            <div className="h-3 w-12 bg-gray-200 rounded mx-auto"></div>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded-md"></div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white shadow rounded-md p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
