import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 🔐 Check auth session and load user
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    const userRef = doc(db, "users", user.email);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userInfo = docSnap.data();
      localStorage.setItem("shopnestUser", JSON.stringify(userInfo));
    }
  } catch (err) {
    console.error("❌ Failed to fetch user info:", err.message);
  }

  // 👁️ Show main content
  const main = document.getElementById("mainContent");
  if (main) main.classList.remove("hidden");

  // ⬇️ Load ads
  import("./ads.js").catch(err =>
    console.error("❌ Failed to load ads.js:", err)
  );
});

// 🔓 Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
