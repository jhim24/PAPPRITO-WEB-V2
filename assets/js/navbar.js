/* ==========================================================
   PAPPRITO WEB V2
   NAVBAR MODULE
   File : assets/js/navbar.js
   Version : 1.1.6
   Description : Navbar Initialization
========================================================== */

/* ==========================================================
   INITIALIZE NAVBAR
========================================================== */

function initializeNavbar() {

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    if (!menuToggle || !navMenu) {
        return;
    }

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

        });

    });

}
/* ==========================================================
   AUTO INITIALIZE
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavbar();

});
