import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ✅ Supabase config
const supabase = createClient(
  "https://oryydgfrezvhfqdkhjsx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y"
);

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBx_2_7aqxU5z6sLbbBp0fpdJvOzjarmGE",
  authDomain: "shopnest-4cbdf.firebaseapp.com",
  projectId: "shopnest-4cbdf",
  storageBucket: "shopnest-4cbdf.firebasestorage.app",
  messagingSenderId: "106375353281",
  appId: "1:106375353281:web:cc6d19ddbef840e5715540",
  measurementId: "G-FJ5TFZD45F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const errorMessage = document.createElement("p");
errorMessage.className = "text-red-600 text-sm mt-2 text-center";
form.appendChild(errorMessage);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    errorMessage.textContent = "Please enter both email and password.";
    return;
  }

  const loginBtn = form.querySelector("button[type='submit']");
  loginBtn.textContent = "Logging in...";
  loginBtn.disabled = true;
  errorMessage.textContent = "";

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    if (!userCred.user.emailVerified) {
      await signOut(auth);
      errorMessage.textContent = "Please verify your email before logging in.";
    } else {
      // ✅ Fetch user info from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) {
        throw new Error("Could not fetch user info.");
      }

      localStorage.setItem("shopnestUser", JSON.stringify(data));
      window.location.href = "index.html";
    }
  } catch (err) {
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
      errorMessage.textContent = "Account doesn't exist.";
    } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
      errorMessage.textContent = "Incorrect email or password.";
    } else {
      errorMessage.textContent = "Error: " + (err.message || "Something went wrong.");
    }
  }

  loginBtn.textContent = "Login";
  loginBtn.disabled = false;
});
