import express from "express";
import { productsRouter } from "./routes/products.route.js";

const port = 8081;

const app = express();

// Public folder
app.use(express.static("public"));

//Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log("Servidor funcionando OK!"));

// Routes

app.use("/api/products", productsRouter);
