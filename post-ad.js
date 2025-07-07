// js/post-ad.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const categorySelect = document.getElementById("category");
  const extraFields = document.getElementById("extra-fields");
  const imageInput = document.getElementById("images");
  const imagePreview = document.getElementById("image-preview");

  // 🖼️ Image preview for max 5
  imageInput.addEventListener("change", () => {
    imagePreview.innerHTML = "";
    [...imageInput.files].slice(0, 5).forEach(file => {
      const img = document.createElement("img");
      img.className = "w-20 h-20 object-cover rounded border";
      img.src = URL.createObjectURL(file);
      imagePreview.appendChild(img);
    });
  });

  // 🎯 Show sub-fields based on selected category
  categorySelect.addEventListener("change", () => {
    const cat = categorySelect.value;
    extraFields.innerHTML = "";

    if (cat === "Fashion") {
      extraFields.innerHTML = `
        <input placeholder="Brand" class="w-full border p-2 rounded" />
        <input placeholder="Size (e.g. M, L, XL)" class="w-full border p-2 rounded" />
        <input placeholder="Color" class="w-full border p-2 rounded" />
        <select class="w-full border p-2 rounded">
          <option disabled selected>Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Unisex</option>
        </select>
      `;
    } else if (cat === "Electronics") {
      extraFields.innerHTML = `
        <input placeholder="Brand" class="w-full border p-2 rounded" />
        <input placeholder="Model" class="w-full border p-2 rounded" />
        <input placeholder="Warranty (e.g. 1 Year)" class="w-full border p-2 rounded" />
      `;
    } else if (cat === "Real Estate") {
      extraFields.innerHTML = `
        <input placeholder="Property Type (e.g. Apartment, Office)" class="w-full border p-2 rounded" />
        <input placeholder="No. of Rooms" class="w-full border p-2 rounded" />
        <select class="w-full border p-2 rounded">
          <option disabled selected>Furnishing</option>
          <option>Furnished</option>
          <option>Semi-Furnished</option>
          <option>Unfurnished</option>
        </select>
      `;
    }
  });

  // 📝 Handle form submit
  form.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const price = parseFloat(document.getElementById("price").value.trim());
    const currency = document.getElementById("currency").value;
    const category = categorySelect.value;
    const description = document.getElementById("description").value.trim();
    const delivery = [...document.getElementById("delivery").selectedOptions].map(opt => opt.value);
    const images = imageInput.files;

    // 🚀 Grab sub-fields
    const extraInputs = [...extraFields.querySelectorAll("input, select")];
    const extraDetails = {};
    extraInputs.forEach(input => {
      if (input.value) {
        const key = input.placeholder || input.name || input.id;
        extraDetails[key] = input.value;
      }
    });

    // ✨ Process up to 5 image previews (URLs)
    const imagePreviews = [];
    [...images].slice(0, 5).forEach(file => {
      const url = URL.createObjectURL(file);
      imagePreviews.push(url);
    });

    // 🛍️ Build ad object
    const newAd = {
      id: Date.now(),
      title,
      price,
      currency,
      category,
      description,
      deliveryTo: delivery,
      extraDetails,
      imagePreviews,
      seller: "Current User", // later pull from login
      datePosted: new Date().toISOString()
    };

    // 💾 Save ad to localStorage
    const ads = JSON.parse(localStorage.getItem("shopnest-ads") || "[]");
    ads.push(newAd);
    localStorage.setItem("shopnest-ads", JSON.stringify(ads));

    alert("Ad posted successfully!");
    window.location.href = "dashboard.html";
  });
});
