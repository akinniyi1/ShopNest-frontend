// Firebase config should already be imported in firebase-config.js
const imgbbApiKey = "f85ea26f2ede140972a8845b5219f32d";

const params = new URLSearchParams(window.location.search);
const adId = params.get("id");
const form = document.getElementById("editAdForm");
const imageInput = document.getElementById("images");
const imagePreview = document.getElementById("image-preview");
const messageBox = document.getElementById("statusMessage");

// 🧠 Load ad details from Firestore
async function loadAd() {
  try {
    const adRef = await firebase.firestore().collection("ads").doc(adId).get();
    if (!adRef.exists) {
      messageBox.textContent = "❌ Ad not found.";
      return;
    }

    const data = adRef.data();
    document.getElementById("title").value = data.title;
    document.getElementById("price").value = data.price;
    document.getElementById("description").value = data.description;
    document.getElementById("category").value = data.category;

    // Show existing images
    imagePreview.innerHTML = (data.images || []).map(url => `
      <img src="${url}" class="w-20 h-20 object-cover rounded border" />
    `).join("");

    form.dataset.existingImages = JSON.stringify(data.images || []);
  } catch (error) {
    console.error(error);
    messageBox.textContent = "❌ Failed to load ad.";
  }
}

loadAd();

// ✏️ Handle ad update
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageBox.textContent = "Updating...";

  const title = document.getElementById("title").value;
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const files = [...imageInput.files].slice(0, 5);
  let images = JSON.parse(form.dataset.existingImages);

  if (files.length > 0) {
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          return data.data.url;
        } else {
          throw new Error("Image upload failed");
        }
      }));
      images = uploaded;
    } catch (err) {
      console.error("Image upload error", err);
      messageBox.textContent = "❌ Failed to upload images.";
      return;
    }
  }

  try {
    await firebase.firestore().collection("ads").doc(adId).update({
      title, price, description, category, images
    });
    messageBox.textContent = "✅ Ad updated successfully!";
  } catch (error) {
    console.error(error);
    messageBox.textContent = "❌ Failed to update ad.";
  }
});
