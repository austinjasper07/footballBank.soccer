import { NextResponse } from "next/server";
import { getAgentInfo, updateAgentInfo } from "@/actions/adminActions";

export async function GET() {
  try {
    const agentInfo = await getAgentInfo();
    return NextResponse.json(agentInfo);
  } catch (error) {
    console.error("Error fetching agent info:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent information" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const updatedAgent = await updateAgentInfo(formData);
    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error("Error updating agent info:", error);
    return NextResponse.json(
      { error: "Failed to update agent information" },
      { status: 500 }
    );
  }
}
