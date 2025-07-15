import { auth } from "./firebase-config.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.getElementById("resetForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value.trim();
  const messageBox = document.getElementById("statusMessage");

  messageBox.textContent = "";
  messageBox.className = "";

  if (!email) {
    messageBox.textContent = "Please enter your email address.";
    messageBox.className = "text-red-600 text-sm text-center mt-2";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    messageBox.textContent = "✅ Reset link sent to your email.";
    messageBox.className = "text-green-600 text-sm text-center mt-2";
  } catch (error) {
    messageBox.textContent = error.message || "Failed to send reset link.";
    messageBox.className = "text-red-600 text-sm text-center mt-2";
  }
});
