import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Error display
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

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      errorMessage.textContent = "Could not load user info. Try again.";
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
      return;
    }

    const userData = userDoc.data();
    localStorage.setItem("shopnestUser", JSON.stringify(userData));

    // ✅ Redirect after successful login
    window.location.href = "index.html";

  } catch (err) {
    console.error("Login error:", err);
    if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
      errorMessage.textContent = "Incorrect email or password. Please try again.";
    } else {
      errorMessage.textContent = err.message;
    }
    loginBtn.textContent = "Login";
    loginBtn.disabled = false;
  }
});
