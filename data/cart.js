export const cart = [];

export function addtoCart(productId) {
  const selectorElement = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  const selectorQuantity = Number(selectorElement.value);
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += selectorQuantity;
  } else {
    cart.push({
      // productId:  productId;
      productId,
      quantity: selectorQuantity,
    });
  }
}
