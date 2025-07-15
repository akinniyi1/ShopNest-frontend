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
      // 🔐 Create account in Firebase Auth
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // 📩 Send email verification
      await user.sendEmailVerification();

      // 📄 Save user profile in Firestore
      await firebase.firestore().collection("users").doc(user.uid).set({
        email,
        name,
        country,
        plan: "trial",
      });

      // ✅ Redirect
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
