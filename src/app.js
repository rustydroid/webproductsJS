import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import path from "path";
import { productsRouter } from "./routes/products.route.js";
import { cartsRouter } from "./routes/carts.route.js";
import { viewsRouter } from "./routes/views.route.js";
import { productsService } from "./dao/index.js";


const SERVER_PORT = 8081;
const app = express();

//Carpeta public
app.use(express.static(path.join(__dirname, "/public")));


//Preparar la configuracion del servidor para recibir objetos JSON.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servidor express con http
const httpServer = app.listen(SERVER_PORT, () => {
  console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

// Servidor websocket para backend
const socketServer = new Server(httpServer);

//handlebars
//Uso de vista de plantillas usando .hbs 
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

// Routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//socket server
socketServer.on("connection", async(socket) => {
  console.log("cliente conectado", socket.id);
  const products = await productsService.getProducts();
  socket.emit("msgProducts", products);

  // recibir los datos para crear el producto desde el client socket
  socket.on("addProduct", async (data) => {
    console.log("Producto creado", await productsService.addProduct(data));
    const products = await productsService.getProducts();
    socketServer.emit("msgProducts", products);
  });

  socket.on("deleteProduct", async(data) => {
    console.log("Producto Borrado", await productsService.deleteProduct(parseInt(data)));
    // console.log("Product ID a borrar: ", data);
    const products = await productsService.getProducts();
    socketServer.emit("msgProducts", products);
  })
});

