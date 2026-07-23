/* ==========================================================
   PAPPRITO WEBSITE
   MENU MODULE
   STEP 4.1
========================================================== */

let categories = [];

/* ==========================================================
   START
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadCategories();

});

/* ==========================================================
   LOAD CATEGORIES
========================================================== */

function loadCategories(){

    db.ref("categories")
      .orderByChild("displayOrder")
      .once("value")

      .then((snapshot)=>{

          categories = [];

          snapshot.forEach((child)=>{

              const category = child.val();

              category.id = child.key;

              if(category.status === "Active"){

                  categories.push(category);

              }

          });

          renderCategories();

      });

}

/* ==========================================================
   RENDER CATEGORIES
========================================================== */

function renderCategories(){

    const wrapper =
        document.getElementById("menu-category-wrapper");

    if(!wrapper) return;

    wrapper.innerHTML = "";

    wrapper.innerHTML += `

        <button
            class="category-btn active"
            data-category="all">

            All

        </button>

    `;

    categories.forEach(category=>{

        wrapper.innerHTML += `

            <button
                class="category-btn"
                data-category="${category.name}">

                ${category.name}

            </button>

        `;

    });

}
