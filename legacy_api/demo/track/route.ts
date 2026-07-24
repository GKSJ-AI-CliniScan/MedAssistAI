import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, timestamp, userId, device, ip } = body;

    // Here we would typically save this data to a database
    // For now, we will just log it to the console to verify it works
    console.log(`[ANALYTICS] Demo Event Recorded: ${event}`, {
      timestamp,
      userId: userId || 'anonymous',
      device: device || 'unknown',
      ip: ip || 'unknown',
      serverTime: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: "Event tracked successfully" });
  } catch (error) {
    console.error("Failed to track demo event:", error);
    return NextResponse.json({ success: false, error: "Failed to parse tracking data" }, { status: 400 });
  }
}
