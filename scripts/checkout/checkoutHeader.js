import { calculateCartQuantity } from "../../data/cart.js";

export function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  document.querySelector(".js-checkout-header").innerHTML = ` Checkout (<a
            class="return-to-home-link"
            href="index.html"
          >${cartQuantity} Items</a
          >)`;
}
