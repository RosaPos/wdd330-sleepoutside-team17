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

// create and display an alert message at the top of main
export function alertMessage(message, scroll = true) {
  // remove an existing alert so messages do not accumulate
  const oldAlert = document.querySelector(".alert");
  if (oldAlert) oldAlert.remove();

  // create the main alert container and close button
  const alert = document.createElement("div");
  const closeButton = document.createElement("button");

  // always work with an array, even when only one message is received
  const messages = Array.isArray(message) ? message : [message];

  // add styles and accessibility information
  alert.classList.add("alert");
  alert.setAttribute("role", "alert");

  // configure the close button
  closeButton.type = "button";
  closeButton.classList.add("alert-close");
  closeButton.setAttribute("aria-label", "Close message");
  closeButton.textContent = "X";

  // display one message as plain text
  if (messages.length === 1) {
    const alertText = document.createElement("span");
    alertText.textContent = messages[0];
    alert.append(alertText);
  } else {
    // display multiple messages as a list
    const alertList = document.createElement("ul");
    alertList.classList.add("alert-list");

    messages.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      alertList.append(listItem);
    });

    alert.append(alertList);
  }

  // remove the alert when the close button is clicked
  closeButton.addEventListener("click", () => alert.remove());

  // add the close button and insert the alert at the top of main
  alert.append(closeButton);
  document.querySelector("main").prepend(alert);

  // scroll to the top so the user can see the message
  if (scroll) window.scrollTo(0, 0);
}
