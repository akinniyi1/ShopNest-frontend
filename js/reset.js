import { auth } from "./firebase-config.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const emailInput = document.getElementById("resetEmail");
  const messageBox = document.getElementById("statusMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    messageBox.textContent = "";
    messageBox.className = "";

    if (!email) {
      showMessage("Please enter your email address.", "error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("✅ Reset link sent to your email. Redirecting to login...", "success");

      // Redirect after 5 seconds
      setTimeout(() => {
        window.location.href = "login.html";
      }, 5000);
    } catch (error) {
      console.error("Reset error:", error);
      if (error.code === "auth/user-not-found") {
        showMessage("No account found with that email.", "error");
      } else {
        showMessage(error.message || "Failed to send reset link.", "error");
      }
    }
  });

  function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `text-sm text-center mt-3 ${
      type === "success" ? "text-green-600 bg-green-100 py-2 rounded" : "text-red-600 bg-red-100 py-2 rounded"
    }`;
  }
});
