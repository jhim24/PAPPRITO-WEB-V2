/* ==========================================================
   PAPPRITO WEB V2
   Version : 2.2.0
   File : assets/js/menu-module.js
   Description : Menu Products Module
========================================================== */

/* ==========================================================
   GLOBAL PRODUCTS
========================================================== */

let allProducts = [];

/* ==========================================================
   INITIALIZE MENU
========================================================== */

async function initializeMenu() {

    console.log("Initializing Menu Module...");

    await loadProducts();

    renderProducts();

}
/* ==========================================================
   LOAD PRODUCTS
========================================================== */

async function loadProducts() {

    if (typeof db === "undefined") {

        console.error("Firebase database is not initialized.");

        return;

    }

    try {

        const snapshot = await db.ref("products").once("value");

        allProducts = [];

        snapshot.forEach(child => {

            allProducts.push({

                id: child.key,

                ...child.val()

            });

        });

        console.log(`Loaded ${allProducts.length} products.`);

    }

    catch (error) {

        console.error("Error loading products:", error);

    }

}
/* ==========================================================
   RENDER PRODUCTS
========================================================== */

function renderProducts(products = allProducts) {

    const menuGrid = document.getElementById("menu-grid");

    if (!menuGrid) return;

    menuGrid.innerHTML = "";

    if (products.length === 0) {

        menuGrid.innerHTML = `

            <div class="empty-menu">

                <h3>No Products Found</h3>

                <p>No menu items are available.</p>

            </div>

        `;

        return;

    }

    products.forEach(product => {

        menuGrid.innerHTML += `

            <div class="menu-card">

                <div class="menu-image">

                    <img src="${product.image || 'assets/images/no-image.png'}"
                         alt="${product.name || 'Product'}">

                </div>

                <div class="menu-content">

                    <h3>${product.name || 'Unnamed Product'}</h3>

                    <p>${product.description || ''}</p>

                    <div class="menu-footer">

                        <span class="menu-price">

                            ₱${Number(product.price || 0).toFixed(2)}

                        </span>

                    </div>

                </div>

            </div>

        `;

    });

}
