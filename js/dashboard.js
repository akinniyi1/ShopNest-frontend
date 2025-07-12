import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const container = document.getElementById("myAdsContainer");
const backendUrl = "https://shopnest-backend-43fu.onrender.com";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    container.innerHTML = "<p class='text-red-600'>Please log in to view your dashboard.</p>";
    return;
  }

  try {
    const res = await fetch(`${backendUrl}/api/ads`);
    const allAds = await res.json();
    const userAds = allAds.filter(ad => ad.userEmail === user.email);

    if (userAds.length === 0) {
      container.innerHTML = "<p class='text-gray-500'>You have not posted any ads yet.</p>";
    } else {
      container.innerHTML = "";
      userAds.forEach(ad => {
        const div = document.createElement("div");
        div.className = "bg-white shadow rounded-lg p-4 relative";

        div.innerHTML = `
          ${ad.plan === "premium" ? `<span class="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded">Premium</span>` : ""}
          <img src="${ad.images?.[0] || 'https://via.placeholder.com/150'}" alt="${ad.title}" class="w-full h-40 object-cover rounded mb-2" />
          <h3 class="text-lg font-semibold text-gray-800">${ad.title}</h3>
          <p class="text-gray-600 font-medium mb-1">${ad.currency === "USD" ? "$" : "₦"}${ad.price}</p>
          <p class="text-sm text-gray-500">📍 ${ad.location} • ${ad.category}</p>
          <p class="text-sm text-gray-400">Delivery: ${ad.deliveryTime} days</p>
          <div class="mt-3 flex gap-3">
            <a href="edit-ad.html?id=${ad.id}" class="text-blue-600 text-sm font-medium">✏️ Edit</a>
            <button class="text-red-600 text-sm font-medium" data-id="${ad.id}">🗑️ Delete</button>
          </div>
        `;

        div.querySelector("button").addEventListener("click", async (e) => {
          const confirmDelete = confirm("Are you sure you want to delete this ad?");
          if (!confirmDelete) return;

          const adId = e.target.dataset.id;

          try {
            const delRes = await fetch(`${backendUrl}/api/ads/${adId}`, {
              method: "DELETE"
            });

            if (delRes.ok) {
              alert("Ad deleted successfully!");
              div.remove();
            } else {
              alert("Failed to delete ad.");
            }
          } catch (err) {
            console.error(err);
            alert("Error deleting ad.");
          }
        });

        container.appendChild(div);
      });
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='text-red-500'>Failed to load your ads.</p>";
  }
});
