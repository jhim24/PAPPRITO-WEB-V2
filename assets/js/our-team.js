/* ==========================================================
   PAPPRITO WEB V5
   File        : our-team.js
   Description : Our Team Page Module
========================================================== */

document.addEventListener("DOMContentLoaded", function(){

    initializeTeamPage();

});


/* ==========================================================
   INITIALIZE
========================================================== */

function initializeTeamPage(){

    setupTeamButtons();

    setupTeamCards();

}


/* ==========================================================
   TEAM BUTTONS
========================================================== */

function setupTeamButtons(){

    const buttons =
        document.querySelectorAll(
            ".team-btn, .btn-home"
        );


    buttons.forEach(function(button){

        button.addEventListener(
            "click",
            function(){

                button.classList.add(
                    "team-button-clicked"
                );

            }
        );

    });

}


/* ==========================================================
   TEAM CARDS
========================================================== */

function setupTeamCards(){

    const cards =
        document.querySelectorAll(
            ".management-card"
        );


    cards.forEach(function(card){

        card.addEventListener(
            "mouseenter",
            function(){

                card.classList.add(
                    "team-card-active"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            function(){

                card.classList.remove(
                    "team-card-active"
                );

            }
        );

    });

}


/* ==========================================================
   END
========================================================== */
