import fs from "fs";

class Product {
  constructor(id, title, desc, price, thumb, code, stock) {
    (this.id = id),
      (this.title = title),
      (this.description = desc),
      (this.price = price),
      (this.thumbnail = thumb),
      (this.code = code),
      (this.stock = stock);
  }
}

class ProductManager {
  #idControl;
  constructor(path) {
    this.#idControl = 0;
    this.products = [];
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

  // Read products from file
  readProducts = async () => {
    try {
      let fileStatus = await this.checkFileExist();
      if (fileStatus) {
        let productsRead = await fs.promises.readFile(this.path, this.encoding);
        console.log("Products readed from JSON file");
        this.products = JSON.parse(productsRead);
        this.fileReaded = true;
        if (this.products.length > 1) {
          this.#idControl = this.products.length - 1;
        } else {
          this.#idControl = this.products.length;
        }
      } else {
        throw new Error("json file doesn't exist");
      }
    } catch (error) {
      console.error(`Error reading products from file: ${this.path}, ${error}`);
      throw Error("Error: ", error.message);
    }
  };

  // Save products to file
  saveProducts = async () => {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t"),
        (err) => {
          if (err) {
            console.error(
              `Error saving products on file: ${this.path}, ${error}`
            );
          }
        }
      );
      console.log("Products saved on file!!");
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  // Check if Product code already exist in array
  existProduct = async (code) => {
    try {
      await this.readProducts();
      const checkExist = this.products.some((product) => product.code === code);
      console.log(this.products);
      return checkExist;
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  // Add a product checking if the code exist or not
  addProduct = async (title, desc, price, thumb, code, stock) => {
    try {
      let exist = await this.existProduct(code);
      if (!exist) {
        this.#idControl++;
        let newProduct = new Product(
          this.#idControl,
          title,
          desc,
          price,
          thumb,
          code,
          stock
        );
        this.products.push(newProduct);
        await this.saveProducts();
      } else {
        console.log("Producto Duplicado");
      }
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  // Update product by Id
  updateProduct = async (id, title, desc, price, thumb, code, stock) => {
    await this.readProducts();
    let productUpdated = new Product(
      id,
      title,
      desc,
      price,
      thumb,
      code,
      stock
    );
    const parseUpdate = this.products.map((product) => {
      if (product.id === productUpdated.id) return { ...productUpdated };
      else return product;
    });
    this.products = parseUpdate;
    console.log("Objetos actualizados");
    await this.saveProducts();
  };

  // Return all products in array
  getProducts = async (limit) => {
    await this.readProducts();
    if (limit > 0 && limit <= this.products.length) {
      const limitedArray = this.products.slice(0, limit);
      return limitedArray;
    } else {
      return this.products
    }
  };

  // Delete product by id
  deleteProduct = async (id) => {
    try {
      await this.readProducts();
      const productsFiltered = this.products.filter((product) => {
        if (product.id !== id) return product;
      });
      this.products = productsFiltered;
      await this.saveProducts();
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  // Search if Product id exist in array, if not return a message
  getProductById = async (id) => {
    try {
      await this.readProducts();
      let productFound = this.products.find((product) => product.id === id);
      if (productFound) {
        return productFound;
      } else {
        return ("Product not found!");
      }
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };
}

export { ProductManager };
