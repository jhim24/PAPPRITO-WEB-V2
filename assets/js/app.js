/* ==========================================================
   PAPPRITO WEB V2
   Version : 1.0.2
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
                color:#fff;
                background:#D71920;
                text-align:center;
                font-weight:bold;">
                Failed to load:
                <br>
                ${file}
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

    `;

    await loadComponent(
        "#navbar-component",
        "components/navbar.html"
    );

});
