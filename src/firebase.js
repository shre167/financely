// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3LYdAZ-hEdn53YOFsXfHygWyKHV75yEk",
  authDomain: "financely-476da.firebaseapp.com",
  projectId: "financely-476da",
  storageBucket: "financely-476da.firebasestorage.app",
  messagingSenderId: "116164780442",
  appId: "1:116164780442:web:bd9a68553038dc69959a23",
  measurementId: "G-NH0HB6SX5D",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
