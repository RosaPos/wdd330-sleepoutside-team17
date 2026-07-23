import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${item.Images.PrimarySmall}"
          alt="${item.Name}"
        />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(key, listElement, footerElement, totalElement) {
    this.key = key;
    this.listElement = listElement;
    this.footerElement = footerElement;
    this.totalElement = totalElement;
  }

  init() {
    const cartItems = getLocalStorage(this.key) || [];
    this.renderCart(cartItems);
  }

  renderCart(cartItems) {
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      cartItems,
      "afterbegin",
      true,
    );

    if (cartItems.length === 0) {
      this.footerElement.classList.add("hide");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.FinalPrice),
      0,
    );

    this.totalElement.textContent = `Total: $${total.toFixed(2)}`;
    this.footerElement.classList.remove("hide");
  }
}
