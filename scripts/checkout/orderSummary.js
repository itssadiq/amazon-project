import { cart } from "../../data/cart-class.js";

import { products, getProduct } from "../../data/products.js";

import { formatCurrency } from "../utilities/money.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";

import { renderPaymentSummary } from "./paymentSummary.js";

import { updateCartQuantity } from "./checkoutHeader.js";

export function renderOrderSummary() {
  updateCartQuantity();

  let cartSummaryHTML = "";

  cart.getItems().forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

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
                  <div class="product-price">${matchingProduct.getPrice()}
                  </div>
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
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += ` <div class="delivery-option js-delivery-option" data-product-id="${
        matchingProduct.id
      }" data-delivery-option-id="${deliveryOption.id}">
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
      cart.removeFromCart(productId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });

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
        cart.updateQuantity(productId, inputValue);

        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = inputValue;
        renderOrderSummary();
        renderPaymentSummary();
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

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
