import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ✅ Your Supabase project credentials
const supabaseUrl = 'https://oryydgfrezvhfqdkhjsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y';
const supabase = createClient(supabaseUrl, supabaseKey);

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
      // ✅ Create account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // ✅ Save user info in `users` table
      const { error: insertError } = await supabase.from("users").insert([
        { email, name, country, plan: "trial" }
      ]);

      if (insertError) {
        throw new Error("Could not save user to database.");
      }

      alert("Account created! Check your email for a verification link.");
      window.location.href = "login.html";

    } catch (err) {
      errorMessage.textContent = err.message || "Something went wrong.";
    }

    submitBtn.textContent = "Register";
    submitBtn.disabled = false;
  });
});
