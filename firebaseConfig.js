// Flávia Glenda Guimarães Carvalho
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDz10ecPSg8O4fDmGcN_j4nbg4zUlOBFc0",
  authDomain: "auth-firebase-projeto-au-f23d0.firebaseapp.com",
  projectId: "auth-firebase-projeto-au-f23d0",
  storageBucket: "auth-firebase-projeto-au-f23d0.appspot.com", 
  messagingSenderId: "888805000585",
  appId: "1:888805000585:web:b332419c6f749082744d58",
  measurementId: "G-NFM33Q3HH8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db, collection, getDocs };
