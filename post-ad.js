import { addAd } from './ads.js';
document.getElementById("adForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const deliveryTime = document.getElementById("deliveryTime").value;
  const files = document.getElementById("images").files;
  const readers = Array.from(files).map(file => {
    return new Promise(res => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.readAsDataURL(file);
    });
  });
  Promise.all(readers).then(images => {
    addAd({ title, price, deliveryTime, images });
    alert("Ad posted!");
    window.location.href = "dashboard.html";
  });
});