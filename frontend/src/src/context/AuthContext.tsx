"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

// --- Firestore Schema Types ---

export interface PersonalInfo {
  phone: string;
  dob: string;
  address: string;
}

export interface MedicalProfile {
  bloodType: string;
  height: string;
  weight: string;
  allergies: string;
  conditions: string;
  medications: string;
}

export interface DbUser {
  id: string;
  uid: string;
  email: string;
  fullName: string | null;
  photoURL: string | null;
  role: string;
  subscription: string;
  personalInfo: PersonalInfo;
  medicalProfile: MedicalProfile;
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  dbUser: DbUser | null;
  refreshDbUser: () => Promise<void>;
}

const defaultPersonalInfo: PersonalInfo = {
  phone: "",
  dob: "",
  address: "",
};

const defaultMedicalProfile: MedicalProfile = {
  bloodType: "",
  height: "",
  weight: "",
  allergies: "",
  conditions: "",
  medications: "",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  dbUser: null,
  refreshDbUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Helper: Fetch or create a user document in Firestore
async function getOrCreateUserDoc(firebaseUser: User): Promise<DbUser | null> {
  if (!db) {
    console.warn("Firestore is not initialized.");
    return null;
  }

  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Existing user — return their data
    const data = userSnap.data();
    return {
      id: userSnap.id,
      uid: data.uid,
      email: data.email,
      fullName: data.fullName,
      photoURL: data.photoURL,
      role: data.role,
      subscription: data.subscription,
      personalInfo: { ...defaultPersonalInfo, ...data.personalInfo },
      medicalProfile: { ...defaultMedicalProfile, ...data.medicalProfile },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } else {
    // New user — create their document automatically
    const newUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      fullName: firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL || "",
      role: "patient",
      subscription: "Free",
      personalInfo: defaultPersonalInfo,
      medicalProfile: defaultMedicalProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, newUser);
    console.log("✅ New user document created in Firestore for:", firebaseUser.uid);

    // Re-read so we get the server-generated timestamps
    const freshSnap = await getDoc(userRef);
    const data = freshSnap.data()!;
    return {
      id: freshSnap.id,
      uid: data.uid,
      email: data.email,
      fullName: data.fullName,
      photoURL: data.photoURL,
      role: data.role,
      subscription: data.subscription,
      personalInfo: { ...defaultPersonalInfo, ...data.personalInfo },
      medicalProfile: { ...defaultMedicalProfile, ...data.medicalProfile },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Re-fetch the user document from Firestore (useful after profile save)
  const refreshDbUser = async () => {
    if (user && db) {
      const freshUser = await getOrCreateUserDoc(user);
      setDbUser(freshUser);
    }
  };

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized. Check .env.local.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userData = await getOrCreateUserDoc(firebaseUser);
          setDbUser(userData);
        } catch (error) {
          console.error("Error fetching/creating user document in Firestore:", error);
          // Fallback: use Firebase Auth data so the app doesn't crash
          setDbUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            fullName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
            role: "patient",
            subscription: "Free",
            personalInfo: defaultPersonalInfo,
            medicalProfile: defaultMedicalProfile,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    setUser(null);
    setDbUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, dbUser, refreshDbUser }}>
      {children}
    </AuthContext.Provider>
  );
}
