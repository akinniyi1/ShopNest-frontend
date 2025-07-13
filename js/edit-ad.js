const supabase = supabase.createClient(
  "https://oryydgfrezvhfqdkhjsx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);

const imagekit = new ImageKit({
  publicKey: "public_Yp8vUzpIsqZaLYWMveEgVPK9csU=",
  urlEndpoint: "https://ik.imagekit.io/oqa3n7tsh"
});

const params = new URLSearchParams(window.location.search);
const adId = params.get("id");
const form = document.getElementById("editAdForm");
const imageInput = document.getElementById("images");
const imagePreview = document.getElementById("image-preview");
const messageBox = document.getElementById("statusMessage");

// 🧠 Load ad details
async function loadAd() {
  const { data, error } = await supabase.from("ads").select("*").eq("id", adId).single();
  if (error) {
    messageBox.textContent = "❌ Failed to load ad.";
    return;
  }

  document.getElementById("title").value = data.title;
  document.getElementById("price").value = data.price;
  document.getElementById("description").value = data.description;
  document.getElementById("category").value = data.category;

  // Preview current images
  imagePreview.innerHTML = data.images.map(url => `
    <img src="${url}" class="w-20 h-20 object-cover rounded border" />
  `).join("");

  form.dataset.existingImages = JSON.stringify(data.images || []);
}

loadAd();

// ✏️ Handle update
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
      const uploaded = await Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
          imagekit.upload({
            file,
            fileName: `ad_${Date.now()}_${file.name}`
          }, (err, result) => {
            if (err) reject(err);
            else resolve(result.url);
          });
        });
      }));
      images = uploaded;
    } catch (err) {
      console.error("Image upload error", err);
      messageBox.textContent = "❌ Failed to upload images.";
      return;
    }
  }

  const { error } = await supabase.from("ads").update({
    title, price, description, category, images
  }).eq("id", adId);

  if (error) {
    console.error(error);
    messageBox.textContent = "❌ Update failed.";
  } else {
    messageBox.textContent = "✅ Ad updated successfully!";
  }
});
