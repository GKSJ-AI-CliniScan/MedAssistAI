import { NextResponse } from 'next/server';

export async function GET() {
  // Return the metadata required for the interactive product tour
  return NextResponse.json({
    title: "MedAssist AI Interactive Tour",
    video: "interactive-simulation", // We are using a React simulation instead of an mp4
    thumbnail: "/images/demo-thumb.png",
    duration: "2:30",
    durationSeconds: 150,
    active: true
  });
}
