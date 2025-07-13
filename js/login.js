import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://oryydgfrezvhfqdkhjsx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y"
);

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

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    errorMessage.textContent = error.message || "Login failed.";
  } else {
    // Load user info from database
    const { data: userInfo } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!userInfo) {
      errorMessage.textContent = "User not found in database.";
    } else {
      localStorage.setItem("shopnestUser", JSON.stringify(userInfo));
      window.location.href = "index.html";
    }
  }

  loginBtn.textContent = "Login";
  loginBtn.disabled = false;
});
