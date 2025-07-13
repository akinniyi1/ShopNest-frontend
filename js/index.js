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
  storageBucket: "shopnest-4cbdf.appspot.com",
  messagingSenderId: "106375353281",
  appId: "1:106375353281:web:cc6d19ddbef840e5715540",
  measurementId: "G-FJ5TFZD45F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Supabase config
const SUPABASE_URL = "https://oryydgfrezvhfqdkhjsx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`
};

// 👀 Monitor auth and fetch user info from Supabase
onAuthStateChanged(auth, async (user) => {
  const main = document.getElementById("mainContent");

  if (!user || !user.emailVerified) {
    window.location.href = "login.html";
  } else {
    // ✅ Fetch full user info from Supabase using their email
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${user.email}`, {
        method: "GET",
        headers
      });

      const data = await res.json();
      if (data.length > 0) {
        localStorage.setItem("shopnestUser", JSON.stringify(data[0]));
      } else {
        console.warn("⚠️ No user info found in Supabase.");
      }
    } catch (err) {
      console.error("❌ Error loading Supabase user info:", err);
    }

    if (main) main.classList.remove("hidden");

    // 🛒 Load ads if verified
    import("./ads.js").catch((err) =>
      console.error("❌ Failed to load ads.js:", err)
    );
  }
});

// 🔓 Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("shopnestUser");
      window.location.href = "login.html";
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  });
}
