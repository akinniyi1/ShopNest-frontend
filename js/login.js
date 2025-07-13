import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://oryydgfrezvhfqdkhjsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y';
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        errorMessage.textContent = "Incorrect email or password.";
      } else {
        errorMessage.textContent = error.message;
      }
      return;
    }

    const { user } = data;
    if (!user?.email_confirmed_at) {
      errorMessage.textContent = "Please verify your email before logging in.";
      return;
    }

    // ✅ Fetch user profile from users table
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !userData) {
      errorMessage.textContent = "Could not load user info. Try again.";
      return;
    }

    // Store user info in localStorage
    localStorage.setItem("shopnestUser", JSON.stringify(userData));

    // Redirect to homepage
    window.location.href = "index.html";
  } catch (err) {
    console.error("Login error:", err);
    errorMessage.textContent = "Error: " + (err.message || "Something went wrong.");
  }

  loginBtn.textContent = "Login";
  loginBtn.disabled = false;
});
