/* ==========================================================
   ACTIVE NAVIGATION
========================================================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});
/* ==========================================================
   MOBILE MENU
========================================================== */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const menuClose = document.querySelector(".menu-close");
const menuOverlay = document.querySelector(".menu-overlay");
const mobileLinks = document.querySelectorAll(".mobile-nav a");

/* ==========================================================
   OPEN MENU
========================================================== */

menuToggle.addEventListener("click", () => {

    mobileMenu.classList.add("active");
    menuOverlay.classList.add("active");

});

/* ==========================================================
   CLOSE MENU FUNCTION
========================================================== */

function closeMenu(){

    mobileMenu.classList.remove("active");
    menuOverlay.classList.remove("active");

}

/* ==========================================================
   CLOSE BUTTON
========================================================== */

menuClose.addEventListener("click", closeMenu);

/* ==========================================================
   OVERLAY
========================================================== */

menuOverlay.addEventListener("click", closeMenu);

/* ==========================================================
   CLOSE WHEN MENU IS CLICKED
========================================================== */

mobileLinks.forEach(link=>{

    link.addEventListener("click", closeMenu);

});
