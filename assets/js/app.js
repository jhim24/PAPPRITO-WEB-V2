/* ==========================================================
   PAPPRITO WEB V2
   Version : 1.1.3
   File : assets/js/app.js
   Description : Component Loader
========================================================== */

/* ==========================================================
   LOAD HTML COMPONENT
========================================================== */

async function loadComponent(selector, file) {

    const element = document.querySelector(selector);

    if (!element) {
        console.error(`Container not found: ${selector}`);
        return;
    }

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Unable to load ${file}`);
        }

        element.innerHTML = await response.text();

    } catch (error) {

        console.error(error);

        element.innerHTML = `
            <div style="
                padding:20px;
                background:#D71920;
                color:#fff;
                text-align:center;">
                Failed to load ${file}
            </div>
        `;

    }

}

/* ==========================================================
   INITIALIZE WEBSITE
========================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const app = document.getElementById("app");

    app.innerHTML = `

        <div id="navbar-component"></div>

        <div id="hero-component"></div>

        <div id="about-component"></div>

        <div id="featured-menu-component"></div>

    `;

    await loadComponent(
        "#navbar-component",
        "components/navbar.html"
    );

    await loadComponent(
        "#hero-component",
        "components/hero.html"
    );

    await loadComponent(
        "#about-component",
        "components/about.html"
    );

    await loadComponent(
        "#featured-menu-component",
        "components/featured-menu.html"
    );

});
