import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";

export async function POST(request: Request) {
  try {
    const adminAuth = getAdminAuth();

    if (!adminAuth) {
      return NextResponse.json(
        { error: "Firebase Admin not configured. Check server env vars." },
        { status: 503 }
      );
    }

    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify the Firebase ID Token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Use Firestore to find or create the user
    const db = admin.firestore();
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    
    const userData = {
      uid,
      email: email || "",
      fullName: name || "",
      photoURL: picture || "",
    };

    if (!userDoc.exists) {
      await userRef.set({
        ...userData,
        role: "patient",
        subscription: "Free",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } else {
      await userRef.update({
        ...userData,
        updatedAt: new Date().toISOString()
      });
    }
    
    const user = (await userRef.get()).data();

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: any) {
    console.error("Auth verification error:", error?.message || error);
    return NextResponse.json(
      { error: "Unauthorized", details: error?.message || "Unknown error" },
      { status: 401 }
    );
  }
}
