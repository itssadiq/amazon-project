import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utilities/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../data/deliverOptions.js";

updateCartQuantity();

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  document.querySelector(
    ".js-cart-quantity"
  ).innerHTML = `${cartQuantity} items`;
}
let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
  const dateString = deliveryDate.format("dddd, MMMM D");

  cartSummaryHTML += `<div class="cart-item-container
   js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">Delivery date: ${dateString}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${
                    matchingProduct.id
                  }">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input" data-product-id=${
                    matchingProduct.id
                  }>
                  <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${
                    matchingProduct.id
                  }">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                  ${deliveryOptionsHTML(matchingProduct, cartItem)}
                </div>
              </div>
            </div>
          </div>`;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = "";
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");
    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += ` <div class="delivery-option">
        <input
          type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
        />
        <div>
          <div class="delivery-option-date">${dateString}</div>
          <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
      </div>`;
  });
  return html;
}

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    container.remove();
    updateCartQuantity();
  });
});

// document.querySelectorAll(".js-update-quantity").forEach((link) => {
//   link.addEventListener("click", () => {
//     const productId = link.dataset.productId;
//     const container = document.querySelector(".cart-item-container");
//     container.classList.add("is-editing-quantity");

//     const updateQuantityLink = document.querySelectorAll(".js-update-quantity");
//     updateQuantityLink.forEach((e) => {
//       if (e.dataset.productId === productId) {
//         e.classList.add("hide");
//       }
//     });

//     const quantityLabel = document.querySelectorAll(".js-quantity-label");
//     quantityLabel.forEach((e) => {
//       if (e.dataset.productId === productId) {
//         e.classList.add("hide");
//       }
//     });

//     const saveQuantityLink = document.querySelectorAll(".save-quantity-link");
//     saveQuantityLink.forEach((e) => {
//       if (e.dataset.productId === productId) {
//         e.classList.add("visible");
//       }
//     });

document.querySelectorAll(".js-update-quantity").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.add("is-editing-quantity");
  });
});

function saveQuantity(event) {
  const productId = event.currentTarget.dataset.productId;
  const container = document.querySelector(
    `.js-cart-item-container-${productId}`
  );
  container.classList.remove("is-editing-quantity");

  const quantityInput = document.querySelectorAll(".js-quantity-input");
  quantityInput.forEach((e) => {
    if (e.dataset.productId === productId) {
      const inputValue = Number(e.value);
      updateQuantity(productId, inputValue);

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      quantityLabel.innerHTML = inputValue;
      updateCartQuantity();
    }
  });
}

document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
  link.addEventListener("click", saveQuantity);
});

document.querySelectorAll(".js-quantity-input").forEach((link) => {
  link.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
      saveQuantity(e);
    }
  });
});

// document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
//   link.addEventListener("click", () => {
//     const productId = link.dataset.productId;
//     const container = document.querySelector(
//       `.js-cart-item-container-${productId}`
//     );
//     container.classList.remove("is-editing-quantity");

//     const quantityInput = document.querySelectorAll(".js-quantity-input");
//     quantityInput.forEach((e) => {
//       if (e.dataset.productId === productId) {
//         const inputValue = Number(e.value);
//         updateQuantity(productId, inputValue);

//         const quantityLabel = document.querySelector(
//           `.js-quantity-label-${productId}`
//         );
//         quantityLabel.innerHTML = inputValue;
//         updateCartQuantity();
//       }
//     });
//   });
// });
