import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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
const BACKEND_URL = "https://shopnest-backend-43fu.onrender.com";

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
    const res = await fetch(`${BACKEND_URL}/api/users/${user.email}`);
    const userData = await res.json();

    usernameEl.textContent = userData.name || "N/A";

    if (userData.plan === "premium") {
      planEl.textContent = "Premium Plan";
      planEl.className = "inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium";
      upgradeBtn.style.display = "none";
    } else {
      planEl.textContent = "Free Plan";
      planEl.className = "inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium";
      upgradeBtn.addEventListener("click", async () => {
        upgradeBtn.textContent = "Upgrading...";
        upgradeBtn.disabled = true;

        const res = await fetch(`${BACKEND_URL}/api/users/upgrade`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, plan: "premium" })
        });

        const result = await res.json();
        if (result.success) {
          alert("Successfully upgraded to Premium!");
          location.reload();
        } else {
          alert("Upgrade failed. Try again.");
        }

        upgradeBtn.textContent = "Upgrade to Premium";
        upgradeBtn.disabled = false;
      });
    }
  } catch (err) {
    console.error("Failed to load profile:", err);
    usernameEl.textContent = "Error loading data";
  }
});
