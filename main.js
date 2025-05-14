// main.js - phiên bản nâng cấp toàn diện

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fetch sản phẩm từ products.json
fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    products = data;
    renderAllProducts();
    setupSearchAndFilter();
  });

function renderAllProducts() {
  const container = document.getElementById("product-list") || document.getElementById("featured-products") || document.getElementById("bestseller-products");
  if (!container) return;
  container.innerHTML = "";
  products.forEach((product) => {
    container.innerHTML += renderProductCard(product);
  });
}

function renderProductCard(product) {
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" onclick="viewProduct(${product.id})">
      <h3>${product.name}</h3>
      <p>Mã: <strong>${product.code || "SP" + product.id}</strong></p>
      <p class="old-price">${formatPrice(product.oldPrice)}</p>
      <p class="price">${formatPrice(product.price)}</p>
      <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
    </div>
  `;
}

function viewProduct(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

function formatPrice(value) {
  return typeof value === "number" ? value.toLocaleString("vi-VN") + "₫" : value;
}

function addToCart(productId) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity++;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Đã thêm vào giỏ hàng!");
}

function setupSearchAndFilter() {
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterAndRender();
    });
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      filterAndRender();
    });
  }
}

function filterAndRender() {
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;
  const container = document.getElementById("product-list");
  container.innerHTML = "";
  products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchInput) || (p.code && p.code.toLowerCase().includes(searchInput));
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).forEach(product => {
    container.innerHTML += renderProductCard(product);
  });
}

// Trang cart.html
if (window.location.pathname.includes("cart.html")) {
  renderCart();
}

function renderCart() {
  const cartContainer = document.querySelector("main");
  if (!cartContainer) return;
  let total = 0;

  let html = `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <thead>
      <tr style="background: #f0f0f0;">
        <th style="padding: 10px">Sản phẩm</th>
        <th>Đơn giá</th>
        <th>Số lượng</th>
        <th>Thành tiền</th>
        <th></th>
      </tr>
    </thead>
    <tbody>`;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    html += `
      <tr>
        <td style="padding: 10px">${item.name}</td>
        <td>${formatPrice(item.price)}</td>
        <td>
          <button onclick="updateQuantity(${index}, -1)">-</button>
          ${item.quantity}
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </td>
        <td>${formatPrice(itemTotal)}</td>
        <td><button onclick="removeItem(${index})">Xóa</button></td>
      </tr>`;
  });

  html += `</tbody></table>
    <h3>Tổng thanh toán: <span style="color: red">${formatPrice(total)}</span></h3>
    <h3>Quét mã QR để thanh toán:</h3>
    <img src="images/qr.jpg" alt="QR MB Bank - Nguyễn Đình Tuấn Huy" width="200" />
    <p>Chủ tài khoản: <strong>Nguyễn Đình Tuấn Huy</strong></p>
    <p>Ngân hàng: <strong>MB Bank</strong></p>`;

  cartContainer.innerHTML = html;
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}
