export async function GET(req, { params }) {
  const { id } = await params;
  const { LIVESCORE_API_KEY, LIVESCORE_API_SECRET } = process.env;

  const { searchParams } = new URL(req.url);
  const homeId = searchParams.get("home_id");
  const awayId = searchParams.get("away_id");

  if (!homeId || !awayId) {
    return Response.json(
      { error: "Missing home_id or away_id" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://livescore-api.com/api-client/teams/head2head.json?team1_id=${homeId}&team2_id=${awayId}&key=${LIVESCORE_API_KEY}&secret=${LIVESCORE_API_SECRET}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Failed to fetch head2head data");

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("Head2Head API Error:", error);
    return Response.json(
      { error: "Failed to fetch head2head data" },
      { status: 500 }
    );
  }
}
