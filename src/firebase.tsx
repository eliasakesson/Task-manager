import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDj6C4xSPMea64Zs7M4JlSqhL2-HjBHTmc",
  authDomain: "task-management-d1965.firebaseapp.com",
  projectId: "task-management-d1965",
  storageBucket: "task-management-d1965.appspot.com",
  messagingSenderId: "624606438681",
  appId: "1:624606438681:web:b47ede9cd2b1824d15d188"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);