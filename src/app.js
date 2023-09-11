import express from "express";
import { ProductManager } from "./modules/productManager.js";

const productManagerServices = new ProductManager("./src/files/products.json");

const port = 8081;

const app = express();

app.listen(port, () => console.log("Servidor funcionando"));
app.use(express.urlencoded({ extended: true }));

// Routes

app.get("/api/products?", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
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

app.get("/api/products/:pId", async (req, res) => {
  try {
    const pid = Number(req.params.pId);
      const productById = await productManagerServices.getProductById(pid);
      res.send(productById);
  } catch (error) {
    res.send("Error: ", error.message);
  }
});
