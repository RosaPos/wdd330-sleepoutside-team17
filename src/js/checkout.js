import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

const form = document.querySelector("#checkout-form");
const submitButton = document.querySelector("#checkoutSubmit");
const statusMessage = document.querySelector("#checkout-status");
const originalButtonText = submitButton.textContent;

function setSubmittingState(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.classList.toggle("is-loading", isSubmitting);
  form.setAttribute("aria-busy", String(isSubmitting));

  if (isSubmitting) {
    submitButton.textContent = "Processing Order...";
    statusMessage.textContent = "Processing your order. Please wait.";
  } else {
    submitButton.textContent = originalButtonText;
    statusMessage.textContent = "";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  setSubmittingState(true);

  const orderPlaced = await checkout.checkout(form);

  if (!orderPlaced) {
    setSubmittingState(false);
    statusMessage.textContent =
      "The order could not be completed. Review the message above and try again.";
  }
});

document.querySelector("#zip").addEventListener("blur", () => {
  checkout.calculateOrderTotal();
});
