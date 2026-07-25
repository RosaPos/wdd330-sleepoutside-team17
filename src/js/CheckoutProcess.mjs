import ExternalServices from "./ExternalServices.mjs";
import { alertMessage, getLocalStorage } from "./utils.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice),
    quantity: 1,
  }));
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function getErrorMessage(error) {
  if (typeof error.message === "string") {
    return error.message;
  }

  if (error.message && error.message.message) {
    const message = error.message.message;
    return Array.isArray(message) ? message.join(" ") : message;
  }

  return "We could not place your order. Please check your information.";
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubtotal();

    if (this.list.length === 0) {
      document.querySelector("#checkoutSubmit").disabled = true;
      alertMessage(
        "Your cart is empty. Add a product before checking out.",
        false,
      );
    }
  }

  calculateItemSubtotal() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + Number(item.FinalPrice),
      0,
    );

    document.querySelector(`${this.outputSelector} #num-items`).textContent =
      this.list.length;
    document.querySelector(`${this.outputSelector} #subtotal`).textContent =
      `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #tax`).textContent =
      `$${this.tax.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #shipping`).textContent =
      `$${this.shipping.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #order-total`).textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    this.calculateOrderTotal();
    const order = formDataToJSON(form);

    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);
    order.items = packageItems(this.list);

    try {
      await this.services.checkout(order);
      localStorage.removeItem(this.key);
      window.location.href = `${import.meta.env.BASE_URL}checkout/success.html`;
    } catch (error) {
      alertMessage(getErrorMessage(error));
    }
  }
}
