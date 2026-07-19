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

        <section id="hero-component"></section>

        <section id="dining-spaces-component"></section>

        <section id="menu-component"></section>

        <section id="about-component"></section>

        <section id="featured-menu-component"></section>

        <section id="gallery-component"></section>

        <section id="branches-component"></section>

        <section id="footer-component"></section>

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
