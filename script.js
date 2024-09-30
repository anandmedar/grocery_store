(function () {
  emailjs.init("Uqz0k8QHR5cXFwlQq"); // Replace with your actual Public Key
})();

const items = [
  { id: 1, name: "Apples", price: 1.5 },
  { id: 2, name: "Bananas", price: 1.2 },
  { id: 3, name: "Oranges", price: 1.0 },
  { id: 4, name: "Milk", price: 2.0 },
  { id: 5, name: "Bread", price: 1.5 },
  { id: 6, name: "Eggs", price: 3.0 },
  { id: 7, name: "Chicken", price: 5.0 },
  { id: 8, name: "Rice", price: 1.8 },
  { id: 9, name: "Cheese", price: 2.5 },
  { id: 10, name: "Tomatoes", price: 1.4 },
];

let cart = {};

function renderItems() {
  const itemList = document.getElementById("item-list");
  items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: $${item.price.toFixed(2)}</p>
            <button onclick="addToCart(${item.id}, -1)">-</button>
            <span id="count-${item.id}">0</span>
            <button onclick="addToCart(${item.id}, 1)">+</button>
        `;
    itemList.appendChild(itemDiv);
  });
}

function addToCart(id, change) {
  if (!cart[id]) {
    cart[id] = 0;
  }
  cart[id] += change;
  if (cart[id] < 0) cart[id] = 0;

  document.getElementById(`count-${id}`).innerText = cart[id];
}

document.getElementById("checkout").addEventListener("click", function () {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;

  if (!name || !address || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  let total = 0;
  let orderDetails = `Name: ${name}\nAddress: ${address}\nPhone: ${phone}\n\nOrder Details:\n`;

  for (const id in cart) {
    if (cart[id] > 0) {
      const item = items.find((i) => i.id == id);
      const itemTotal = item.price * cart[id];
      total += itemTotal;
      orderDetails += `${item.name}: ${cart[id]} @ $${item.price.toFixed(
        2
      )} each = $${itemTotal.toFixed(2)}\n`;
    }
  }

  orderDetails += `\nTotal: $${total.toFixed(2)}`;

  const templateParams = {
    to_email: "your_email@example.com", // Replace with your email
    order_details: orderDetails,
    name: name,
    address: address,
    phone: phone,
  };

  // Send email using EmailJS
  emailjs.send("service_v2sy1dh", "template_3ikx35e", templateParams).then(
    function (response) {
      alert("Order details sent successfully!");
      cart = {}; // Clear the cart after sending
      renderItems(); // Reset the item counts
      document.getElementById("name").value = "";
      document.getElementById("address").value = "";
      document.getElementById("phone").value = "";
    },
    function (error) {
      alert("Failed to send order details. Please try again later.");
      console.error("Error sending email:", error);
    }
  );
});

renderItems();
