import { Router } from "express";
import { ProductManager } from "../dao/filesystem/productManager.js";

const productManagerServices = new ProductManager("./src/files/products.json");

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
    
  } catch (error) {
    
  }
})



export { router as productsRouter };
    
    
