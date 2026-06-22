// apps/web/src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEsvRntahh0X6a68hcch5TWPFbrerZrLI",
  authDomain: "dd-ddf05.firebaseapp.com",
  projectId: "dd-ddf05",
  storageBucket: "dd-ddf05.firebasestorage.app",
  messagingSenderId: "465951362622",
  appId: "1:465951362622:web:4ac525ac31b06d6193cb6f",
  measurementId: "G-2VC4PZVTGD",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
