import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const adsPerPage = 6;
let allAds = [];
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  loadAds();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      currentPage = 1;
      renderAds();
    });
  }

  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderAds();
      }
    });

    nextBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredAds().length / adsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderAds();
      }
    });
  }
});

async function loadAds() {
  try {
    const adsSnapshot = await getDocs(collection(db, "ads"));
    allAds = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error loading ads:", err.message);
    allAds = [];
  }
  renderAds();
}

function filteredAds() {
  const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
  return allAds.filter(ad =>
    ad.title?.toLowerCase().includes(searchTerm) ||
    ad.category?.toLowerCase().includes(searchTerm)
  );
}

function renderAds() {
  const container = document.getElementById("adsContainer");
  if (!container) return;

  container.innerHTML = "";
  const ads = filteredAds();
  const start = (currentPage - 1) * adsPerPage;
  const paginated = ads.slice(start, start + adsPerPage);

  if (ads.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500">No ads found.</p>`;
    return;
  }

  paginated.forEach(ad => {
    const div = document.createElement("div");
    div.className = "bg-white p-3 rounded shadow";

    const image = Array.isArray(ad.images) && ad.images.length > 0
      ? ad.images[0]
      : "https://via.placeholder.com/300x200";

    const currencySymbol = ad.currency === "USD" ? "$" : "₦";

    div.innerHTML = `
      <img src="${image}" alt="${ad.title}" class="rounded mb-2 w-full h-32 object-cover" />
      <h3 class="font-medium text-gray-800">${ad.title}</h3>
      <p class="text-indigo-600 font-semibold">${currencySymbol}${ad.price}</p>
      <p class="text-sm text-gray-500">${ad.location || "Unknown Location"}</p>
      <p class="text-xs text-gray-400 mt-1">${ad.category || "Other"}</p>
    `;
    container.appendChild(div);
  });

  const pageInfo = document.getElementById("pageInfo");
  if (pageInfo) {
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(ads.length / adsPerPage)}`;
  }
}
