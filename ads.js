export function loadAds() {
  const raw = localStorage.getItem("shopnest_ads");
  return raw ? JSON.parse(raw) : [];
}

export function saveAds(ads) {
  localStorage.setItem("shopnest_ads", JSON.stringify(ads));
}

export function addAd(ad) {
  const ads = loadAds();
  ads.unshift(ad);
  saveAds(ads);
}

export function renderAds(container, category = null, location = null) {
  let ads = loadAds();
  if (category) ads = ads.filter(ad => ad.category === category);
  if (location) ads = ads.filter(ad => ad.location === location);

  container.innerHTML = ads.length === 0 ? "<p>No ads found.</p>" : "";

  ads.forEach(ad => {
    const div = document.createElement("div");
    div.className = "bg-white shadow rounded-lg p-4 relative";
    div.innerHTML = `
      ${ad.plan === "premium" ? '<span class="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded">Premium</span>' : ''}
      <h3 class="text-lg font-semibold text-gray-800">${ad.title}</h3>
      <p class="text-gray-600">$${ad.price}</p>
      <p class="text-xs text-gray-400">📍 ${ad.location} • ${ad.category}</p>
      <p class="text-sm text-gray-500 mt-2">Delivery: ${ad.deliveryTime} days</p>
    `;
    container.appendChild(div);
  });
}
