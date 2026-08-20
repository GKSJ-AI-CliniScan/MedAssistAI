import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Mock: Store ticket in DB
    console.log(`[Contact Form Received] From: ${name} (${email}), Subject: ${subject}`);
    
    // Mock: Admin notified, Auto-reply sent
    
    return NextResponse.json({ success: true, message: "Contact form submitted successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
