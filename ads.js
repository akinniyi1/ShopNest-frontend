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
export function renderAds(container) {
  const ads = loadAds();
  container.innerHTML = "";
  if (ads.length === 0) {
    container.innerHTML = "<p>No ads available.</p>";
    return;
  }
  ads.forEach(ad => {
    const div = document.createElement("div");
    div.innerHTML = `<h2>${ad.title}</h2><p>$${ad.price}</p>`;
    container.appendChild(div);
  });
}