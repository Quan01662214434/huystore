// main.js
const featuredProducts = [
  {
    name: "Vợt JOOLA Ben Johns",
    image: "images/vot1.jpg",
    oldPrice: "2.500.000₫",
    price: "1.990.000₫"
  },
  {
    name: "Vợt ZOCKER PowerShot",
    image: "images/vot2.jpg",
    oldPrice: "1.900.000₫",
    price: "1.590.000₫"
  },
  {
    name: "Tất thể thao PicklePro",
    image: "images/tat1.jpg",
    oldPrice: "120.000₫",
    price: "99.000₫"
  },
  {
    name: "Quần thi đấu nam",
    image: "images/quan1.jpg",
    oldPrice: "350.000₫",
    price: "270.000₫"
  },
  {
    name: "Nón lưỡi trai JOOLA",
    image: "images/non1.jpg",
    oldPrice: "250.000₫",
    price: "199.000₫"
  }
];

const bestsellers = [
  {
    name: "Vợt Franklin X-40",
    image: "images/vot3.jpg",
    oldPrice: "1.700.000₫",
    price: "1.390.000₫"
  },
  {
    name: "Áo tank top nữ",
    image: "images/ao1.jpg",
    oldPrice: "290.000₫",
    price: "210.000₫"
  },
  {
    name: "Tất cổ ngắn JOOLA",
    image: "images/tat2.jpg",
    oldPrice: "100.000₫",
    price: "80.000₫"
  },
  {
    name: "Vợt SELKIRK Amped",
    image: "images/vot4.jpg",
    oldPrice: "3.000.000₫",
    price: "2.590.000₫"
  },
  {
    name: "Quấn cán chống trượt",
    image: "images/quan1.jpg",
    oldPrice: "150.000₫",
    price: "99.000₫"
  }
];

function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="old-price">${p.oldPrice}</p>
      <p class="price">${p.price}</p>
    </div>
  `).join('');
}

renderProducts(featuredProducts, "featured-products");
renderProducts(bestsellers, "bestseller-products");
// JavaScript điều khiển sản phẩm và chi tiết sản phẩm
