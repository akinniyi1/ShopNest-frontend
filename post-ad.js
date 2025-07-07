// js/post-ad.js

const categorySelect = document.getElementById("category");
const categoryFields = document.getElementById("category-fields");

categorySelect.addEventListener("change", () => {
  const selected = categorySelect.value;
  categoryFields.innerHTML = "";

  if (selected === "Fashion") {
    categoryFields.innerHTML += `
      <input type="text" placeholder="Brand" class="w-full border p-2 rounded" id="fashion-brand" />
      <select id="fashion-gender" class="w-full border p-2 rounded">
        <option disabled selected>Select Gender</option>
        <option>Men</option>
        <option>Women</option>
        <option>Unisex</option>
      </select>
      <input type="text" placeholder="Available Sizes (e.g. S, M, L)" class="w-full border p-2 rounded" id="fashion-sizes" />
      <input type="number" placeholder="Discount (%)" class="w-full border p-2 rounded" id="fashion-discount" />
    `;
  }

  if (selected === "Real Estate") {
    categoryFields.innerHTML += `
      <input type="number" placeholder="No. of Bedrooms" class="w-full border p-2 rounded" id="bedrooms" />
      <input type="text" placeholder="Location (City)" class="w-full border p-2 rounded" id="realestate-location" />
      <select id="furnished" class="w-full border p-2 rounded">
        <option disabled selected>Furnished?</option>
        <option>Yes</option>
        <option>No</option>
      </select>
    `;
  }

  if (selected === "Electronics") {
    categoryFields.innerHTML += `
      <input type="text" placeholder="Brand" class="w-full border p-2 rounded" id="electronic-brand" />
      <select id="warranty" class="w-full border p-2 rounded">
        <option disabled selected>Warranty?</option>
        <option>Yes</option>
        <option>No</option>
      </select>
    `;
  }

  // Add more if needed...
});

window.submitAd = function () {
  const ad = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    currency: document.getElementById("currency").value,
    category: categorySelect.value,
    description: document.getElementById("description").value,
    deliveryTime: document.getElementById("delivery-time").value,
    deliveryCountries: document.getElementById("delivery-countries").value,
    image: "", // Will be replaced when backend is added
    extras: {},
    createdAt: new Date().toISOString()
  };

  // Category-specific data
  switch (ad.category) {
    case "Fashion":
      ad.extras.brand = document.getElementById("fashion-brand")?.value;
      ad.extras.gender = document.getElementById("fashion-gender")?.value;
      ad.extras.sizes = document.getElementById("fashion-sizes")?.value;
      ad.extras.discount = document.getElementById("fashion-discount")?.value;
      break;

    case "Real Estate":
      ad.extras.bedrooms = document.getElementById("bedrooms")?.value;
      ad.extras.location = document.getElementById("realestate-location")?.value;
      ad.extras.furnished = document.getElementById("furnished")?.value;
      break;

    case "Electronics":
      ad.extras.brand = document.getElementById("electronic-brand")?.value;
      ad.extras.warranty = document.getElementById("warranty")?.value;
      break;
  }

  // Basic validation
  if (!ad.title || !ad.price || !ad.category || !ad.description) {
    alert("Please fill all required fields.");
    return;
  }

  console.log("Ad prepared:", ad);
  alert("Ad submitted! (Simulated, will connect to backend soon)");
};
