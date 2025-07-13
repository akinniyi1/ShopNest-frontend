const container = document.getElementById("myAdsContainer");

// ✅ Supabase Config
const supabase = supabase.createClient(
  "https://oryydgfrezvhfqdkhjsx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y"
);

// ✅ Check if logged in
const user = JSON.parse(localStorage.getItem("shopnestUser"));

if (!user || !user.email) {
  container.innerHTML = "<p class='text-red-600'>Please log in to view your dashboard.</p>";
} else {
  loadUserAds();
}

async function loadUserAds() {
  try {
    const { data: ads, error } = await supabase
      .from("ads")
      .select("*")
      .eq("user_email", user.email);

    if (error) {
      console.error(error);
      container.innerHTML = "<p class='text-red-500'>Error loading ads.</p>";
      return;
    }

    if (!ads || ads.length === 0) {
      container.innerHTML = "<p class='text-gray-500'>You have not posted any ads yet.</p>";
      return;
    }

    container.innerHTML = "";
    ads.forEach(ad => {
      const div = document.createElement("div");
      div.className = "bg-white shadow rounded-lg p-4 relative";

      div.innerHTML = `
        ${ad.plan === "premium" ? `<span class="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded">Premium</span>` : ""}
        <img src="${ad.images?.[0] || 'https://via.placeholder.com/150'}" alt="${ad.title}" class="w-full h-40 object-cover rounded mb-2" />
        <h3 class="text-lg font-semibold text-gray-800">${ad.title}</h3>
        <p class="text-gray-600 font-medium mb-1">${ad.currency || "₦"}${ad.price}</p>
        <p class="text-sm text-gray-500">📍 ${ad.location} • ${ad.category}</p>
        <p class="text-sm text-gray-400">Delivery: ${ad.delivery_time || "N/A"}</p>
        <div class="mt-3 flex gap-3">
          <a href="edit-ad.html?id=${ad.id}" class="text-blue-600 text-sm font-medium">✏️ Edit</a>
          <button class="text-red-600 text-sm font-medium" data-id="${ad.id}">🗑️ Delete</button>
        </div>
      `;

      // Delete handler
      div.querySelector("button").addEventListener("click", async (e) => {
        const confirmDelete = confirm("Are you sure you want to delete this ad?");
        if (!confirmDelete) return;

        const adId = e.target.dataset.id;
        const { error: deleteError } = await supabase
          .from("ads")
          .delete()
          .eq("id", adId);

        if (deleteError) {
          alert("Failed to delete ad.");
          console.error(deleteError);
        } else {
          alert("Ad deleted successfully!");
          div.remove();
        }
      });

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='text-red-500'>Something went wrong.</p>";
  }
}
