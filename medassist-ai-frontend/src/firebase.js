import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPSCLVWfRhT-OJD2wmosxRb1Dmtr2YWvU",
  authDomain: "medassistai-236.firebaseapp.com",
  projectId: "medassistai-236",
  storageBucket: "medassistai-236.firebasestorage.app",
  messagingSenderId: "366223112369",
  appId: "1:366223112369:web:0058bb23fc846500e3ca90",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();