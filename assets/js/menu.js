/* ==========================================================
   PAPPRITO WEBSITE
   MENU SYSTEM
   FINAL VERSION
   PART 1 — CORE + FIREBASE
========================================================== */

let menuCategories = [];
let menuProducts = [];
let selectedCategory = "all";

let selectedProduct = null;
let selectedQuantity = 0;

let menuCart = [];
let menuSearchValue = "";

let menuInitialized = false;

const MENU_CART_STORAGE = "pappritoMenuCart";

const MENU_DEFAULT_IMAGE =
    "../assets/images/no-product.png";


/* ==========================================================
   START
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        startMenu();

    }
);


/* ==========================================================
   START MENU
========================================================== */

async function startMenu(){

    if(menuInitialized){

        return;

    }

    try{

        showMenuLoading();

        await waitForDatabase();

        /*
         * IMPORTANT:
         * PRODUCTS FIRST.
         * Categories must never block products.
         */

        await loadMenuProducts();


        /*
         * Categories are optional.
         */

        try{

            await loadMenuCategories();

        }catch(categoryError){

            console.warn(
                "Categories could not be loaded:",
                categoryError
            );

            menuCategories = [];

            renderMenuCategories();

        }


        loadCart();

        initializeMenuEvents();

        updateCartUI();

        updateMenuResultCount();

        menuInitialized = true;


        console.log(
            "PAPPRITO MENU READY"
        );

        console.log(
            "Products:",
            menuProducts.length
        );

        console.log(
            "Categories:",
            menuCategories.length
        );


    }catch(error){

        console.error(
            "PAPPRITO MENU ERROR:",
            error
        );

        showMenuError(error);

    }

}


/* ==========================================================
   WAIT FOR FIREBASE
========================================================== */

function waitForDatabase(){

    return new Promise(
        function(resolve,reject){

            let attempts = 0;

            const timer =
                setInterval(
                    function(){

                        attempts++;


                        if(
                            typeof db !== "undefined" &&
                            db &&
                            typeof db.ref === "function"
                        ){

                            clearInterval(timer);

                            resolve();

                            return;

                        }


                        if(
                            attempts >= 50
                        ){

                            clearInterval(timer);

                            reject(
                                new Error(
                                    "Firebase database 'db' was not found."
                                )
                            );

                        }

                    },
                    200
                );

        }
    );

}


/* ==========================================================
   DATABASE CHECK
========================================================== */

function checkDatabase(){

    if(
        typeof db === "undefined" ||
        !db ||
        typeof db.ref !== "function"
    ){

        throw new Error(
            "Firebase database 'db' is not available."
        );

    }

}


/* ==========================================================
   DEFAULT IMAGE
========================================================== */

function getMenuProductImage(
    product
){

    if(
        product &&
        product.image &&
        String(
            product.image
        ).trim() !== ""
    ){

        return product.image;

    }

    return MENU_DEFAULT_IMAGE;

}


/* ==========================================================
   PRICE
========================================================== */

function formatMenuPrice(
    value
){

    return "₱" +
        Number(
            value || 0
        ).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        );

}


/* ==========================================================
   SAFE HTML
========================================================== */

