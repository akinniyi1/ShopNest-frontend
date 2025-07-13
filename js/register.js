import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBx_2_7aqxU5z6sLbbBp0fpdJvOzjarmGE",
  authDomain: "shopnest-4cbdf.firebaseapp.com",
  projectId: "shopnest-4cbdf",
  storageBucket: "shopnest-4cbdf.firebasestorage.app",
  messagingSenderId: "106375353281",
  appId: "1:106375353281:web:cc6d19ddbef840e5715540",
  measurementId: "G-FJ5TFZD45F"
};

// Supabase config
const supabaseUrl = "https://oryydgfrezvhfqdkhjsx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y";

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const countrySelect = document.getElementById("country");

  const errorMessage = document.createElement("p");
  errorMessage.className = "text-red-600 text-sm mt-2 text-center";
  form.appendChild(errorMessage);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const country = countrySelect.value;
    const name = email.split("@")[0];

    if (!email || !password || !country) {
      errorMessage.textContent = "Please fill all fields.";
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.textContent = "Registering...";
    submitBtn.disabled = true;
    errorMessage.textContent = "";

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);

      // ✅ Save user to Supabase
      const { data, error } = await supabase.from("users").insert([
        {
          email,
          name,
          country,
          plan: "trial" // optional since your DB default now works
        }
      ]);

      if (error) throw new Error("Could not save user to database.");

      alert("A verification link has been sent to your email.");
      await signOut(auth);
      window.location.href = "login.html";
    } catch (err) {
      console.error("Registration Error:", err);

      if (err.code === "auth/email-already-in-use") {
        errorMessage.textContent = "Account already exists. Please login.";
      } else if (err.code === "auth/weak-password") {
        errorMessage.textContent = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage.textContent = "Please enter a valid email address.";
      } else {
        errorMessage.textContent = "Error: " + (err.message || "Something went wrong.");
      }
    }

    submitBtn.textContent = "Register";
    submitBtn.disabled = false;
  });
});
