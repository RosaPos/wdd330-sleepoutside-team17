import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

const form = document.querySelector("#checkout-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (form.checkValidity()) {
    checkout.checkout(form);
  } else {
    form.reportValidity();
  }
});

document.querySelector("#zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});
