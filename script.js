document.addEventListener("DOMContentLoaded", () => {
    const cart = [];

    const products = [
        { id: 1, name: "The Boys T-Shirt", price: 299.00, image: "Images/T-Shirt.jpg" },
        { id: 2, name: "Shirt", price: 399.00, image: "Images/Shirt.jpg" },
        { id: 3, name: "Pant", price: 199.00, image: "Images/Pant.jpg" },
        { id: 4, name: "Jeans", price: 599.00, image: "Images/Jeans.jpg" },
        { id: 5, name: "Crop Top", price: 499.00, image: "Images/Top.jpg" },
        { id: 6, name: "Frock", price: 1499.00, image: "Images/Frock.jpg" },
        { id: 7, name: "Skirt", price: 299.00, image: "Images/Skirt.jpg" },
        { id: 8, name: "Night Suit", price: 449.00, image: "Images/Night Suit.jpg" },
        { id: 9, name: "Baby Scooter", price: 1399.00, image: "Images/Baby Scooter.jpg" },
        { id: 10, name: "Remote Control Car (Rechargeable)", price: 599.00, image: "Images/Car.jpg" },
        { id: 11, name: "Transformer Robot Car", price: 1299.00, image: "Images/Transformer.jpg" },
        { id: 12, name: "Toy Train", price: 299.00, image: "Images/Train.jpg" },

        // Add more products as needed
    ];

    const INRFormatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    });

    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");
    const sortOptions = document.getElementById("sort-options");
    const productGrid = document.querySelector(".product-grid");
    const buyAllButton = document.querySelector(".buy-all-button");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    sortOptions.addEventListener("change", (event) => {
        const sortValue = event.target.value;
        sortProducts(sortValue);
    });

    buyAllButton.addEventListener("click", () => {
        if (cart.length > 0) {
            goToPaymentAll(cart);
        } else {
            alert("Your cart is empty!");
        }
    });

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        searchProducts(query);
    });

    function addToCart(product) {
        const cartItem = cart.find(item => item.product.id === product.id);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ product, quantity: 1 });
        }
        updateCartDisplay();
    }

    function removeFromCart(productId) {
        const cartIndex = cart.findIndex(item => item.product.id === productId);
        if (cartIndex !== -1) {
            cart.splice(cartIndex, 1);
        }
        updateCartDisplay();
    }

    function goToPayment(product) {
        window.open(`payment.html?productId=${product.id}&productName=${product.name}&productPrice=${product.price}`, '_blank');
    }

    function goToPaymentAll(cartItems) {
        const serializedCart = encodeURIComponent(JSON.stringify(cartItems));
        window.open(`payment.html?cart=${serializedCart}`, '_blank');
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach(cartItem => {
            total += cartItem.product.price * cartItem.quantity;
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");
            cartItemElement.innerHTML = `
                <span>${cartItem.product.name} (${cartItem.quantity})</span>
                <span>${INRFormatter.format(cartItem.product.price * cartItem.quantity)}</span>
                <button class="remove-from-cart" data-id="${cartItem.product.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotal.textContent = `Total: ${INRFormatter.format(total)}`;

        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                const productId = parseInt(event.target.getAttribute("data-id"));
                removeFromCart(productId);
            });
        });
    }

    function sortProducts(criteria) {
        let sortedProducts;
        switch (criteria) {
            case "name-asc":
                sortedProducts = products.slice().sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sortedProducts = products.slice().sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "price-asc":
                sortedProducts = products.slice().sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sortedProducts = products.slice().sort((a, b) => b.price - a.price);
                break;
            default:
                sortedProducts = products.slice();
                break;
        }
        displayProducts(sortedProducts);
    }

    function searchProducts(query) {
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
        displayProducts(filteredProducts);
    }

    function displayProducts(products) {
        productGrid.innerHTML = "";
        products.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product-card");
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${INRFormatter.format(product.price)}</p>
                <div class="buttons">
                    <button class="add-to-cart">Add to Cart</button>
                    <button class="buy-now">Buy Now</button>
                </div>
            `;

            productElement.querySelector("img").addEventListener("click", () => {
                openImage(product.image);
            });

            productElement.querySelector(".add-to-cart").addEventListener("click", () => {
                addToCart(product);
            });

            productElement.querySelector(".buy-now").addEventListener("click", () => {
                goToPayment(product);
            });

            productGrid.appendChild(productElement);
        });
    }

    function openImage(imageSrc) {
        const imageWindow = window.open("", "_blank");
        imageWindow.document.write(`<img src="${imageSrc}" style="width:50%">`);
    }

    // Display all products initially
    displayProducts(products);
});
