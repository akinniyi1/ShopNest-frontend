// post-ad.js
import { addAd } from './ads.js';

document.getElementById("adForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const price = document.getElementById("price").value.trim();
  const location = document.getElementById("location").value.trim();
  const category = document.getElementById("category").value;
  const plan = document.getElementById("plan").value;
  const deliveryTime = document.getElementById("deliveryTime").value.trim();
  const errorBox = document.getElementById("formError");

  if (!title || !price || !location || !category || !deliveryTime) {
    errorBox.textContent = "Please fill in all required fields.";
    errorBox.classList.remove("hidden");
    return;
  }

  const ad = {
    title,
    price,
    location,
    category,
    plan,
    deliveryTime
  };

  addAd(ad);
  alert("Ad posted!");
  window.location.href = "dashboard.html";
});
