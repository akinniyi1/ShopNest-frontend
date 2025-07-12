import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 Monitor auth state and email verification
onAuthStateChanged(auth, (user) => {
  if (!user || !user.emailVerified) {
    // Force login if user not verified
    window.location.href = "login.html";
  } else {
    const main = document.getElementById("mainContent");
    if (main) main.classList.remove("hidden");

    // Dynamically load ads
    import("./ads.js").catch((err) =>
      console.error("❌ Failed to load ads.js:", err)
    );
  }
});

// 🔓 Logout functionality
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  });
}
