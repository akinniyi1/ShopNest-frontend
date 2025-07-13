document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postAdForm");
  const categorySelect = document.getElementById("category");
  const extraFields = document.getElementById("extra-fields");
  const imageInput = document.getElementById("images");
  const imagePreview = document.getElementById("image-preview");
  const messageBox = document.getElementById("statusMessage");

  // ✅ Supabase config
  const supabase = supabase.createClient(
    "https://oryydgfrezvhfqdkhjsx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeXlkZ2ZyZXp2aGZxZGtoanN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzA5NjMsImV4cCI6MjA2ODAwNjk2M30.KMsr_RYFZaldt_hMfkHh2Qn-Mq5fIjk5Beb8cQQmt8Y"
  );

  // ✅ ImageKit config
  const imagekit = new ImageKit({
    publicKey: "public_Yp8vUzpIsqZaLYWMveEgVPK9csU=",
    urlEndpoint: "https://ik.imagekit.io/oqa3n7tsh"
  });

  // 🖼️ Preview selected images
  imageInput.addEventListener("change", () => {
    imagePreview.innerHTML = "";
    [...imageInput.files].slice(0, 5).forEach(file => {
      const img = document.createElement("img");
      img.className = "w-20 h-20 object-cover rounded border";
      img.src = URL.createObjectURL(file);
      imagePreview.appendChild(img);
    });
  });

  // 🎯 Dynamic sub-options per category
  categorySelect.addEventListener("change", () => {
    const cat = categorySelect.value;
    extraFields.innerHTML = "";

    const templates = {
      Fashion: `
        <input name="Brand" placeholder="Brand" class="w-full border p-2 rounded" />
        <input name="Size" placeholder="Size (e.g. M, L, XL)" class="w-full border p-2 rounded" />
        <input name="Color" placeholder="Color" class="w-full border p-2 rounded" />
        <select name="Gender" class="w-full border p-2 rounded">
          <option disabled selected>Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Unisex</option>
        </select>
      `,
      Electronics: `
        <input name="Brand" placeholder="Brand" class="w-full border p-2 rounded" />
        <input name="Model" placeholder="Model" class="w-full border p-2 rounded" />
        <input name="Warranty" placeholder="Warranty (e.g. 1 Year)" class="w-full border p-2 rounded" />
      `,
      "Real Estate": `
        <input name="Property Type" placeholder="Property Type (e.g. Apartment)" class="w-full border p-2 rounded" />
        <input name="Rooms" placeholder="No. of Rooms" class="w-full border p-2 rounded" />
        <select name="Furnishing" class="w-full border p-2 rounded">
          <option disabled selected>Furnishing</option>
          <option>Furnished</option>
          <option>Semi-Furnished</option>
          <option>Unfurnished</option>
        </select>
      `
    };

    extraFields.innerHTML = templates[cat] || "";
  });

  // 📤 Upload image to ImageKit
  async function uploadToImageKit(file) {
    return new Promise((resolve, reject) => {
      imagekit.upload({
        file,
        fileName: `shopnest_${Date.now()}_${file.name}`
      }, (err, result) => {
        if (err) {
          console.error("ImageKit Error:", err);
          reject(err);
        } else {
          resolve(result.url);
        }
      });
    });
  }

  // 📝 Submit ad form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "";

    const user = JSON.parse(localStorage.getItem("shopnestUser"));
    if (!user?.email) {
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
    const location = user.country || "Not set";
    const files = [...imageInput.files].slice(0, 5);

    if (!title || !price || !category || !description || !files.length) {
      messageBox.textContent = "Please fill all required fields and upload at least 1 image.";
      messageBox.className = "text-red-600 text-center mt-3";
      return;
    }

    const subInputs = [...extraFields.querySelectorAll("input, select")];
    const subOptions = {};
    subInputs.forEach(input => {
      if (input.name && input.value) {
        subOptions[input.name] = input.value;
      }
    });

    try {
      messageBox.textContent = "Uploading images...";
      const imageURLs = await Promise.all(files.map(uploadToImageKit));

      const { data, error } = await supabase.from("ads").insert([{
        user_email: user.email,
        title,
        description,
        price,
        category,
        sub_options: subOptions,
        location,
        delivery_time: delivery.join(", "),
        images: imageURLs,
        status: "active"
      }]);

      if (error) {
        console.error(error);
        messageBox.textContent = "❌ Failed to post ad.";
        messageBox.className = "text-red-600 text-center mt-3";
      } else {
        messageBox.textContent = "✅ Ad posted successfully!";
        messageBox.className = "text-green-600 text-center mt-3";
        form.reset();
        imagePreview.innerHTML = "";
      }
    } catch (err) {
      console.error(err);
      messageBox.textContent = "⚠️ Upload failed. Please try again.";
      messageBox.className = "text-red-600 text-center mt-3";
    }
  });
});
