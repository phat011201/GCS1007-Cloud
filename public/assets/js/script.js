function addNewProduct(product) {
  const tabletag = document.querySelector("table");
  const row = document.createElement("tr");
  row.setAttribute("data-product-id", product._id);

  // Thêm tên sản phẩm
  const nameCell = document.createElement("td");
  nameCell.innerHTML = `
        <div class="d-flex px-2 py-1">
          <div>
            <img
              src="${product.image}"
              class="avatar avatar-sm me-3"
              alt="${product.productName}"
            />
          </div>
          <div class="d-flex flex-column justify-content-center">
            <h6 class="mb-0 text-sm">${product.productName}</h6>
          </div>
        </div>`;
  row.appendChild(nameCell);

  const priceCell = document.createElement("td");
  priceCell.innerHTML = `<p class="text-xs font-weight-bold mb-0">${product.price}$</p>`;
  row.appendChild(priceCell);

  const descriptionCell = document.createElement("td");
  descriptionCell.classList.add("align-middle", "text-center");
  descriptionCell.style.whiteSpace = "pre-line";
  descriptionCell.innerHTML = `
        <span class="text-secondary text-xs font-weight-bold">${product.description}</span>`;
  row.appendChild(descriptionCell);

  const editCell = document.createElement("td");
  editCell.classList.add("align-middle", "text-center");
  editCell.innerHTML = `
        <button
        onclick="openformEditProduct('${product._id}')"
          class="btn text-secondary font-weight-bold text-xs me-4"
          data-toggle="tooltip"
          data-original-title="Edit product"
        >
          Edit
        </button>
        <button
          onclick="deleteProduct('${product._id}')"
          class="btn text-secondary font-weight-bold text-xs"
          data-toggle="tooltip"
          data-original-title="Delete product"
        >
          Delete
        </button>`;
  row.appendChild(editCell);

  tabletag.children[1].appendChild(row);
}

fetch("/api/products")
  .then((response) => response.json())
  .then((products) => {
    products.forEach((product) => {
      addNewProduct(product);
    });
  })
  .catch((error) => {
    console.error("Error when get products:", error);
  });

const addProductButton = document.querySelector(".add-product");
const addProductFormGroup = document.getElementById("add-product-form-group");

addProductButton.addEventListener("click", () => {
  if (
    addProductFormGroup.style.display === "none" ||
    addProductFormGroup.style.display === ""
  ) {
    addProductFormGroup.style.display = "block";
  } else {
    addProductFormGroup.style.display = "none";
  }
});

const addProductBtn = document.querySelector(".add-product-btn");
const inputFile = document.querySelector("#inputFile");

const reader = new FileReader();
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  reader.onload = () => {
    addProductFormGroup.children[1].children[0].children[1].src = reader.result;
  };
  reader.readAsDataURL(file);
});

addProductBtn.addEventListener("click", () => {
  event.preventDefault();

  const productName = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value;

  const image = reader.result;

  // Tạo một đối tượng sản phẩm mới
  const newProduct = {
    productName,
    price,
    image,
    description,
  };

  // post data from a file json
  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      addProductFormGroup.style.display = "none";
      addNewProduct(data);
    })
    .catch((error) => {
      console.error("Error then adding product:", error);
    });
});

function deleteProduct(productId) {
  fetch(`/api/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Product deleted successfully");
        const tableRow = document.querySelector(
          `tr[data-product-id="${productId}"]`
        );
        if (tableRow) {
          tableRow.remove();
        }
      } else {
        console.error("Error deleting product");
      }
    })
    .catch((error) => {
      console.error("Error deleting product:", error);
    });
}

const editProductFormGroup = document.getElementById("edit-product-form-group");
const editProductForm = document.getElementById("edit-product-form");

const updateInputFile = document.querySelector("#update-iput-file");
updateInputFile.addEventListener("change", () => {
  const file = updateInputFile.files[0];
  reader.onload = () => {
    editProductForm.children[1].children[1].src = reader.result;
  };
  reader.readAsDataURL(file);
});

editProductForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(`/api/products/${editProductForm.children[0].textContent}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productName: editProductForm.elements.productName.value,
      price: editProductForm.elements.price.value,
      image: editProductForm.children[1].children[1].src,
      description: editProductForm.elements.description.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Product updated successfully");
      editProductFormGroup.style.display = "none";
      // update table product with new data and with id of product
      const tableRow = document.querySelector(
        `tr[data-product-id="${data._id}"]`
      );
      if (tableRow) {
        tableRow.children[0].children[0].children[1].children[0].textContent =
          data.productName;
        tableRow.children[1].children[0].textContent = `${data.price}$`;
        tableRow.children[0].children[0].children[0].children[0].src =
          data.image;
        tableRow.children[2].children[0].textContent = data.description;
      }
    })
    .catch((error) => {
      console.error("Error updating product:", error);
    });
});

function openformEditProduct(productId) {
  event.preventDefault();
  fetch(`/api/products/${productId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((product) => {
      editProductFormGroup.style.display = "block";
      editProductForm.children[0].textContent = product._id;
      editProductForm.elements.productName.value = product.productName;
      editProductForm.elements.price.value = product.price;
      editProductForm.elements.description.value = product.description;
      editProductForm.children[1].children[1].src = product.image;
    })
    .catch((error) => {
      console.error("Error editing product:", error);
    });
}

function cancelFormProduct() {
  event.preventDefault();
  addProductFormGroup.style.display = "none";
  editProductFormGroup.style.display = "none";
}
