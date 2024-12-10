// lib/firebase/firebase.config.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDsYFWj-wMmsdjKC1VMT0BwYz94AEaoCJI",
  authDomain: "blindtest-6870a.firebaseapp.com",
  projectId: "blindtest-6870a",
  storageBucket: "blindtest-6870a.firebasestorage.app",
  messagingSenderId: "543106058379",
  appId: "1:543106058379:web:81e7c2854445e31c4b2c8e",
  measurementId: "G-8LQ4VB7V5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
