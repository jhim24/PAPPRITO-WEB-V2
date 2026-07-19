/* ==========================================================
   PAPPRITO WEB V2
   Version : 2.1.2
   File : assets/js/menu.js
   Description : Menu Page Loader
========================================================== */

/* ==========================================================
   LOAD HTML COMPONENT
========================================================== */

async function loadComponent(selector, file) {

    const element = document.querySelector(selector);

    if (!element) return;

    try {

        const response = await fetch(file);

        if (!response.ok) {

            throw new Error(`Unable to load ${file}`);

        }

        element.innerHTML = await response.text();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   INITIALIZE MENU PAGE
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent(
        "#navbar-component",
        "components/navbar.html"
    );

    await loadComponent(
        "#menu-component",
        "components/menu.html"
    );

    await loadComponent(
        "#footer-component",
        "components/footer.html"
    );

    if (typeof initializeNavbar === "function") {

        initializeNavbar();

    }

    if (typeof initializeMenu === "function") {

        initializeMenu();

    }

});
