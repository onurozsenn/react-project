// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARKDjdr4zvfUWzk6VXLdcUuZ-dfhZlYk0",
  authDomain: "postegram-projesi.firebaseapp.com",
  projectId: "postegram-projesi",
  storageBucket: "postegram-projesi.firebasestorage.app",
  messagingSenderId: "328680170688",
  appId: "1:328680170688:web:ac7c0470243cbb1c363925",
  measurementId: "G-239T0GEL09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

