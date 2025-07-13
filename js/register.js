import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://oryydgfrezvhfqdkhjsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // keep secure
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      errorMessage.textContent = error.message;
    } else {
      await supabase.from("users").insert([{ email, name, country, plan: "trial" }]);
      alert("Check your email for verification.");
      window.location.href = "login.html";
    }

    submitBtn.textContent = "Register";
    submitBtn.disabled = false;
  });
});
