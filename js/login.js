import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        errorMessage.textContent = "Please verify your email before logging in.";
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
        return;
      }

      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists()) {
        errorMessage.textContent = "User profile not found.";
        loginBtn.textContent = "Login";
        loginBtn.disabled = false;
        return;
      }

      localStorage.setItem("shopnestUser", JSON.stringify(docSnap.data()));
      window.location.href = "index.html";

    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errorMessage.textContent = "Incorrect email or password.";
      } else {
        errorMessage.textContent = err.message;
      }
    }

    loginBtn.textContent = "Login";
    loginBtn.disabled = false;
  });
});