function escapeHTML(
    value
){

    return String(
        value ?? ""
    )
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


/* ==========================================================
   LOADING
========================================================== */

function showMenuLoading(){

    const container =
        document.getElementById(
            "menu-products"
        );


    if(!container){

        return;

    }


    container.innerHTML = `

        <div class="menu-loading">

            <i class="fa-solid fa-spinner"></i>

            <span>
                Loading menu...
            </span>

        </div>

    `;

}


/* ==========================================================
   ERROR
========================================================== */

function showMenuError(
    error
){

    console.error(
        "MENU ERROR DETAILS:",
        error
    );


    const container =
        document.getElementById(
            "menu-products"
        );


    if(!container){

        return;

    }


    container.innerHTML = `

        <div class="menu-empty">

            <div class="menu-empty-icon">

                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>

            <h3>
                Menu temporarily unavailable
            </h3>

            <p>
                Please refresh the page and try again.
            </p>

            <button
                type="button"
                class="reset-menu-btn"
                onclick="refreshMenu()">

                <i class="fa-solid fa-rotate-right"></i>

                Refresh Menu

            </button>

        </div>

    `;

}
/* ==========================================================
   PART 2 — CATEGORIES
========================================================== */


/* ==========================================================
   LOAD CATEGORIES
========================================================== */

async function loadMenuCategories(){

    checkDatabase();


    const snapshot =
        await db
        .ref("categories")
        .once("value");


    menuCategories = [];


    snapshot.forEach(
        function(child){

            const category =
                child.val() || {};


            category.id =
                child.key;


            const status =
                String(
                    category.status || ""
                )
                .trim()
                .toLowerCase();


            if(
                status === "active"
            ){

                menuCategories.push(
                    category
                );

            }

        }
    );


    menuCategories.sort(
        function(a,b){

            return Number(
                a.displayOrder || 999999
            )
            -
            Number(
                b.displayOrder || 999999
            );

        }
    );


    renderMenuCategories();

}


/* ==========================================================
   RENDER CATEGORIES
========================================================== */

function renderMenuCategories(){

    const wrapper =
        document.getElementById(
            "menu-category-wrapper"
        );


    if(!wrapper){

        return;

    }


    wrapper.innerHTML = "";


    const allButton =
        document.createElement(
            "button"
        );


    allButton.type =
        "button";

    allButton.className =
        "category-btn";

    allButton.dataset.category =
        "all";

    allButton.innerHTML = `

        <i class="fa-solid fa-border-all"></i>

        All

    `;


    wrapper.appendChild(
        allButton
    );


    menuCategories.forEach(
        function(category){

            const name =
                String(
                    category.name || ""
                ).trim();


            if(!name){

                return;

            }


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "category-btn";

            button.dataset.category =
                name;

            button.innerHTML = `

                <i class="fa-solid fa-utensils"></i>

                ${escapeHTML(name)}

            `;


            wrapper.appendChild(
                button
            );

        }
    );


    updateActiveCategory();

}


/* ==========================================================
   CATEGORY EVENTS
========================================================== */

function initializeCategoryEvents(){

    const wrapper =
        document.getElementById(
            "menu-category-wrapper"
        );


    if(!wrapper){

        return;

    }


    wrapper.addEventListener(
        "click",
        function(event){

            const button =
                event.target.closest(
                    ".category-btn"
                );


            if(!button){

                return;

            }


            selectedCategory =
                button.dataset.category ||
                "all";


            updateActiveCategory();

            renderMenuProducts();

            updateMenuResultCount();


            button.scrollIntoView({
                behavior:"smooth",
                block:"nearest",
                inline:"center"
            });

        }
    );

}


/* ==========================================================
   ACTIVE CATEGORY
========================================================== */

function updateActiveCategory(){

    document
        .querySelectorAll(
            "#menu-category-wrapper .category-btn"
        )
        .forEach(
            function(button){

                button.classList.toggle(
                    "active",
                    button.dataset.category ===
                    selectedCategory
                );

            }
        );

}


/* ==========================================================
   CATEGORY SCROLL
========================================================== */

function initializeCategoryScroll(){

    const wrapper =
        document.getElementById(
            "menu-category-wrapper"
        );


    const left =
        document.getElementById(
            "categoryScrollLeft"
        );


    const right =
        document.getElementById(
            "categoryScrollRight"
        );


    if(
        wrapper &&
        left
    ){

        left.addEventListener(
            "click",
            function(){

                wrapper.scrollBy({
                    left:-280,
                    behavior:"smooth"
                });

            }
        );

    }


    if(
        wrapper &&
        right
    ){

        right.addEventListener(
            "click",
            function(){

                wrapper.scrollBy({
                    left:280,
                    behavior:"smooth"
                });

            }
        );

    }

}
/* ==========================================================
   PART 3 — PRODUCTS
========================================================== */


/* ==========================================================
   LOAD PRODUCTS
========================================================== */

async function loadMenuProducts(){

    checkDatabase();


    const snapshot =
        await db
        .ref("products")
        .once("value");


    menuProducts = [];


    if(
        !snapshot.exists()
    ){

        console.warn(
            "PAPPRITO MENU: No products found."
        );

        renderMenuProducts();

        return;

    }


    snapshot.forEach(
        function(child){

            const product =
                child.val() || {};


            product.id =
                child.key;


            /*
             * Product Master can use:
             *
             * category
             *
             * Older menu data can use:
             *
             * categoryName
             */

            product.categoryName =
                product.categoryName ||
                product.category ||
                "";


            const status =
                String(
                    product.status ?? ""
                )
                .trim()
                .toLowerCase();


            /*
             * Active product.
             */

            const active =
                status === "active" ||
                status === "available" ||
                status === "enabled" ||
                status === "1" ||
                product.status === true;


            if(active){

                menuProducts.push(
                    product
                );

            }

        }
    );


    menuProducts.sort(
        function(a,b){

            return String(
                a.name || ""
            )
            .localeCompare(
                String(
                    b.name || ""
                ),
                "en",
                {
                    sensitivity:"base"
                }
            );

        }
    );


    console.log(
        "PAPPRITO PRODUCTS LOADED:",
        menuProducts.length
    );


    renderMenuProducts();

}


/* ==========================================================
   GET FILTERED PRODUCTS
========================================================== */

function getFilteredProducts(){

    if(
        selectedCategory === "all"
    ){

        return menuProducts.slice();

    }


    return menuProducts.filter(
        function(product){

            return String(
                product.categoryName || ""
            )
            .trim()
            .toLowerCase()
            ===
            String(
                selectedCategory
            )
            .trim()
            .toLowerCase();

        }
    );

}


/* ==========================================================
   RENDER PRODUCTS
========================================================== */

function renderMenuProducts(){

    const container =
        document.getElementById(
            "menu-products"
        );


    if(!container){

        return;

    }


    let products =
        getFilteredProducts();


    const search =
        menuSearchValue
        .trim()
        .toLowerCase();


    if(search){

        products =
            products.filter(
                function(product){

                    const name =
                        String(
                            product.name || ""
                        )
                        .toLowerCase();


                    const category =
                        String(
                            product.categoryName || ""
                        )
                        .toLowerCase();


                    const description =
                        String(
                            product.description || ""
                        )
                        .toLowerCase();


                    return (
                        name.includes(search) ||
                        category.includes(search) ||
                        description.includes(search)
                    );

                }
            );

    }


    container.innerHTML = "";


    if(
        products.length === 0
    ){

        showMenuEmpty(
            search
        );

        updateMenuResultCount(
            0
        );

        return;

    }


    hideMenuEmpty();


    products.forEach(
        function(product){

            container.insertAdjacentHTML(
                "beforeend",
                createMenuProductCard(
                    product
                )
            );

        }
    );


    updateMenuResultCount(
        products.length
    );

}


/* ==========================================================
   PRODUCT CARD
========================================================== */

function createMenuProductCard(
    product
){

    const id =
        escapeHTML(
            product.id
        );


    const name =
        escapeHTML(
            product.name ||
            "Product"
        );


    const category =
        escapeHTML(
            product.categoryName ||
            "Menu"
        );


    const description =
        escapeHTML(
            product.description ||
            "Freshly prepared with quality ingredients."
        );


    const image =
        escapeHTML(
            getMenuProductImage(
                product
            )
        );


    const price =
        formatMenuPrice(
            product.sellingPrice
        );


    return `

        <article
            class="menu-card"
            data-product-id="${id}">

            <button
                type="button"
                class="menu-image"
                onclick="openProductModal('${id}')"
                aria-label="View ${name}">

                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy">

            </button>


            <div class="menu-card-body">

                <span class="menu-category">

                    ${category}

                </span>


                <h3>

                    ${name}

                </h3>


                <p>

                    ${description}

                </p>


                <div class="menu-footer">

                    <div class="menu-price">

                        ${price}

                    </div>


                    <button
                        type="button"
                        class="menu-order-btn"
                        onclick="event.stopPropagation(); openProductModal('${id}')">

                        <i class="fa-solid fa-plus"></i>

                        Add

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* ==========================================================
   PRODUCT EVENTS
========================================================== */

function initializeProductEvents(){

    const container =
        document.getElementById(
            "menu-products"
        );


    if(!container){

        return;

    }


    container.addEventListener(
        "click",
        function(event){

            const card =
                event.target.closest(
                    ".menu-card"
                );


            if(!card){

                return;

            }


            if(
                event.target.closest(
                    "button"
                )
            ){

                return;

            }


            openProductModal(
                card.dataset.productId
            );

        }
    );

}


/* ==========================================================
   RESULT COUNT
========================================================== */

function updateMenuResultCount(
    count
){

    const element =
        document.getElementById(
            "menu-result-count"
        );


    if(!element){

        return;

    }


    if(
        count === undefined
    ){

        let products =
            getFilteredProducts();


        const search =
            menuSearchValue
            .trim()
            .toLowerCase();


        if(search){

            products =
                products.filter(
                    function(product){

                        return (
                            String(
                                product.name || ""
                            )
                            .toLowerCase()
                            .includes(search)
                            ||
                            String(
                                product.categoryName || ""
                            )
                            .toLowerCase()
                            .includes(search)
                            ||
                            String(
                                product.description || ""
                            )
                            .toLowerCase()
                            .includes(search)
                        );

                    }
                );

        }


        count =
            products.length;

    }


    element.innerHTML = `

        <i class="fa-solid fa-utensils"></i>

        <span>

            ${count}
            ${count === 1 ? "item" : "items"}

        </span>

    `;

}
/* ==========================================================
   PART 4 — SEARCH + EMPTY STATE
========================================================== */


/* ==========================================================
   SEARCH
========================================================== */

function initializeMenuSearch(){

    const input =
        document.getElementById(
            "menuSearch"
        );


    const clearButton =
        document.getElementById(
            "clearMenuSearch"
        );


    if(input){

        input.addEventListener(
            "input",
            function(){

                menuSearchValue =
                    input.value;


                renderMenuProducts();


                if(clearButton){

                    clearButton.classList.toggle(
                        "show",
                        input.value.trim() !== ""
                    );

                }

            }
        );

    }


    if(clearButton){

        clearButton.addEventListener(
            "click",
            function(){

                if(input){

                    input.value = "";

                }


                menuSearchValue = "";


                clearButton.classList.remove(
                    "show"
                );


                renderMenuProducts();


                if(input){

                    input.focus();

                }

            }
        );

    }

}


/* ==========================================================
   EMPTY
========================================================== */

function showMenuEmpty(
    isSearch
){

    const container =
        document.getElementById(
            "menu-products"
        );


    if(!container){

        return;

    }


    container.innerHTML = `

        <div class="menu-empty">

            <div class="menu-empty-icon">

                <i class="fa-solid ${
                    isSearch
                    ? "fa-magnifying-glass"
                    : "fa-bowl-food"
                }"></i>

            </div>


            <h3>

                ${
                    isSearch
                    ? "No matching dishes"
                    : "No dishes found"
                }

            </h3>


            <p>

                ${
                    isSearch
                    ? "Try another search or category."
                    : "There are currently no active products."
                }

            </p>


            <button
                type="button"
                id="menuEmptyReset"
                class="reset-menu-btn">

                <i class="fa-solid fa-rotate-left"></i>

                View All Menu

            </button>

        </div>

    `;


    const reset =
        document.getElementById(
            "menuEmptyReset"
        );


    if(reset){

        reset.addEventListener(
            "click",
            resetMenu
        );

    }

}


/* ==========================================================
   HIDE EMPTY
========================================================== */

function hideMenuEmpty(){

    const empty =
        document.getElementById(
            "menu-empty"
        );


    if(empty){

        empty.classList.add(
            "hidden"
        );

    }

}


/* ==========================================================
   EXISTING HTML RESET BUTTON
========================================================== */

function initializeResetButton(){

    const button =
        document.getElementById(
            "resetMenuSearch"
        );


    if(button){

        button.addEventListener(
            "click",
            resetMenu
        );

    }

}


/* ==========================================================
   RESET MENU
========================================================== */

function resetMenu(){

    selectedCategory =
        "all";


    menuSearchValue =
        "";


    const input =
        document.getElementById(
            "menuSearch"
        );


    if(input){

        input.value = "";

    }


    const clearButton =
        document.getElementById(
            "clearMenuSearch"
        );


    if(clearButton){

        clearButton.classList.remove(
            "show"
        );

    }


    updateActiveCategory();


    renderMenuProducts();


    updateMenuResultCount();

}
/* ==========================================================
   PART 5 — PRODUCT MODAL
========================================================== */


/* ==========================================================
   OPEN MODAL
========================================================== */

function openProductModal(
    productId
){

    const product =
        menuProducts.find(
            function(item){

                return String(
                    item.id
                ) ===
                String(
                    productId
                );

            }
        );


    if(!product){

        console.warn(
            "Product not found:",
            productId
        );

        return;

    }


    selectedProduct =
        product;


    selectedQuantity =
    0;


    const modal =
        document.getElementById(
            "productModal"
        );


    const image =
        document.getElementById(
            "modalImage"
        );


    const category =
        document.getElementById(
            "modalCategory"
        );


    const name =
        document.getElementById(
            "modalName"
        );


    const description =
        document.getElementById(
            "modalDescription"
        );


    const price =
        document.getElementById(
            "modalPrice"
        );


    const quantity =
        document.getElementById(
            "modalQty"
        );


    if(image){

        image.src =
            getMenuProductImage(
                product
            );

        image.alt =
            product.name ||
            "Product";

    }


    if(category){

        category.textContent =
            product.categoryName ||
            "Menu";

    }


    if(name){

        name.textContent =
            product.name ||
            "Product";

    }


    if(description){

        description.textContent =
            product.description ||
            "Freshly prepared with quality ingredients.";

    }


    if(price){

        price.textContent =
            formatMenuPrice(
                product.sellingPrice
            );

    }


    if(quantity){

        quantity.textContent =
            "1";

    }


    updateModalTotal();


    if(modal){

        modal.classList.add(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    document.body.classList.add(
        "product-modal-open"
    );

}


/* ==========================================================
   CLOSE MODAL
========================================================== */

function closeProductModal(){

    const modal =
        document.getElementById(
            "productModal"
        );


    if(modal){

        modal.classList.remove(
            "active"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "product-modal-open"
    );


    selectedProduct =
        null;


  selectedQuantity =
    0;

}


/* ==========================================================
   MODAL TOTAL
========================================================== */

function updateModalTotal(){

    if(!selectedProduct){

        return;

    }


    const quantity =
        document.getElementById(
            "modalQty"
        );


    const total =
        document.getElementById(
            "modalTotalPrice"
        );


    const price =
        Number(
            selectedProduct.sellingPrice ||
            0
        );


    const calculated =
        price *
        selectedQuantity;


    if(quantity){

        quantity.textContent =
            selectedQuantity;

    }


    if(total){

        total.textContent =
            formatMenuPrice(
                calculated
            );

    }

}


/* ==========================================================
   MINUS
========================================================== */

function decreaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    if(
        selectedQuantity > 0
    ){

        selectedQuantity--;

    }


    updateModalTotal();

}
/* ==========================================================
   PLUS
========================================================== */

function increaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    selectedQuantity++;


    updateModalTotal();

}


/* ==========================================================
   ADD TO CART
========================================================== */

function addSelectedProductToCart(){

    if(!selectedProduct){

        return;

    }


    addProductToCart(
        selectedProduct,
        selectedQuantity
    );


    showMenuToast(
        selectedProduct.name +
        " added to cart"
    );


    closeProductModal();


    openCart();

}


/* ==========================================================
   MODAL EVENTS
========================================================== */

function initializeProductModalEvents(){

    const closeButton =
        document.getElementById(
            "closeProductModal"
        );


    const backdrop =
        document.getElementById(
            "productModalBackdrop"
        );


    const minusButton =
        document.getElementById(
            "modalQtyMinus"
        );


    const plusButton =
        document.getElementById(
            "modalQtyPlus"
        );


    const orderButton =
        document.getElementById(
            "modalOrderBtn"
        );


    if(closeButton){

        closeButton.addEventListener(
            "click",
            closeProductModal
        );

    }


    if(backdrop){

        backdrop.addEventListener(
            "click",
            closeProductModal
        );

    }


    if(minusButton){

        minusButton.addEventListener(
            "click",
            decreaseModalQuantity
        );

    }


    if(plusButton){

        plusButton.addEventListener(
            "click",
            increaseModalQuantity
        );

    }


    if(orderButton){

        orderButton.addEventListener(
            "click",
            addSelectedProductToCart
        );

    }

}


/* ==========================================================
   MODAL ESCAPE
========================================================== */

function initializeModalKeyboard(){

    document.addEventListener(
        "keydown",
        function(event){

            if(
                event.key === "Escape"
            ){

                closeProductModal();

            }

        }
    );

}
/* ==========================================================
   PART 6 — CART ENGINE
========================================================== */


/* ==========================================================
   LOAD CART
========================================================== */

function loadCart(){

    try{

        const saved =
            localStorage.getItem(
                MENU_CART_STORAGE
            );


        if(!saved){

            menuCart = [];

            return;

        }


        const parsed =
            JSON.parse(
                saved
            );


        if(
            !Array.isArray(parsed)
        ){

            menuCart = [];

            return;

        }


        menuCart =
            parsed
            .filter(
                function(item){

                    return (
                        item &&
                        item.id &&
                        Number(
                            item.quantity || 0
                        ) > 0
                    );

                }
            )
            .map(
                function(item){

                    return {

                        id:
                            item.id,

                        name:
                            item.name ||
                            "Product",

                        categoryName:
                            item.categoryName ||
                            item.category ||
                            "Menu",

                        description:
                            item.description ||
                            "",

                        image:
                            item.image ||
                            "",

                        sellingPrice:
                            Number(
                                item.sellingPrice ||
                                0
                            ),

                        quantity:
                            Math.max(
                                1,
                                Number(
                                    item.quantity ||
                                    1
                                )
                            )

                    };

                }
            );


    }catch(error){

        console.error(
            "CART LOAD ERROR:",
            error
        );


        menuCart = [];

    }

}


/* ==========================================================
   SAVE CART
========================================================== */

function saveCart(){

    try{

        localStorage.setItem(
            MENU_CART_STORAGE,
            JSON.stringify(
                menuCart
            )
        );


    }catch(error){

        console.error(
            "CART SAVE ERROR:",
            error
        );

    }

}


/* ==========================================================
   FIND CART ITEM
========================================================== */

function findCartItem(
    productId
){

    return menuCart.find(
        function(item){

            return String(
                item.id
            ) ===
            String(
                productId
            );

        }
    );

}


/* ==========================================================
   ADD PRODUCT
========================================================== */

function addProductToCart(
    product,
    quantity
){

    if(!product){

        return;

    }


    const qty =
        Math.max(
            1,
            Math.floor(
                Number(
                    quantity || 1
                )
            )
        );


    const existing =
        findCartItem(
            product.id
        );


    if(existing){

        existing.quantity =
            Number(
                existing.quantity || 0
            )
            +
            qty;

    }else{

        menuCart.push({

            id:
                product.id,

            name:
                product.name ||
                "Product",

            categoryName:
                product.categoryName ||
                product.category ||
                "Menu",

            description:
                product.description ||
                "",

            image:
                product.image ||
                "",

            sellingPrice:
                Number(
                    product.sellingPrice ||
                    0
                ),

            quantity:
                qty

        });

    }


    saveCart();


    updateCartUI();

}


/* ==========================================================
   INCREASE
========================================================== */

function increaseCartItem(
    productId
){

    const item =
        findCartItem(
            productId
        );


    if(!item){

        return;

    }


    item.quantity =
        Number(
            item.quantity || 0
        )
        +
        1;


    saveCart();


    updateCartUI();

}


/* ==========================================================
   DECREASE
========================================================== */

function decreaseCartItem(
    productId
){

    const item =
        findCartItem(
            productId
        );


    if(!item){

        return;

    }


    if(
        Number(
            item.quantity || 0
        ) <= 1
    ){

        removeFromCart(
            productId
        );

        return;

    }


    item.quantity--;


    saveCart();


    updateCartUI();

}


/* ==========================================================
   REMOVE
========================================================== */

function removeFromCart(
    productId
){

    menuCart =
        menuCart.filter(
            function(item){

                return String(
                    item.id
                ) !==
                String(
                    productId
                );

            }
        );


    saveCart();


    updateCartUI();

}


/* ==========================================================
   CLEAR
========================================================== */

function clearCart(){

    menuCart = [];


    saveCart();


    updateCartUI();

}


/* ==========================================================
   CART QUANTITY
========================================================== */

function getCartQuantity(){

    return menuCart.reduce(
        function(total,item){

            return total +
                Number(
                    item.quantity || 0
                );

        },
        0
    );

}


/* ==========================================================
   SUBTOTAL
========================================================== */

function getCartSubtotal(){

    return menuCart.reduce(
        function(total,item){

            return total +
                (
                    Number(
                        item.sellingPrice || 0
                    )
                    *
                    Number(
                        item.quantity || 0
                    )
                );

        },
        0
    );

}


/* ==========================================================
   TOTAL
========================================================== */

function getCartTotal(){

    return getCartSubtotal();

}
/* ==========================================================
   PART 7 — CART DISPLAY + DRAWER
========================================================== */


/* ==========================================================
   RENDER CART ITEMS
========================================================== */

function renderCartItems(){

    const container =
        document.getElementById(
            "cartItems"
        );


    const empty =
        document.getElementById(
            "cartEmpty"
        );


    const summary =
        document.getElementById(
            "cartSummary"
        );


    if(!container){

        return;

    }


    if(
        menuCart.length === 0
    ){

        container.innerHTML = "";


        if(empty){

            empty.style.display =
                "flex";

        }


        if(summary){

            summary.style.display =
                "none";

        }


        return;

    }


    if(empty){

        empty.style.display =
            "none";

    }


    if(summary){

        summary.style.display =
            "block";

    }


    container.innerHTML = "";


    menuCart.forEach(
        function(item){

            container.insertAdjacentHTML(
                "beforeend",
                createCartItemHTML(
                    item
                )
            );

        }
    );

}


/* ==========================================================
   CART ITEM HTML
========================================================== */

function createCartItemHTML(
    item
){

    const id =
        escapeHTML(
            item.id
        );


    const name =
        escapeHTML(
            item.name ||
            "Product"
        );


    const image =
        escapeHTML(
            getMenuProductImage(
                item
            )
        );


    const price =
        Number(
            item.sellingPrice || 0
        );


    const quantity =
        Math.max(
            1,
            Number(
                item.quantity || 1
            )
        );


    const total =
        price *
        quantity;


    return `

        <div
            class="cart-item"
            data-cart-id="${id}">

            <div class="cart-item-image">

                <img
                    src="${image}"
                    alt="${name}"
                    loading="lazy">

            </div>


            <div class="cart-item-body">

                <div class="cart-item-name">

                    ${name}

                </div>


                <div class="cart-item-price">

                    ${formatMenuPrice(price)}

                </div>


                <div class="cart-item-controls">

                    <div class="cart-item-quantity">

                        <button
                            type="button"
                            class="cart-quantity-btn"
                            onclick="decreaseCartItem('${id}')">

                            <i class="fa-solid fa-minus"></i>

                        </button>


                        <span class="cart-item-qty">

                            ${quantity}

                        </span>


                        <button
                            type="button"
                            class="cart-quantity-btn"
                            onclick="increaseCartItem('${id}')">

                            <i class="fa-solid fa-plus"></i>

                        </button>

                    </div>


                    <strong class="cart-item-total">

                        ${formatMenuPrice(total)}

                    </strong>

                </div>

            </div>


            <button
                type="button"
                class="cart-item-remove"
                onclick="removeFromCart('${id}')"
                aria-label="Remove ${name}">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;

}


