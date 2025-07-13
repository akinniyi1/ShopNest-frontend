import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

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

// ✅ Supabase config
const supabase = createClient(
  "https://oryydgfrezvhfqdkhjsx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y"
);

// 🔎 DOM elements
const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const planEl = document.getElementById("plan");
const upgradeBtn = document.querySelector("button");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  emailEl.textContent = user.email;

  try {
    // 🔁 Get user data from Supabase
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (error || !data) throw new Error("User not found");

    usernameEl.textContent = data.name || "N/A";

    if (data.plan === "premium") {
      planEl.textContent = "Premium Plan";
      planEl.className =
        "inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium";
      upgradeBtn.style.display = "none";
    } else {
      planEl.textContent = "Free Plan";
      planEl.className =
        "inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium";

      upgradeBtn.addEventListener("click", async () => {
        upgradeBtn.textContent = "Upgrading...";
        upgradeBtn.disabled = true;

        const { error: upgradeError } = await supabase
          .from("users")
          .update({ plan: "premium" })
          .eq("email", user.email);

        if (upgradeError) {
          alert("Upgrade failed. Try again.");
        } else {
          alert("Successfully upgraded to Premium!");
          location.reload();
        }

        upgradeBtn.textContent = "Upgrade to Premium";
        upgradeBtn.disabled = false;
      });
    }
  } catch (err) {
    console.error("Failed to load profile:", err.message);
    usernameEl.textContent = "Error loading data";
  }
});
