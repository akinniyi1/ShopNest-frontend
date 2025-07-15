const container = document.getElementById("myAdsContainer");

// ✅ Check if logged in
const user = JSON.parse(localStorage.getItem("shopnestUser"));

if (!user || !user.email) {
  container.innerHTML = "<p class='text-red-600'>Please log in to view your dashboard.</p>";
} else {
  loadUserAds();
}

// ✅ Load User Ads from Firestore
async function loadUserAds() {
  try {
    const snapshot = await firebase.firestore()
      .collection("ads")
      .where("userEmail", "==", user.email)
      .get();

    if (snapshot.empty) {
      container.innerHTML = "<p class='text-gray-500'>You have not posted any ads yet.</p>";
      return;
    }

    container.innerHTML = "";
    snapshot.forEach(doc => {
      const ad = doc.data();
      const adId = doc.id;

      const div = document.createElement("div");
      div.className = "bg-white shadow rounded-lg p-4 relative";

      div.innerHTML = `
        ${ad.plan === "premium" ? `<span class="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded">Premium</span>` : ""}
        <img src="${ad.images?.[0] || 'https://via.placeholder.com/150'}" alt="${ad.title}" class="w-full h-40 object-cover rounded mb-2" />
        <h3 class="text-lg font-semibold text-gray-800">${ad.title}</h3>
        <p class="text-gray-600 font-medium mb-1">${ad.currency || "₦"}${ad.price}</p>
        <p class="text-sm text-gray-500">📍 ${ad.location} • ${ad.category}</p>
        <p class="text-sm text-gray-400">Delivery: ${ad.deliveryTime || "N/A"}</p>
        <div class="mt-3 flex gap-3">
          <a href="edit-ad.html?id=${adId}" class="text-blue-600 text-sm font-medium">✏️ Edit</a>
          <button class="text-red-600 text-sm font-medium" data-id="${adId}">🗑️ Delete</button>
        </div>
      `;

      // ❌ Handle Delete
      div.querySelector("button").addEventListener("click", async (e) => {
        const confirmDelete = confirm("Are you sure you want to delete this ad?");
        if (!confirmDelete) return;

        try {
          await firebase.firestore().collection("ads").doc(adId).delete();
          alert("Ad deleted successfully!");
          div.remove();
        } catch (deleteError) {
          alert("Failed to delete ad.");
          console.error(deleteError);
        }
      });

      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='text-red-500'>Something went wrong.</p>";
  }
}
