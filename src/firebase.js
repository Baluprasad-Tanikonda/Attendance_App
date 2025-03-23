// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, collection, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCABB8nNadEcaA3OPzYs2oz8RbpYav5opE",
    authDomain: "dashboard-4c24f.firebaseapp.com",
    projectId: "dashboard-4c24f",
    storageBucket: "dashboard-4c24f.appspot.com",
    messagingSenderId: "908699037540",
    appId: "1:908699037540:web:d9a2c71b987eeb76b0d471",
    measurementId: "G-9ZG6113LT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export Firestore functions
export { collection, addDoc, doc, updateDoc };
