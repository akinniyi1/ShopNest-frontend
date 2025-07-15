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
    // 🔐 Firebase Authentication
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      errorMessage.textContent = "Please verify your email before logging in.";
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
      return;
    }

    // ✅ Fetch user profile from Firestore "users" collection
    const doc = await firebase.firestore().collection("users").doc(user.uid).get();
    if (!doc.exists) {
      errorMessage.textContent = "Could not load user info. Try again.";
      loginBtn.textContent = "Login";
      loginBtn.disabled = false;
      return;
    }

    const userData = doc.data();
    localStorage.setItem("shopnestUser", JSON.stringify(userData));

    // Redirect
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
