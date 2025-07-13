import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://oryydgfrezvhfqdkhjsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // your anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// 🔐 Check auth session
supabase.auth.getSession().then(async ({ data: { session } }) => {
  if (!session) {
    window.location.href = "login.html";
  } else {
    const email = session.user.email;
    const { data: userInfo } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userInfo) {
      localStorage.setItem("shopnestUser", JSON.stringify(userInfo));
    }

    const main = document.getElementById("mainContent");
    if (main) main.classList.remove("hidden");

    import("./ads.js").catch(err =>
      console.error("❌ Failed to load ads.js:", err)
    );
  }
});

// 🔓 Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  });
}
