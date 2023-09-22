import { Router } from "express";
import { productsService } from "../dao/index.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await productsService.getProducts();
  res.render("home", {products: products});
});

router.get("/realtimeproducts", (req, res) => {

  res.render("realtime");
});

export { router as viewsRouter };
