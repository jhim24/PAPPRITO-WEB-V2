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

    console.log("Menu Module Initialized");

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
