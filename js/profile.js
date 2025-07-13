import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://oryydgfrezvhfqdkhjsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // your anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const planEl = document.getElementById("plan");
const upgradeBtn = document.querySelector("button");

supabase.auth.getSession().then(async ({ data: { session } }) => {
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const email = session.user.email;
  emailEl.textContent = email;

  try {
    const { data: userInfo, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !userInfo) throw error;

    usernameEl.textContent = userInfo.name || "N/A";

    if (userInfo.plan === "premium") {
      planEl.textContent = "Premium Plan";
      planEl.className = "inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium";
      upgradeBtn.style.display = "none";
    } else {
      planEl.textContent = "Free Plan";
      planEl.className = "inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium";

      upgradeBtn.addEventListener("click", async () => {
        upgradeBtn.textContent = "Upgrading...";
        upgradeBtn.disabled = true;

        const { error: upgradeError } = await supabase
          .from("users")
          .update({ plan: "premium" })
          .eq("email", email);

        if (!upgradeError) {
          alert("Successfully upgraded to Premium!");
          location.reload();
        } else {
          alert("Upgrade failed.");
        }

        upgradeBtn.textContent = "Upgrade to Premium";
        upgradeBtn.disabled = false;
      });
    }
  } catch (err) {
    console.error("Failed to load profile:", err.message);
    usernameEl.textContent = "Error loading data";
  }
});
