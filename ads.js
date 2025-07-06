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
  if (ads.length === 0) {
    container.innerHTML = '<p>No ads yet.</p>';
    return;
  }
  container.innerHTML = "";
  ads.forEach(ad => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>${ad.title}</h3><p>$${ad.price}</p>`;
    container.appendChild(div);
  });
}