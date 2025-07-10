// js/ads.js

export function loadAds() {
  const data = localStorage.getItem("shopnest_ads");
  return data ? JSON.parse(data) : seedDummyAds();
}

function seedDummyAds() {
  const dummy = [
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
  localStorage.setItem("shopnest_ads", JSON.stringify(dummy));
  return dummy;
}

// Render ads
const container = document.getElementById("adsContainer");
if (container) {
  const ads = loadAds();
  ads.forEach(ad => {
    const div = document.createElement("div");
    div.className = "bg-white p-3 rounded shadow";

    div.innerHTML = `
      <img src="${ad.image}" alt="${ad.title}" class="rounded mb-2 w-full h-32 object-cover" />
      <h3 class="font-medium text-gray-800">${ad.title}</h3>
      <p class="text-indigo-600 font-semibold">₦${ad.price}</p>
      <p class="text-sm text-gray-500">${ad.location}</p>
    `;
    container.appendChild(div);
  });
}
