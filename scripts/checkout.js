import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart, loadCartFetch } from "../data/cart.js";

async function loadPage() {
  try {
    await Promise.all([
      loadProductsFetch(),
      new Promise((resolve) => {
        loadCartFetch(() => {
          resolve();
        });
      }),
    ]);
  } catch (error) {
    console.log("unexpected error, please try again later");
  }

  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();
