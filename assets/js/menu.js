/* ==========================================================
   PAPPRITO WEB V2
   Version : 1.4.3
   File : assets/js/menu.js
   Description : Menu Module
========================================================== */

/* ==========================================================
   GLOBAL PRODUCTS ARRAY
========================================================== */

let products = [];

/* ==========================================================
   INITIALIZE MENU
========================================================== */

async function initializeMenu() {

    await loadProducts();

    renderProducts(products);

    initializeSearch();

    initializeCategories();

}

/* ==========================================================
   LOAD PRODUCTS FROM FIREBASE
========================================================== */

async function loadProducts() {

    try {

        const snapshot = await db
            .ref("products")
            .once("value");

        products = [];

        snapshot.forEach(item => {

            products.push({

                id: item.key,

                ...item.val()

            });

        });

    } catch (error) {

        console.error("Unable to load products:", error);

        products = [];

    }

}

/* ==========================================================
   RENDER PRODUCTS
========================================================== */

function renderProducts(data) {

    const grid = document.getElementById("menu-grid");

    if (!grid) return;

    grid.innerHTML = "";

    data.forEach(product => {

        grid.innerHTML += `
            <div class="menu-card">

                <img src="${product.image}" alt="${product.name}">

                <div class="menu-content">

                    <h3>${product.name}</h3>

                    <span class="price">
                        ₱${product.price}
                    </span>

                </div>

            </div>
        `;

    });

}

/* ==========================================================
   SEARCH
========================================================== */

function initializeSearch() {

    const search = document.getElementById("menu-search");

    if (!search) return;

    search.addEventListener("input", function () {

        const keyword = this.value.toLowerCase();

        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(keyword)
        );

        renderProducts(filtered);

    });

}

/* ==========================================================
   CATEGORY FILTER
========================================================== */

function initializeCategories() {

    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            const category = button.dataset.category;

            if (category === "all") {

                renderProducts(products);

                return;

            }

            renderProducts(

                products.filter(product => product.category === category)

            );

        });

    });

}
