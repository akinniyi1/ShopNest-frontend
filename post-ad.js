document.getElementById("images")?.addEventListener("change", function(event) {
  const preview = document.getElementById("preview");
  preview.innerHTML = "";
  const files = event.target.files;
  if (files.length > 5) {
    alert("You can only upload up to 5 images.");
    event.target.value = "";
    return;
  }
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "w-20 h-20 object-cover border";
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

document.getElementById("adForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Ad posted! (Backend integration coming soon)");
});
