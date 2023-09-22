import { ProductManager } from "./filesystem/productManager.js";
import { CartManager } from "./filesystem/cartManager.js";
import { __dirname } from "../utils.js";
import path from "path";

export const productsService = new ProductManager(
  path.join(__dirname, "/files/products.json")
);
export const cartsService = new CartManager(path.join(__dirname, "/files/carts.json"));
