import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const countrySelect = document.getElementById("country");

  const errorMessage = document.createElement("p");
  errorMessage.className = "text-red-600 text-sm mt-2 text-center";
  form.appendChild(errorMessage);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const country = countrySelect.value;
    const name = email.split("@")[0];

    if (!email || !password || !country) {
      errorMessage.textContent = "Please fill all fields.";
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.textContent = "Registering...";
    submitBtn.disabled = true;
    errorMessage.textContent = "";

    try {
      // 🔐 Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 📩 Send email verification
      await sendEmailVerification(user);

      // 💾 Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        country,
        plan: "trial",
      });

      // ✅ Redirect after success
      alert("Account created! Please check your email to verify your account.");
      window.location.href = "login.html";

    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        errorMessage.textContent = "Account already exists. Please login.";
      } else {
        errorMessage.textContent = err.message || "Something went wrong.";
      }
    }

    submitBtn.textContent = "Register";
    submitBtn.disabled = false;
  });
});
