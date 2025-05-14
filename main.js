let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    if (document.getElementById("featured-products")) renderFeatured("featured-products");
    if (document.getElementById("bestseller-products")) renderFeatured("bestseller-products");
    if (document.getElementById("categorized-products")) renderCategorizedProducts();
    if (document.getElementById("searchInput")) setupSearchFilter();
    if (window.location.pathname.includes("product-detail.html")) renderProductDetail();
    if (window.location.pathname.includes("cart.html")) renderCart();
  });

function renderFeatured(id) {
  const container = document.getElementById(id);
  const list = products.slice(0, 4);
  container.innerHTML = list.map(renderCard).join("");
}

function renderCard(p) {
  return `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" onclick="location.href='product-detail.html?id=${p.id}'">
      <h3>${p.name}</h3>
      <p>Mã: <strong>${p.code}</strong></p>
      <p class="old-price">${format(p.oldPrice)}</p>
      <p class="price">${format(p.price)}</p>
      <button onclick="addToCart(${p.id})">Thêm vào giỏ</button>
    </div>`;
}

function format(v) {
  return v ? v.toLocaleString("vi-VN") + "₫" : "";
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity++;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Đã thêm vào giỏ hàng!");
}

function renderCategorizedProducts() {
  const container = document.getElementById("categorized-products");
  const categories = [...new Set(products.map(p => p.category))];
  container.innerHTML = "";
  categories.forEach(category => {
    const section = document.createElement("section");
    section.innerHTML = `<h3>${category}</h3><div class="product-grid">${products.filter(p => p.category === category).map(renderCard).join("")}</div>`;
    container.appendChild(section);
  });
}

function setupSearchFilter() {
  const input = document.getElementById("searchInput");
  input.addEventListener("input", () => {
    const keyword = input.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.code.toLowerCase().includes(keyword)
    );
    const container = document.getElementById("categorized-products");
    container.innerHTML = "<h3>Kết quả tìm kiếm</h3><div class='product-grid'>" + filtered.map(renderCard).join("") + "</div>";
  });
}

function renderProductDetail() {
  const id = parseInt(new URLSearchParams(window.location.search).get("id"));
  const product = products.find(p => p.id === id);
  if (!product) return;
  document.title = product.name + " - HUYSTORE";
  document.getElementById("product-detail").innerHTML = `
    <div class="product-detail-container" style="display:flex;flex-wrap:wrap;gap:30px;">
      <div style="flex:1;min-width:300px;">
        <img src="${product.image}" alt="${product.name}" style="max-width:100%;border-radius:8px;" />
      </div>
      <div style="flex:2;">
        <h1>${product.name}</h1>
        <p><strong>Mã sản phẩm:</strong> ${product.code}</p>
        <p class="old-price">${format(product.oldPrice)}</p>
        <p class="price">${format(product.price)}</p>
        <p>${product.description}</p>
        <button onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
      </div>
    </div>
  `;
}

function renderCart() {
  const container = document.querySelector("main");
  let total = 0;
  let html = `<table><thead><tr><th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Tổng</th><th></th></tr></thead><tbody>`;
  cart.forEach((item, i) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    html += `<tr>
      <td>${item.name}</td>
      <td>${format(item.price)}</td>
      <td>
        <button onclick="updateQty(${i}, -1)">-</button>
        ${item.quantity}
        <button onclick="updateQty(${i}, 1)">+</button>
      </td>
      <td>${format(lineTotal)}</td>
      <td><button onclick="removeItem(${i})">Xóa</button></td>
    </tr>`;
  });
  html += `</tbody></table>
    <h3>Tổng cộng: <span style="color:red">${format(total)}</span></h3>`;

  // Tạo mã QR VietQR động từ tổng tiền
  const qrURL = `https://img.vietqr.io/image/MB-18122022230205-print.png?amount=${total}&addInfo=HUYSTORE&accountName=Nguyễn%20Đình%20Tuấn%20Huy`;

  html += `
    <h3>Chuyển khoản:</h3>
    <img src="${qrURL}" alt="QR VietQR MB Bank" width="200" />
    <p>Chủ TK: <strong>Nguyễn Đình Tuấn Huy</strong> - MB Bank</p>
    <p>Số tài khoản: <strong>18122022230205</strong></p>
    <br>
    <button class="checkout" onclick="alert('Cảm ơn bạn đã đặt hàng! Vui lòng chuyển khoản để hoàn tất.')">Thanh toán ngay</button>`;

  container.innerHTML = html;
}

function updateQty(index, change) {
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