/* ==========================================================
   UPDATE CART UI
========================================================== */

function updateCartUI(){

    const quantity =
        getCartQuantity();


    const subtotal =
        getCartSubtotal();


    const total =
        getCartTotal();


    const count =
        document.getElementById(
            "cartCount"
        );


    const floatingTotal =
        document.getElementById(
            "cartTotal"
        );


    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    const deliveryElement =
        document.getElementById(
            "cartDelivery"
        );


    const grandTotal =
        document.getElementById(
            "cartGrandTotal"
        );


    const checkout =
        document.getElementById(
            "checkoutBtn"
        );


    if(count){

        count.textContent =
            quantity;


        count.classList.toggle(
            "show",
            quantity > 0
        );

    }


    if(floatingTotal){

        floatingTotal.textContent =
            formatMenuPrice(
                total
            );

    }


    if(subtotalElement){

        subtotalElement.textContent =
            formatMenuPrice(
                subtotal
            );

    }


    if(deliveryElement){

        deliveryElement.textContent =
            "₱0.00";

    }


    if(grandTotal){

        grandTotal.textContent =
            formatMenuPrice(
                total
            );

    }


    if(checkout){

        checkout.disabled =
            quantity === 0;

    }


    renderCartItems();

}


/* ==========================================================
   OPEN CART
========================================================== */

