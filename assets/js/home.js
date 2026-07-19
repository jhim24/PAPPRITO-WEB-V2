/* ==========================================================
   PAPPRITO WEB V2
   Version : 2.6.1
   File : assets/js/home.js
   Description : Homepage Loader
========================================================== */

document.addEventListener("DOMContentLoaded", initializeHome);

/* ==========================================================
   INITIALIZE HOME
========================================================== */

async function initializeHome(){

    const app = document.getElementById("app");

    if(!app){

        console.error("Application root (#app) not found.");

        return;

    }

    try{

        const response = await fetch("components/home-content.html");

        if(!response.ok){

            throw new Error("Unable to load Home Component.");

        }

        app.innerHTML = await response.text();

    }

    catch(error){

        console.error(error);

        app.innerHTML = `
            <section style="padding:120px 20px;text-align:center">
                <h2>Unable to load homepage.</h2>
                <p>Please check the file path:</p>
                <strong>components/home-content.html</strong>
            </section>
        `;

    }

}
