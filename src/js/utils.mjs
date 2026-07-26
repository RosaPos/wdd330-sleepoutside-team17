// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  let html = template;

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      html = html.replaceAll(`{{${key}}}`, value);
    });
  }

  parentElement.innerHTML = html;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  return await response.text();
}

export async function loadHeaderFooter() {
  const baseURL = import.meta.env.BASE_URL;
  const header = await loadTemplate(`${baseURL}partials/header.html`);
  const footer = await loadTemplate(`${baseURL}partials/footer.html`);

  renderWithTemplate(header, qs("#main-header"), { baseURL });
  renderWithTemplate(footer, qs("#main-footer"));
}

export function alertMessage(message, scroll = true) {
  const oldAlert = document.querySelector(".alert");
  if (oldAlert) oldAlert.remove();

  const alert = document.createElement("div");
  const alertText = document.createElement("span");
  const closeButton = document.createElement("button");

  alert.classList.add("alert");
  alert.setAttribute("role", "alert");
  alertText.textContent = message;
  closeButton.type = "button";
  closeButton.classList.add("alert-close");
  closeButton.setAttribute("aria-label", "Close message");
  closeButton.textContent = "X";

  closeButton.addEventListener("click", () => alert.remove());
  alert.append(alertText, closeButton);
  document.querySelector("main").prepend(alert);

  if (scroll) window.scrollTo(0, 0);
}
