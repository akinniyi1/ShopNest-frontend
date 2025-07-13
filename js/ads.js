const SUPABASE_URL = "https://oryydgfrezvhfqdkhjsx.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y";
const adsEndpoint = `${SUPABASE_URL}/rest/v1/ads`;
const adsPerPage = 6;

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

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
    const res = await fetch(`${adsEndpoint}?select=*`, { headers });
    if (!res.ok) throw new Error("Failed to fetch ads");
    allAds = await res.json();
  } catch (err) {
    console.error("Error loading ads:", err.message);
    allAds = seedDummyAds();
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

    const image = (Array.isArray(ad.images) && ad.images.length > 0)
      ? ad.images[0]
      : ad.image || "https://via.placeholder.com/300x200";

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

function seedDummyAds() {
  return [
    {
      title: "Laptop with SSD",
      price: 200000,
      currency: "NGN",
      location: "Lagos, Nigeria",
      category: "Electronics",
      plan: "premium",
      deliveryTime: 7,
      images: ["https://via.placeholder.com/300x200"]
    },
    {
      title: "Trendy Apparel",
      price: 120000,
      currency: "NGN",
      location: "Abuja, Nigeria",
      category: "Fashion",
      plan: "free",
      deliveryTime: 5,
      images: ["https://via.placeholder.com/300x200"]
    },
    {
      title: "3 Bedroom Villa",
      price: 45000000,
      currency: "NGN",
      location: "Port Harcourt, Nigeria",
      category: "Real Estate",
      plan: "premium",
      deliveryTime: 14,
      images: ["https://via.placeholder.com/300x200"]
    },
    {
      title: "Wheel Loader",
      price: 25000,
      currency: "USD",
      location: "Kano, Nigeria",
      category: "Machinery",
      plan: "premium",
      deliveryTime: 10,
      images: ["https://via.placeholder.com/300x200"]
    }
  ];
}
