import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCUqs6v8jhFc42M-juK1hhk4X8Vs4u5dq4",
  authDomain: "hurawatch-test.firebaseapp.com",
  projectId: "hurawatch-test",
  storageBucket: "hurawatch-test.firebasestorage.app",
  messagingSenderId: "688743370836",
  appId: "1:688743370836:web:de58fa70cad9639eef1dc1",
  measurementId: "G-MJM5VB8S29",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize Firestore Database
export const db = getFirestore(app)

export default app
