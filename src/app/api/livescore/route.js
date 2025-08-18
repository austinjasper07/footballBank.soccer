// app/api/livescore/route.js
let cache = null;
let cacheTime = 0;

export async function GET() {
  const now = Date.now();
  const CACHE_DURATION = 30 * 1000; // 30 seconds

  if (cache && now - cacheTime < CACHE_DURATION) {
    console.log("Serving from cache...");
    return new Response(JSON.stringify(cache), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { LIVESCORE_API_KEY, LIVESCORE_API_SECRET } = process.env;

    const [liveRes, finishedRes, scheduledRes] = await Promise.all([
      fetch(`https://livescore-api.com/api-client/scores/live.json?key=${LIVESCORE_API_KEY}&secret=${LIVESCORE_API_SECRET}`),
      fetch(`https://livescore-api.com/api-client/scores/history.json?key=${LIVESCORE_API_KEY}&secret=${LIVESCORE_API_SECRET}`),
      fetch(`https://livescore-api.com/api-client/scores/scheduled.json?key=${LIVESCORE_API_KEY}&secret=${LIVESCORE_API_SECRET}`),
    ]);

    const [liveData, finishedData, scheduledData] = await Promise.all([
      liveRes.json(),
      finishedRes.json(),
      scheduledRes.json(),
    ]);

    const normalizeMatches = (matches = [], status) =>
      matches.map((m) => ({
        id: m.id,
        competition: m.competition_name || "Unknown League",
        time: m.time || "—",
        status,
        home: {
          name: m.home_name || "Home",
          logo: m.home_logo || null,
          score: m.scores?.home_score ?? "-",
        },
        away: {
          name: m.away_name || "Away",
          logo: m.away_logo || null,
          score: m.scores?.away_score ?? "-",
        },
      }));

    cache = {
      success: true,
      matches: {
        live: normalizeMatches(liveData.data?.match, "LIVE"),
        finished: normalizeMatches(finishedData.data?.match, "FINISHED"),
        scheduled: normalizeMatches(scheduledData.data?.match, "SCHEDULED"),
      },
    };
    cacheTime = now;

    return new Response(JSON.stringify(cache), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("LiveScore API error:", err);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
