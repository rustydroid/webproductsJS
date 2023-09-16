import fs from "fs";

class Cart {
  constructor(id, products) {
    (this.id = id), (this.products = products);
  }
}

class CartManager {
  constructor(path) {
    this.carts = [];
    this.encoding = "utf-8";
    this.path = path;
    this.fileReaded = false;
  }

  // Check if products.json exist
  checkFileExist = async () => {
    try {
      console.log("Checking file");
      let fileStatus = fs.existsSync(this.path);
      console.log("File status: ", fileStatus);
      return fileStatus;
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  // Check if Product code already exist in array
  existCart = async (id) => {
    await this.readCarts();
    console.log("Entrando check exist");
    console.log("Carritos: ", this.carts);
    const checkExist = this.carts.some(function (cart) {
      return cart.id === id;
    });
    console.log("Check exist: ", checkExist);
    return checkExist;
  };

  // Read products from file
  readCarts = async () => {
    try {
      let fileStatus = await this.checkFileExist();
      if (fileStatus) {
        let cartsRead = await fs.promises.readFile(this.path, this.encoding);
        this.carts = JSON.parse(cartsRead);
        this.fileReaded = true;
      } else {
        throw new Error("json file doesn't exist");
      }
    } catch (error) {
      console.error(`Error reading carts from file: ${this.path}, ${error}`);
      throw Error("Error: ", error.message);
    }
  };

  // Save products to filedefault
  saveCarts = async () => {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t"),
        (err) => {
          if (err) {
            console.error(`Error saving carts on file: ${this.path}, ${error}`);
          }
        }
      );
      console.log("Carts saved on file!!");
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  // Add a product checking if the code exist or not
  addCart = async () => {
    try {
      await this.readCarts();
      const newId = Date.now();
      let newCart = new Cart(newId, []);
      this.carts.push(newCart);
      console.log("EstadoCarrito: ", this.carts);
      await this.saveCarts();
      return "Carrito creado";
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  updateCart = async (cid, pid, qty) => {
    try {
      if (!this.fileReaded) {
        await this.readCarts();
      }
      let cartPosition = this.carts.findIndex((cart) => cart.id === cid);
      let cart = this.carts[cartPosition];
      let productPosition = cart.products.findIndex(
        (product) => product.pid === pid
      );
      console.log("Posicion: ", productPosition);
      if (productPosition < 0) {
        console.log("Producto no encontrado");
        console.log("Agregando producto");
        let newProduct = { pid: pid, qty: qty };
        this.carts[cartPosition].products.push(newProduct);
        console.log("Carritos Despues: ", this.carts[cartPosition]);
      } else {
        console.log("Producto encontrado");
        console.log(cart.products[productPosition]);
        let oldQty = parseInt(cart.products[productPosition].qty);
        this.carts[cartPosition].products[productPosition].qty = oldQty + qty;
        console.log("Carritos Despues: ", this.carts[cartPosition]);
      }
      console.log("Carrtios: ", this.carts);
      await this.saveCarts();
    } catch (error) {}
  };

  // Return all products in array
  getCarts = async (limit) => {
    await this.readCarts();
    if (limit > 0 && limit <= this.carts.length) {
      const limitedArray = this.carts.slice(0, limit);
      return limitedArray;
    } else {
      return this.carts;
    }
  };

  getCartById = async (id) => {
    try {
      if (!this.fileReaded) {
        await this.readCarts();
      }
      let cartFound = this.carts.find((cart) => cart.id === id);
      if (cartFound) {
        console.log("Carrito: ", cartFound.products);
        return cartFound.products;
      } else {
        return "Cart not found!!";
      }
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };
}

export { CartManager };
