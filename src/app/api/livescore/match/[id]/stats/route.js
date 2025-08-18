export async function GET(req, { params }) {
  const { id } = await params;
  const { LIVESCORE_API_KEY, LIVESCORE_API_SECRET } = process.env;

  try {
    const response = await fetch(
      `https://livescore-api.com/api-client/matches/stats.json?match_id=${id}&key=${LIVESCORE_API_KEY}&secret=${LIVESCORE_API_SECRET}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Failed to fetch match stats");

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("Stats API Error:", error);
    return Response.json(
      { error: "Failed to fetch match stats" },
      { status: 500 }
    );
  }
}