function openCart(){

    const drawer =
        document.getElementById(
            "cartDrawer"
        );


    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if(!drawer){

        return;

    }


    updateCartUI();


    drawer.classList.add(
        "active"
    );


    drawer.setAttribute(
        "aria-hidden",
        "false"
    );


    if(overlay){

        overlay.classList.add(
            "active"
        );

    }


    document.body.classList.add(
        "cart-open"
    );

}


/* ==========================================================
   CLOSE CART
========================================================== */

function closeCart(){

    const drawer =
        document.getElementById(
            "cartDrawer"
        );


    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if(drawer){

        drawer.classList.remove(
            "active"
        );


        drawer.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if(overlay){

        overlay.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "cart-open"
    );

}


/* ==========================================================
   TOGGLE
========================================================== */

function toggleCart(){

    const drawer =
        document.getElementById(
            "cartDrawer"
        );


    if(!drawer){

        return;

    }


    if(
        drawer.classList.contains(
            "active"
        )
    ){

        closeCart();

    }else{

        openCart();

    }

}


/* ==========================================================
   CART EVENTS
========================================================== */

function initializeCartEvents(){

    const viewCart =
        document.getElementById(
            "viewCartBtn"
        );


    const closeButton =
        document.getElementById(
            "closeCartBtn"
        );


    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    const startOrdering =
        document.getElementById(
            "startOrderingBtn"
        );


    if(viewCart){

        viewCart.addEventListener(
            "click",
            function(event){

                event.preventDefault();

                event.stopPropagation();

                openCart();

            }
        );

    }


    if(closeButton){

        closeButton.addEventListener(
            "click",
            function(event){

                event.preventDefault();

                closeCart();

            }
        );

    }


    if(overlay){

        overlay.addEventListener(
            "click",
            closeCart
        );

    }


    if(startOrdering){

        startOrdering.addEventListener(
            "click",
            function(event){

                event.preventDefault();

                closeCart();

                scrollToProducts();

            }
        );

    }

}
/* ==========================================================
   PART 8 — CHECKOUT + EVENTS
========================================================== */


/* ==========================================================
   CHECKOUT
========================================================== */

function initializeCheckout(){

    const button =
        document.getElementById(
            "checkoutBtn"
        );


    if(!button){

        return;

    }


    button.addEventListener(
        "click",
        function(event){

            event.preventDefault();


            if(
                menuCart.length === 0
            ){

                showMenuToast(
                    "Your cart is empty"
                );

                return;

            }


            console.log(
                "PAPPRITO ORDER:",
                menuCart
            );


            showMenuToast(
                "Checkout system coming soon"
            );

        }
    );

}


/* ==========================================================
   KEYBOARD
========================================================== */

function initializeKeyboard(){

    document.addEventListener(
        "keydown",
        function(event){

            if(
                event.key !== "Escape"
            ){

                return;

            }


            closeProductModal();

            closeCart();

        }
    );

}


/* ==========================================================
   IMAGE FALLBACK
========================================================== */

document.addEventListener(
    "error",
    function(event){

        const image =
            event.target;


        if(
            !image ||
            image.tagName !== "IMG"
        ){

            return;

        }


        if(
            image.dataset.fallbackApplied
        ){

            return;

        }


        image.dataset.fallbackApplied =
            "true";


        image.src =
            MENU_DEFAULT_IMAGE;

    },
    true
);


/* ==========================================================
   STORAGE SYNC
========================================================== */

window.addEventListener(
    "storage",
    function(event){

        if(
            event.key !==
            MENU_CART_STORAGE
        ){

            return;

        }


        loadCart();

        updateCartUI();

    }
);


/* ==========================================================
   REFRESH MENU
========================================================== */

async function refreshMenu(){

    try{

        showMenuLoading();


        await loadMenuProducts();


        try{

            await loadMenuCategories();

        }catch(error){

            console.warn(
                "Category refresh failed:",
                error
            );

        }


        updateCartUI();

        updateMenuResultCount();


    }catch(error){

        console.error(
            "MENU REFRESH ERROR:",
            error
        );


        showMenuError(
            error
        );

    }

}


/* ==========================================================
   SCROLL TO PRODUCTS
========================================================== */

function scrollToProducts(){

    const section =
        document.getElementById(
            "menu-items"
        );


    if(!section){

        return;

    }


    const offset =
        90;


    const position =
        section.getBoundingClientRect().top
        +
        window.scrollY
        -
        offset;


    window.scrollTo({

        top:
            Math.max(
                0,
                position
            ),

        behavior:"smooth"

    });

}


/* ==========================================================
   TOAST
========================================================== */

function showMenuToast(
    message
){

    let toast =
        document.querySelector(
            ".menu-toast"
        );


    if(!toast){

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "menu-toast";


        document.body.appendChild(
            toast
        );

    }


    toast.innerHTML = `

        <i class="fa-solid fa-check"></i>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toast._timer
    );


    toast._timer =
        setTimeout(
            function(){

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* ==========================================================
   INITIALIZE ALL EVENTS
========================================================== */

function initializeMenuEvents(){

    initializeCategoryEvents();

    initializeCategoryScroll();

    initializeProductEvents();

    initializeMenuSearch();

    initializeResetButton();

    initializeProductModalEvents();

    initializeModalKeyboard();

    initializeCartEvents();

    initializeCheckout();

    initializeKeyboard();

}
/* ==========================================================
   PART 9 — FINAL GLOBAL API
========================================================== */


/* ==========================================================
   GLOBAL FUNCTIONS
========================================================== */

window.openProductModal =
    openProductModal;


window.closeProductModal =
    closeProductModal;


window.increaseModalQuantity =
    increaseModalQuantity;


window.decreaseModalQuantity =
    decreaseModalQuantity;


window.addSelectedProductToCart =
    addSelectedProductToCart;


window.addProductToCart =
    addProductToCart;


window.increaseCartItem =
    increaseCartItem;


window.decreaseCartItem =
    decreaseCartItem;


window.removeFromCart =
    removeFromCart;


window.clearCart =
    clearCart;


window.openCart =
    openCart;


window.closeCart =
    closeCart;


window.toggleCart =
    toggleCart;


window.refreshMenu =
    refreshMenu;


window.resetMenu =
    resetMenu;


/* ==========================================================
   DEBUG
========================================================== */

window.PAPPRITO_MENU = {

    version:
        "FINAL",

    products:
        function(){

            return menuProducts;

        },

    categories:
        function(){

            return menuCategories;

        },

    cart:
        function(){

            return menuCart;

        },

    cartQuantity:
        function(){

            return getCartQuantity();

        },

    cartSubtotal:
        function(){

            return getCartSubtotal();

        },

    refresh:
        function(){

            return refreshMenu();

        }

};


/* ==========================================================
   FINAL MESSAGE
========================================================== */

console.log(
    "========================================"
);

console.log(
    "PAPPRITO MENU FINAL"
);

console.log(
    "Products + Categories + Search"
);

console.log(
    "Modal + Cart + Firebase"
);

console.log(
    "========================================"
);
