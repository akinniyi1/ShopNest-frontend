fetch("https://shopnest-backend-43fu.onrender.com/api/ads", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    userEmail: "test@shopnest.com",
    title: "Test Ad",
    description: "Test description",
    price: 1000,
    currency: "₦",
    category: "Fashion",
    subOptions: { Color: "Black", Size: "M" },
    location: "Nigeria",
    deliveryTime: "3",
    images: []
  })
}).then(res => res.json()).then(console.log).catch(console.error);
