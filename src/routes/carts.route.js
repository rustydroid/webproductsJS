import { Router } from "express";
import { CartManager } from "../dao/filesystem/cartManager.js";

const cartManagerServices = new CartManager("./src/files/carts.json");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    console.log(limit);
    if (limit !== NaN) {
      const carts = await cartManagerServices.getCarts(limit);
      res.send(carts);
    } else {
      const carts = await cartManagerServices.getCarts(0);
      res.send(carts);
    }
  } catch (error) {
    res.send("Error: ", error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("post cart endpoint");
    const cartStatus = await cartManagerServices.addCart();
    res.send({ message: cartStatus });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/:cId", async (req, res) => {
    try {
        const cId = parseInt(req.params.cId);
        const cartProducts = await cartManagerServices.getCartById(cId);
        res.send(cartProducts);
    } catch (error) {
        res.json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cId = parseInt(req.params.cid);
    const pId = parseInt(req.params.pid);
    const qty = parseInt(req.body.qty);
    console.log("datos: ", cId, pId, qty);
    const cartUpdated = await cartManagerServices.updateCart(cId, pId, qty);
    res.send({message: "post cid pid endpoint"})
  } catch (error) {
    res.json({ error: error.message });
  }
});



export { router as cartsRouter };
    
    
