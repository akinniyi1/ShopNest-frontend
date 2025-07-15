// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBx_2_7aqxU5z6sLbbBp0fpdJvOzjarmGE",
  authDomain: "shopnest-4cbdf.firebaseapp.com",
  projectId: "shopnest-4cbdf",
  storageBucket: "shopnest-4cbdf.appspot.com", // ✅ Corrected
  messagingSenderId: "106375353281",
  appId: "1:106375353281:web:cc6d19ddbef840e5715540",
  measurementId: "G-FJ5TFZD45F"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in other modules
export const auth = getAuth(app);
export const db = getFirestore(app);
