import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const countrySelect = document.getElementById("country");

  // Create inline error message
  const errorMessage = document.createElement("p");
  errorMessage.className = "text-red-600 text-sm mt-2 text-center";
  form.appendChild(errorMessage);

  // Create toast container
  const toast = document.createElement("div");
  toast.id = "registerToast";
  toast.className =
    "fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm px-4 py-2 rounded shadow z-50 opacity-0 transition-opacity duration-300 hidden";
  document.body.appendChild(toast);

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        country,
        plan: "trial",
      });

      showToast("✅ Account created. Please verify your email.");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 4000);
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

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.remove("opacity-0");
    }, 100); // slight delay for transition effect

    setTimeout(() => {
      toast.classList.add("opacity-0");
    }, 3000);

    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3500);
  }
});
