import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const country = document.getElementById("country").value;

  if (!email || !password || !country) {
    alert("All fields are required.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);

    // Send user info to Render backend
    const res = await fetch("https://your-render-backend-url.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uid: userCredential.user.uid,
        email,
        country
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Please check your email to verify your account.");
    } else {
      alert("Registered but failed to save data: " + data.error);
    }
  } catch (error) {
    alert(error.message);
  }
});
