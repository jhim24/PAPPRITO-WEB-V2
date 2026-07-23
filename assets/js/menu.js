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

    loadProducts();

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
/* ==========================================================
   LOAD PRODUCTS
========================================================== */
let selectedCategory = "all";
let products = [];

function loadProducts(){

    db.ref("products")

      .orderByChild("name")

      .once("value")

      .then((snapshot)=>{

          products = [];

          snapshot.forEach((child)=>{

              const product = child.val();

              product.id = child.key;

              if(product.status === "Active"){

                  products.push(product);

              }

          });

          renderProducts();

      });

}
/* ==========================================
   CATEGORY BUTTON EVENTS
========================================== */

const buttons = document.querySelectorAll(".category-btn");

buttons.forEach(button=>{

    button.addEventListener("click",()=>{

        buttons.forEach(btn=>btn.classList.remove("active"));

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        renderProducts();

    });

});
/* ==========================================================
   RENDER PRODUCTS
========================================================== */

function renderProducts(){

    const container =
        document.getElementById("menu-products");

    if(!container) return;

    container.innerHTML = "";

   products
.filter(product => {

    if(selectedCategory === "all"){

        return true;

    }

    return product.categoryName === selectedCategory;

})
.forEach(product=>{

        const image =
            product.image && product.image !== ""
                ? product.image
                : "../assets/images/no-product.png";

        container.innerHTML += `

        <div class="menu-card">

            <img
                src="${image}"
                alt="${product.name}">

            <div class="menu-card-body">

                <h3>${product.name}</h3>

                <p>${product.categoryName}</p>

                <h4>₱${Number(product.sellingPrice || 0).toFixed(2)}</h4>

            </div>

        </div>

        `;

    });

}
