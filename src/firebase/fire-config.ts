import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBm-jq_RhvTMj-H5Kl7qEvgv8skwwckMKE",
  authDomain: "gym-pro-ae5b5.firebaseapp.com",
  projectId: "gym-pro-ae5b5",
  storageBucket: "gym-pro-ae5b5.appspot.com",
  messagingSenderId: "601207742172",
  appId: "1:601207742172:web:a3c05b4dbfcacb083a1e19",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
