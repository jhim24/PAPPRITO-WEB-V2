/* ==========================================================
   PAPPRITO WEB V2
   NAVBAR MODULE
   File : assets/js/components/navbar.js
   Version : 0.0.1
   Description : Mobile Navigation Functions
========================================================== */


/* ==========================================================
   SELECT ELEMENTS
========================================================== */

const menuToggle = document.querySelector(".menu-toggle");

const navMenu = document.querySelector(".nav-menu");

const navLinks = document.querySelectorAll(".nav-menu a");


/* ==========================================================
   OPEN / CLOSE MENU
========================================================== */

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

});


/* ==========================================================
   AUTO CLOSE MENU
========================================================== */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

    });

});
