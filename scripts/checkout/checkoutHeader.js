import { cart } from "../../data/cart-class.js";

export function updateCartQuantity() {
  const cartQuantity = cart.calculateCartQuantity();

  document.querySelector(".js-checkout-header").innerHTML = ` Checkout (<a
            class="return-to-home-link"
            href="index.html"
          >${cartQuantity} Items</a
          >)`;
}
