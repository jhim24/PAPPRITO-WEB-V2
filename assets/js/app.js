/* ==========================================================
   PAPPRITO WEB V2
   Version : 4.0.4
   File : assets/js/app.js
   Description : Homepage Component Loader
========================================================== */

async function loadComponent(selector, file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Unable to load ${file}`);
        }

        const html = await response.text();

        const element = document.querySelector(selector);

        if (element) {
            element.innerHTML = html;
        }

    } catch (error) {

        console.error(error);

    }

}

async function initializeHome() {

    const app = document.getElementById("app");

    if (!app) return;

   app.innerHTML = `
<div id="hero-component"></div>
<div id="dining-spaces-component"></div>
<div id="menu-component"></div>
<div id="about-component"></div>
<div id="featured-menu-component"></div>
<div id="gallery-component"></div>
<div id="branches-component"></div>
<div id="footer-component"></div>
`;
   
    await Promise.all([

        loadComponent("#hero-component", "components/hero.html"),

        loadComponent("#dining-spaces-component", "components/dining-spaces.html"),

        loadComponent("#menu-component", "components/menu.html"),

        loadComponent("#about-component", "components/about.html"),

        loadComponent("#featured-menu-component", "components/featured-menu.html"),

        loadComponent("#gallery-component", "components/gallery.html"),

        loadComponent("#branches-component", "components/branches.html"),

        loadComponent("#footer-component", "components/footer.html")

    ]);

}

document.addEventListener("DOMContentLoaded", initializeHome);
