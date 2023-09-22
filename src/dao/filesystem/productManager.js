import fs from "fs";

class Product {
  constructor(
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  ) {
    (this.id = id),
      (this.title = title),
      (this.description = description),
      (this.code = code),
      (this.price = price),
      (this.status = status),
      (this.stock = stock),
      (this.category = category),
      (this.thumbnail = thumbnail);
  }
}

class ProductManager {
  #idControl;
  constructor(path) {
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

  // Check if Product code already exist in array
  existProduct = async (code) => {
    try {
      await this.readProducts();
      const checkExist = this.products.some((product) => product.code === code);
      return checkExist;
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

  // Add a product checking if the code exist or not
  addProduct = async (newProductData) => {
    try {
      let exist = await this.existProduct(newProductData.code);
      if (!exist) {
        newProductData.id = Date.now();
        let newProduct = new Product(
          newProductData.id,
          newProductData.title,
          newProductData.description,
          newProductData.code,
          newProductData.price,
          newProductData.status,
          newProductData.stock,
          newProductData.category,
          newProductData.thumbnail
        );
        console.log("Producto a insertar: ", newProduct);
        this.products.push(newProduct);
        await this.saveProducts();
        return "Producto creado!";
      } else {
        console.log("Producto Duplicado");
        return "Producto duplicado";
      }
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  // Update product by Id
  updateProduct = async (updatedProduct) => {
    try {
      await this.readProducts();
      const exist = this.products.some(
        (product) => product.id === updatedProduct.id
      );
      if (exist) {
        console.log("Producto a actualizar: ", updatedProduct);
        let productUpdated = new Product(
          updatedProduct.id,
          updatedProduct.title,
          updatedProduct.description,
          updatedProduct.code,
          updatedProduct.price,
          updatedProduct.status,
          updatedProduct.stock,
          updatedProduct.category,
          updatedProduct.thumbnail
        );
        // console.log("Producto a actualizar: ", productUpdated);
        const parseUpdate = this.products.map((product) => {
          if (product.id === productUpdated.id) return { ...productUpdated };
          else return product;
        });
        this.products = parseUpdate;
        await this.saveProducts();
        console.log("Objetos actualizados");
        return "Producto actualizado";
      } else {
        return "ID de producto no existe";
      }
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };

  // Return all products in array
  getProducts = async (limit) => {
    await this.readProducts();
    if (limit > 0 && limit <= this.products.length) {
      const limitedArray = this.products.slice(0, limit);
      return limitedArray;
    } else {
      return this.products;
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
      return true
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
        return "Product not found!";
      }
    } catch (error) {
      console.log("Error: ", error.message);
      throw Error("Error: ", error.message);
    }
  };
}

export { ProductManager };
