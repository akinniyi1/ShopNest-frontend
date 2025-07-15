import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const categorySelect = document.getElementById("category");
  const extraFields = document.getElementById("extra-fields");
  const imageInput = document.getElementById("images");
  const imagePreview = document.getElementById("image-preview");
  const messageBox = document.getElementById("statusMessage");
  const imgbbApiKey = "f85ea26f2ede140972a8845b5219f32d";

  // 🖼️ Image preview (max 5)
  imageInput.addEventListener("change", () => {
    imagePreview.innerHTML = "";
    [...imageInput.files].slice(0, 5).forEach(file => {
      const img = document.createElement("img");
      img.className = "w-20 h-20 object-cover rounded border";
      img.src = URL.createObjectURL(file);
      imagePreview.appendChild(img);
    });
  });

  // 🎯 Dynamic sub-fields by category
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

  // 📝 Form submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "";

    const user = JSON.parse(localStorage.getItem("shopnestUser"));
    if (!user || !user.email) {
      showError("Please login first.");
      return;
    }

    const title = document.getElementById("title").value.trim();
    const price = parseFloat(document.getElementById("price").value.trim());
    const currency = document.getElementById("currency").value;
    const category = categorySelect.value;
    const description = document.getElementById("description").value.trim();
    const delivery = [...document.getElementById("delivery").selectedOptions].map(opt => opt.value);
    const images = [...imageInput.files].slice(0, 5);

    if (!title || !description || !category || isNaN(price)) {
      showError("Please fill all required fields correctly.");
      return;
    }

    // 🚀 Sub-options
    const extraInputs = [...extraFields.querySelectorAll("input, select")];
    const subOptions = {};
    extraInputs.forEach(input => {
      if (input.name && input.value) {
        subOptions[input.name] = input.value;
      }
    });

    // 🖼️ Upload to imgbb
    let uploadedImageUrls = [];
    try {
      for (const img of images) {
        const formData = new FormData();
        formData.append("image", img);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          uploadedImageUrls.push(data.data.url);
        } else {
          throw new Error("Image upload failed");
        }
      }
    } catch (err) {
      showError("❌ Image upload failed.");
      return;
    }

    // 📦 Create ad object
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
      images: uploadedImageUrls,
      createdAt: new Date().toISOString()
    };

    // 🧾 Save to Firestore
    try {
      await addDoc(collection(db, "ads"), newAd);
      messageBox.textContent = "✅ Ad posted successfully!";
      messageBox.className = "text-green-600 text-center mt-3";
      form.reset();
      imagePreview.innerHTML = "";
    } catch (err) {
      console.error("Firestore error:", err);
      showError("❌ Failed to save ad.");
    }
  });

  function showError(message) {
    messageBox.textContent = message;
    messageBox.className = "text-red-600 text-center mt-3";
    messageBox.scrollIntoView({ behavior: "smooth" });
  }
});
