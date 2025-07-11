document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const categorySelect = document.getElementById("category");
  const extraFields = document.getElementById("extra-fields");
  const imageInput = document.getElementById("images");
  const imagePreview = document.getElementById("image-preview");
  const messageBox = document.getElementById("statusMessage");

  const backendURL = "https://shopnest-backend-43fu.onrender.com";

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
        <input name="Brand" placeholder="Brand" class="w-full border p-2 rounded" />
        <input name="Size" placeholder="Size (e.g. M, L, XL)" class="w-full border p-2 rounded" />
        <input name="Color" placeholder="Color" class="w-full border p-2 rounded" />
        <select name="Gender" class="w-full border p-2 rounded">
          <option disabled selected>Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Unisex</option>
        </select>
      `;
    } else if (cat === "Electronics") {
      extraFields.innerHTML = `
        <input name="Brand" placeholder="Brand" class="w-full border p-2 rounded" />
        <input name="Model" placeholder="Model" class="w-full border p-2 rounded" />
        <input name="Warranty" placeholder="Warranty (e.g. 1 Year)" class="w-full border p-2 rounded" />
      `;
    } else if (cat === "Real Estate") {
      extraFields.innerHTML = `
        <input name="Property Type" placeholder="Property Type (e.g. Apartment)" class="w-full border p-2 rounded" />
        <input name="Rooms" placeholder="No. of Rooms" class="w-full border p-2 rounded" />
        <select name="Furnishing" class="w-full border p-2 rounded">
          <option disabled selected>Furnishing</option>
          <option>Furnished</option>
          <option>Semi-Furnished</option>
          <option>Unfurnished</option>
        </select>
      `;
    }
  });

  // 📝 Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "";

    const user = JSON.parse(localStorage.getItem("shopnestUser"));
    if (!user || !user.email) {
      messageBox.textContent = "Please login first.";
      messageBox.className = "text-red-600 text-center mt-3";
      return;
    }

    const title = document.getElementById("title").value.trim();
    const price = parseFloat(document.getElementById("price").value.trim());
    const currency = document.getElementById("currency").value;
    const category = categorySelect.value;
    const description = document.getElementById("description").value.trim();
    const delivery = [...document.getElementById("delivery").selectedOptions].map(opt => opt.value);
    const images = [...imageInput.files].slice(0, 5);

    // 🚀 Extract sub-options
    const extraInputs = [...extraFields.querySelectorAll("input, select")];
    const subOptions = {};
    extraInputs.forEach(input => {
      if (input.name && input.value) {
        subOptions[input.name] = input.value;
      }
    });

    // 🔃 Convert images to Base64
    const imageBase64List = await Promise.all(
      images.map(file => toBase64(file))
    );

    const newAd = {
      userEmail: user.email,
      title,
      description,
      price,
      currency,
      category,
      subOptions,
      location: user.country,
      deliveryTime: delivery.join(', '),
      images: imageBase64List
    };

    try {
      const res = await fetch(`${backendURL}/api/ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAd)
      });

      const data = await res.json();
      if (res.ok) {
        messageBox.textContent = "✅ Ad posted successfully!";
        messageBox.className = "text-green-600 text-center mt-3";
        form.reset();
        imagePreview.innerHTML = "";
      } else {
        messageBox.textContent = data.error || "Failed to post ad.";
        messageBox.className = "text-red-600 text-center mt-3";
      }
    } catch (err) {
      messageBox.textContent = "Server error. Please try again.";
      messageBox.className = "text-red-600 text-center mt-3";
    }
  });

  // Helper: Convert file to base64
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject("Error reading file");
      reader.readAsDataURL(file);
    });
  }
});
