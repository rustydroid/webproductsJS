const socketClient = io();

//elementos
const productList = document.getElementById("productList");
const createProductForm = document.getElementById("createProductForm");

// enviar data del form al socket del server
createProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(createProductForm);
  const jsonData = {};
  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }
    jsonData.price = parseFloat(jsonData.price);
    jsonData.stock = parseInt(jsonData.stock);
  console.log(jsonData);
  //enviar jsonData al socket del server
  socketClient.emit("addProduct", jsonData);
  createProductForm.reset();
});

const deleteProduct = (productId) => {
    console.log(productId);
    socketClient.emit("deleteProduct", productId);
};

//
socketClient.on("msgProducts", (dataProducts) => {
  console.log(dataProducts);

  let productElements = "";
  dataProducts.forEach((product) => {
    productElements += `
        <tr>
        <td><button class="btn btn-danger" onclick="deleteProduct(${product.id})">X</button></td>
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.code}</td>
        <td>${product.price}</td>
        <td>${product.status}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.thumbnail}</td>
      </tr>
        `;
  });
  // console.log(productElements);
  productList.innerHTML = productElements;
});


