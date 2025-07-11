const backendURL = "https://shopnest-backend-43fu.onrender.com/api/ads";
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
    const res = await fetch(backendURL);
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
    ad.title.toLowerCase().includes(searchTerm) ||
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

    const image = Array.isArray(ad.images) ? ad.images[0] : ad.image || "https://via.placeholder.com/300x200";

    div.innerHTML = `
      <img src="${image}" alt="${ad.title}" class="rounded mb-2 w-full h-32 object-cover" />
      <h3 class="font-medium text-gray-800">${ad.title}</h3>
      <p class="text-indigo-600 font-semibold">₦${ad.price}</p>
      <p class="text-sm text-gray-500">${ad.location || "Unknown Location"}</p>
    `;
    container.appendChild(div);
  });

  // Optional: update page display
  const pageInfo = document.getElementById("pageInfo");
  if (pageInfo) {
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(ads.length / adsPerPage)}`;
  }
}

function seedDummyAds() {
  return [
    {
      title: "Laptop with SSD",
      price: "200000",
      location: "Lagos, Nigeria",
      category: "Electronics",
      plan: "premium",
      deliveryTime: 7,
      image: "https://via.placeholder.com/300x200"
    },
    {
      title: "Trendy Apparel",
      price: "120000",
      location: "Abuja, Nigeria",
      category: "Fashion",
      plan: "free",
      deliveryTime: 5,
      image: "https://via.placeholder.com/300x200"
    },
    {
      title: "3 Bedroom Villa",
      price: "45000000",
      location: "Port Harcourt, Nigeria",
      category: "Real Estate",
      plan: "premium",
      deliveryTime: 14,
      image: "https://via.placeholder.com/300x200"
    },
    {
      title: "Wheel Loader",
      price: "25000",
      location: "Kano, Nigeria",
      category: "Machinery",
      plan: "premium",
      deliveryTime: 10,
      image: "https://via.placeholder.com/300x200"
    }
  ];
}
