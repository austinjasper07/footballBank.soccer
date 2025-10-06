import { NextResponse } from "next/server";
import mongoose from "@/lib/mongoose";

export async function GET() {
  try {
    console.log("🔍 Health check called");
    
    const startTime = Date.now();
    
    // Test database connection
    await mongoose.connection.db.admin().ping();
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`🔍 Database health check completed in ${responseTime}ms`);
    
    return NextResponse.json({
      status: "ok",
      database: "connected",
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      message: "Database connection successful"
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
