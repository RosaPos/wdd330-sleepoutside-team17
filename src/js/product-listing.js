import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();

  const search = (getParam("search") || "").trim();
  const category = getParam("category") || "tents";
  const searchTerm = search || category;
  const categoryName = searchTerm
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (search) {
    document.querySelector("#product-list-title").textContent =
      `Search Results: ${search}`;
    document.querySelector("#product-search").value = search;
    document.title = `Sleep Outside | Search: ${search}`;
  } else {
    document.querySelector("#product-list-title").textContent =
      `Top Products: ${categoryName}`;
    document.title = `Sleep Outside | ${categoryName}`;
  }

  const dataSource = new ProductData();
  const listElement = document.querySelector(".product-list");
  const productList = new ProductList(searchTerm, dataSource, listElement);

  productList.init();
}

init();
