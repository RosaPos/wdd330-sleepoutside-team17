import { resolve } from "path";
import { defineConfig } from "vite";

const isRender = process.env.RENDER === "true";

export default defineConfig({
  base: isRender ? "/" : "/wdd330-sleepoutside-team17/",
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
      },
    },
  },
});
