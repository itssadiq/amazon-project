import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { cart } from "../../data/cart-class.js";
import { getProduct, loadProductsFetch } from "../data/products.js";

const url = new URL(window.location.href);
const orderId = url.searchParams.get("orderId");
const productId = url.searchParams.get("productId");

async function renderPage() {
  await loadProductsFetch();

  let cartProduct = {};

  let html;
  let today;
  let orderTime;
  let deliveryTime;
  let percentProgress;

  orders.forEach((order) => {
    if (order.id === orderId) {
      order.products.forEach((product) => {
        if (product.productId === productId) {
          cartProduct = product;
        }
      });
    }

    let quantity;

    cart.cartItems.forEach((productDetails) => {
      today = dayjs();
      orderTime = dayjs(order.orderTime);
      deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
      percentProgress =
        ((today - orderTime) / (deliveryTime - orderTime)) * 100;

      if (productDetails.productId === productId) {
        quantity = productDetails.quantity;
      }
    });

    const product = getProduct(productId);

    const orderDate = dayjs(order.orderTime).format("dddd, MMMM D");

    html = `
     <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
    </a>

      <div class="delivery-date">Arriving on ${orderDate}</div>

      <div class="product-info">
      ${product.name}
      </div>

      <div class="product-info">Quantity: ${quantity}</div>

      <img
        class="product-image"
        src="${product.image}"
      />

      <div class="progress-labels-container">
        <div class="progress-label">Preparing</div>
        <div class="progress-label current-status">Shipped</div>
        <div class="progress-label">Delivered</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar js-progress-bar"></div>
      </div>
`;

    document.querySelector(".js-order-tracking").innerHTML = html;

    const progressBar = document.querySelector(".js-progress-bar");

    const suffix = "%";

    progressBar.style.width = `${percentProgress + suffix}`;
  });
}

renderPage();
