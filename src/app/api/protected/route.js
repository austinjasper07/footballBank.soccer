import {NextResponse} from "next/server";
import { getAuthUser } from "@/lib/oauth";

export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return new Response("Unauthorized", {status: 401});
  }
  
  const data = {message: "Hello User", id: user.id};

  return NextResponse.json({data});
}