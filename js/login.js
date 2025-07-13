import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://oryydgfrezvhfqdkhjsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // keep secure
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data: userInfo } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userInfo) {
      localStorage.setItem("shopnestUser", JSON.stringify(userInfo));
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "User data not found.";
    }
  }

  loginBtn.textContent = "Login";
  loginBtn.disabled = false;
});
