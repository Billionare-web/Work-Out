import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDE3ZPWAF4XCCFyxqpAY5USHBvh5dHglgA",
  authDomain: "work-out-cf4e6.firebaseapp.com",
  projectId: "work-out-cf4e6",
  storageBucket: "work-out-cf4e6.firebasestorage.app",
  messagingSenderId: "1022540281846",
  appId: "1:1022540281846:web:fc484b5cdbe916fe5b79d7",
  measurementId: "G-Z4CYSC2G2E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
