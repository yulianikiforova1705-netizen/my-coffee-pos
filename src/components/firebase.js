import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8xzYczkcCe3V3u-ZbKCc58rPWMZbj7nk",
  authDomain: "gourmetcoffee.firebaseapp.com",
  projectId: "gourmetcoffee",
  storageBucket: "gourmetcoffee.firebasestorage.app",
  messagingSenderId: "497471743161",
  appId: "1:497471743161:web:e021a09d72d0ba313ea768",
  measurementId: "G-P8L3DTPSGN"
};

// Инициализируем само приложение Firebase
const app = initializeApp(firebaseConfig);

// Инициализируем и экспортируем базу данных Firestore
export const db = getFirestore(app);