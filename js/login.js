import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Create error display
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
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    if (!userCred.user.emailVerified) {
      await signOut(auth);
      errorMessage.textContent = "Please verify your email before logging in.";
    } else {
      // ✅ Get user info from backend
      const res = await fetch(`https://shopnest-backend-43fu.onrender.com/api/users/${email}`);
      const userData = await res.json();

      if (!res.ok || !userData.email) {
        throw new Error("Could not fetch user data from backend.");
      }

      // Store user data in localStorage for use across pages
      localStorage.setItem("shopnestUser", JSON.stringify(userData));

      // Redirect to homepage
      window.location.href = "index.html";
    }
  } catch (err) {
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-email") {
      errorMessage.textContent = "Account doesn't exist.";
    } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
      errorMessage.textContent = "Incorrect email or password.";
    } else {
      errorMessage.textContent = "Error: " + (err.message || "Something went wrong.");
    }
  }

  loginBtn.textContent = "Login";
  loginBtn.disabled = false;
});
