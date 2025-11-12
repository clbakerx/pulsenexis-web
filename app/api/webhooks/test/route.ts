// Test webhook endpoint to verify production setup
import { NextRequest } from "next/server";

export async function GET() {
  return new Response(JSON.stringify({ 
    status: "Webhook endpoint is ready",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  }), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  console.log("Webhook received:", {
    headers: Object.fromEntries(req.headers.entries()),
    timestamp: new Date().toISOString()
  });
  
  // Your existing webhook logic is in the main webhook file
  // This is just for testing
  return new Response("Webhook test received", { status: 200 });
}