import { Router } from "express";
import { ProductManager } from "../dao/filesystem/productManager.js";
import { __dirname } from "../utils.js";
import path from "path";

const productManagerServices = new ProductManager(path.join(__dirname, "/files/products.json"));

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    console.log(limit);
    if (limit !== NaN) {
      const products = await productManagerServices.getProducts(limit);
      res.send(products);
    } else {
      const products = await productManagerServices.getProducts(0);
      res.send(products);
    }
  } catch (error) {
    res.send("Error: ", error.message);
  }
});

router.get("/:pId", async (req, res) => {
  try {
    const pid = parseInt(req.params.pId);
    const productById = await productManagerServices.getProductById(pid);
    res.send(productById);
  } catch (error) {
    res.send("Error: ", error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const statusProduct = await productManagerServices.addProduct(newProduct);
    res.send({ message: statusProduct });
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.put("/:pId", async (req, res) => {
  try {
    const pId = parseInt(req.params.pId);
    const updatedProduct = req.body;
    updatedProduct.id = pId;
    const statusProduct = await productManagerServices.updateProduct(
      updatedProduct
    );
    res.send({ message: statusProduct });
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.delete("/:pId", async (req, res) => {
  try {
    const pId = parseInt(req.params.pId);
    const statusProduct = await productManagerServices.deleteProduct(pId);
    res.send({ message: statusProduct });
  } catch (error) {
    res.json({ message: error.message });
  }
});

export { router as productsRouter };
