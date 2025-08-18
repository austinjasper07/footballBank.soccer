"use client";
export default function LiveScoresSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex animate-pulse">
      {/* Left Sidebar Skeleton */}
      <aside className="hidden lg:block w-56 bg-white p-4 space-y-3">
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-3 w-32 bg-gray-200 rounded"></div>
        ))}
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-4">
        {/* Header */}
        <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 rounded-md"
            ></div>
          ))}
        </div>

        {/* Fake Competitions */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-md shadow-sm mb-6">
            {/* Competition header */}
            <div className="h-8 bg-gray-200 rounded-t-md"></div>

            {/* Match rows */}
            {Array.from({ length: 2 }).map((_, j) => (
              <div
                key={j}
                className="flex items-center justify-between px-4 py-3 "
              >
                {/* Time */}
                <div className="h-4 w-10 bg-gray-200 rounded"></div>

                {/* Teams */}
                <div className="flex-1 px-4">
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    <div className="h-4 w-6 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Status */}
                <div className="h-5 w-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ))}
      </main>

      {/* Right Sidebar Skeleton */}
      <aside className="hidden lg:block w-64 bg-white p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-md"></div>
        ))}
      </aside>
    </div>
  );
}
