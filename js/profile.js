import { auth, db } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
    const userRef = doc(db, "users", user.uid); // ✅ fixed here
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      usernameEl.textContent = "User not found";
      return;
    }

    const userInfo = docSnap.data();
    usernameEl.textContent = userInfo.name || "N/A";

    if (userInfo.plan === "premium") {
      planEl.textContent = "Premium Plan";
      planEl.className = "inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium";
      upgradeBtn.style.display = "none";
    } else {
      planEl.textContent = "Free Plan";
      planEl.className = "inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium";

      upgradeBtn.addEventListener("click", async () => {
        upgradeBtn.textContent = "Upgrading...";
        upgradeBtn.disabled = true;

        try {
          await updateDoc(userRef, { plan: "premium" });
          alert("Successfully upgraded to Premium!");
          location.reload();
        } catch (upgradeError) {
          console.error("Upgrade failed:", upgradeError.message);
          alert("Upgrade failed.");
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
