import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWWku1k8o51orEvA3CKxeYm8uKBvy2uOs",
  authDomain: "timora-48388.firebaseapp.com",
  projectId: "timora-48388",
  storageBucket: "timora-48388.firebasestorage.app",
  messagingSenderId: "968928884911",
  appId: "1:968928884911:web:3e7023dad4d8e15ba13c5a"
};

const app = initializeApp(firebaseConfig);

// Auth (already working)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Storage (new, now enabled)
export const storage = getStorage(app);
