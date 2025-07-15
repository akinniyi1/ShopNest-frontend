// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBx_2_7aqxU5z6sLbbBp0fpdJvOzjarmGE",
  authDomain: "shopnest-4cbdf.firebaseapp.com",
  projectId: "shopnest-4cbdf",
  storageBucket: "shopnest-4cbdf.appspot.com", // FIXED: was wrong (should end with .appspot.com)
  messagingSenderId: "106375353281",
  appId: "1:106375353281:web:cc6d19ddbef840e5715540",
  measurementId: "G-FJ5TFZD45F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
