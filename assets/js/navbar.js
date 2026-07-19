/* ==========================================================
   PAPPRITO WEB V2
   Version : 3.0.2
   File : assets/js/navbar.js
   Description : Responsive Navbar
========================================================== */

function initializeNavbar() {

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (!menuToggle || !navMenu) return;

    // Remove duplicate listeners if reloaded
    const newToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newToggle, menuToggle);

    newToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        const expanded = navMenu.classList.contains("active");

        newToggle.setAttribute("aria-expanded", expanded);

        const icon = newToggle.querySelector("i");

        if (icon) {
            icon.className = expanded
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }

    });

    // Close menu after clicking a link (mobile)
    navMenu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

            newToggle.setAttribute("aria-expanded", "false");

            const icon = newToggle.querySelector("i");

            if (icon) {
                icon.className = "fa-solid fa-bars";
            }

        });

    });

    // Auto close when resizing to desktop
    window.addEventListener("resize", () => {

        if (window.innerWidth > 992) {

            navMenu.classList.remove("active");

            newToggle.setAttribute("aria-expanded", "false");

            const icon = newToggle.querySelector("i");

            if (icon) {
                icon.className = "fa-solid fa-bars";
            }

        }

    });

}
