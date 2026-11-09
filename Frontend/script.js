const API_URL = "http://localhost:3000/products";

let products = [];

const productForm = document.getElementById("product-form");
const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productQuantityInput = document.getElementById("product-quantity");
const formMessage = document.getElementById("form-message");
const productSearchInput = document.getElementById("search-input");
const tableBody = document.getElementById("product-table-body");

function updateInventoryStats() {
    const totalProducts = products.length;
    const totalStock = products.reduce((acc, p) => acc + p.quantity, 0);
    const totalInventoryValue = products.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
    );

    document.getElementById("total-products").textContent = totalProducts;
    document.getElementById("total-stock").textContent = totalStock;
    document.getElementById("inventory-value").textContent =
        totalInventoryValue.toLocaleString("fr-CM") + " FCFA";
}

// ---------- Rendering (uses textContent, so names can't inject HTML) ----------
function renderProducts(list = products) {
    tableBody.innerHTML = "";

   list.forEach((product, index) => {
        const row = document.createElement("tr");

      const values = [
    index + 1,   // row number shown to the user
    product.name,
    product.price.toLocaleString("fr-CM") + " FCFA",
    product.quantity,
    (product.price * product.quantity).toLocaleString("fr-CM") + " FCFA"
];

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        const actionsTd = document.createElement("td");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.id = product.id;
        deleteBtn.style.cssText =
            "background-color:#dc3545;color:white;border:none;padding:5px 10px;cursor:pointer;margin-right:5px;";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.dataset.id = product.id;
        editBtn.style.cssText =
            "background-color:#007bff;color:white;border:none;padding:5px 10px;cursor:pointer;";

        actionsTd.appendChild(deleteBtn);
        actionsTd.appendChild(editBtn);
        row.appendChild(actionsTd);

        tableBody.appendChild(row);
    });
}

// ---------- Load from server ----------
async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to load products.");

        const data = await response.json();

        // MySQL can return DECIMAL as a string, so convert to numbers
        products = data.map(p => ({
            ...p,
            price: Number(p.price),
            quantity: Number(p.quantity)
        }));

        renderProducts();
        updateInventoryStats();
    } catch (error) {
        console.error("Error loading products:", error.message);
        formMessage.textContent = "Unable to load products. Check the backend server.";
        formMessage.style.color = "red";
    }
}

// ---------- Delete ----------
async function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE"
        });
        if (!response.ok) throw new Error("Delete failed.");

        products = products.filter(p => p.id !== productId);
        renderProducts();
        updateInventoryStats();
    } catch (error) {
        alert("Unable to delete the product.");
        console.error("Error:", error.message);
    }
}

// ---------- Edit ----------
async function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert("Product not found.");
        return;
    }

    const newName = prompt("Enter new product name:", product.name);
    if (newName === null) return;
    const newPrice = prompt("Enter new product price:", product.price);
    if (newPrice === null) return;
    const newQuantity = prompt("Enter new product quantity:", product.quantity);
    if (newQuantity === null) return;

    const name = newName.trim();
    const price = Number(newPrice);
    const quantity = Number(newQuantity);

    if (
        name === "" ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {
        alert("Invalid values. Edit cancelled.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, quantity })
        });
        if (!response.ok) throw new Error("Update failed.");

        product.name = name;
        product.price = price;
        product.quantity = quantity;

        renderProducts();
        updateInventoryStats();
    } catch (error) {
        alert("Unable to update the product.");
        console.error("Error:", error.message);
    }
}

// ---------- Table clicks (one listener for both buttons) ----------
tableBody.addEventListener("click", event => {
    const id = Number(event.target.dataset.id);

    if (event.target.classList.contains("delete-btn")) {
        deleteProduct(id);
    } else if (event.target.classList.contains("edit-btn")) {
        editProduct(id);
    }
});

// ---------- Search ----------
productSearchInput.addEventListener("input", () => {
    const searchTerm = productSearchInput.value.trim().toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filtered);
});

// ---------- Add product ----------
productForm.addEventListener("submit", async event => {
    event.preventDefault();

    const name = productNameInput.value.trim();
    const price = Number(productPriceInput.value);
    const quantity = Number(productQuantityInput.value);

    if (
        name === "" ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {
        formMessage.textContent = "Please enter valid product information.";
        formMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, quantity })
        });

        if (!response.ok) throw new Error("Failed to add product.");

        const newProduct = await response.json();

        products.push({
            ...newProduct,
            price: Number(newProduct.price),
            quantity: Number(newProduct.quantity)
        });

        renderProducts();
        updateInventoryStats();

        formMessage.textContent = `${name} was added successfully!`;
        formMessage.style.color = "green";
        productForm.reset();
    } catch (error) {
        formMessage.textContent = "Unable to add product. Check the backend server.";
        formMessage.style.color = "red";
        console.error("Error:", error.message);
    }
});

// ---------- Start ----------
loadProducts();