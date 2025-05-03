// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAgFoRQIkAUh31jgRTJ0_3DHH-oLQYFPw",
  authDomain: "loginfirebase-87828.firebaseapp.com",
  projectId: "loginfirebase-87828",
  storageBucket: "loginfirebase-87828.firebasestorage.app",
  messagingSenderId: "1052776709543",
  appId: "1:1052776709543:web:74582aa32933b851ae4a82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };