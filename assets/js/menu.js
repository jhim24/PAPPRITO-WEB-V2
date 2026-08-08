/* ==========================================================
   PAPPRITO WEBSITE V8
   MENU SYSTEM
   FILE : menu.js
   PART 1
   CORE DATA + FIREBASE
========================================================== */


/* ==========================================================
   GLOBAL DATA
========================================================== */

let menuCategories = [];

let menuProducts = [];

let selectedCategory = "all";

let selectedProduct = null;

let selectedQuantity = 1;

let menuCart = [];

let menuSearchValue = "";


/* ==========================================================
   CONSTANTS
========================================================== */

const MENU_CART_STORAGE =
    "pappritoMenuCart";

const MENU_DEFAULT_IMAGE =
    "../assets/images/no-product.png";


/* ==========================================================
   INITIALIZATION LOCK
========================================================== */

let menuInitialized = false;


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        waitForFirebase();

    }
);


/* ==========================================================
   FIREBASE WAIT
========================================================== */

function waitForFirebase(){

    if(
        typeof db !== "undefined"
    ){

        initializeMenu();

        return;

    }


    let attempts = 0;

    const timer =
        setInterval(
            () => {

                attempts++;


                if(
                    typeof db !== "undefined"
                ){

                    clearInterval(timer);

                    initializeMenu();

                    return;

                }


                if(
                    attempts >= 50
                ){

                    clearInterval(timer);

                    console.error(
                        "PAPPRITO MENU: Firebase database unavailable."
                    );

                    showMenuError();

                }

            },
            200
        );

    }


/* ==========================================================
   MAIN INITIALIZATION
========================================================== */

async function initializeMenu(){

    if(menuInitialized){

        return;

    }


    menuInitialized = true;


    try{

        showMenuLoading();

        await loadMenuCategories();

        await loadMenuProducts();

        loadCart();

        initializeMenuEvents();

        updateCartUI();

        updateMenuResultCount();

        console.log(
            "PAPPRITO MENU V8 READY"
        );

    }catch(error){

        console.error(
            "PAPPRITO MENU ERROR:",
            error
        );

        showMenuError();

    }

}


/* ==========================================================
   DATABASE CHECK
========================================================== */

function checkDatabase(){

    if(
        typeof db === "undefined"
    ){

        throw new Error(
            "Firebase database 'db' is not available."
        );

    }

}


/* ==========================================================
   LOAD CATEGORIES
========================================================== */

async function loadMenuCategories(){

    checkDatabase();


    const snapshot =
        await db
        .ref("categories")
        .orderByChild("displayOrder")
        .once("value");


    menuCategories = [];


    snapshot.forEach(
        child => {

            const category =
                child.val() || {};


            category.id =
                child.key;


            if(
                category.status === "Active"
            ){

                menuCategories.push(
                    category
                );

            }

        }
    );


    renderMenuCategories();

}


/* ==========================================================
   LOAD PRODUCTS
========================================================== */

async function loadMenuProducts(){

    checkDatabase();


    const snapshot =
        await db
        .ref("products")
        .orderByChild("name")
        .once("value");


    menuProducts = [];


    snapshot.forEach(
        child => {

            const product =
                child.val() || {};


            product.id =
                child.key;


            if(
                product.status === "Active"
            ){

                menuProducts.push(
                    product
                );

            }

        }
    );


    renderMenuProducts();

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
   PRICE FORMAT
========================================================== */

function formatMenuPrice(
    amount
){

    return "₱" +
        Number(
            amount || 0
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

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

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

            <h3>
                Loading menu...
            </h3>

            <p>
                Please wait while we load our dishes.
            </p>

        </div>

    `;

}


/* ==========================================================
   ERROR
========================================================== */

function showMenuError(){

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
   PAPPRITO WEBSITE V8
   MENU SYSTEM
   FILE : menu.js
   PART 1
   CORE DATA + FIREBASE
========================================================== */


/* ==========================================================
   GLOBAL DATA
========================================================== */

let menuCategories = [];

let menuProducts = [];

let selectedCategory = "all";

let selectedProduct = null;

let selectedQuantity = 1;

let menuCart = [];

let menuSearchValue = "";


/* ==========================================================
   CONSTANTS
========================================================== */

const MENU_CART_STORAGE =
    "pappritoMenuCart";

const MENU_DEFAULT_IMAGE =
    "../assets/images/no-product.png";


/* ==========================================================
   INITIALIZATION LOCK
========================================================== */

let menuInitialized = false;


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        waitForFirebase();

    }
);


/* ==========================================================
   FIREBASE WAIT
========================================================== */

function waitForFirebase(){

    if(
        typeof db !== "undefined"
    ){

        initializeMenu();

        return;

    }


    let attempts = 0;

    const timer =
        setInterval(
            () => {

                attempts++;


                if(
                    typeof db !== "undefined"
                ){

                    clearInterval(timer);

                    initializeMenu();

                    return;

                }


                if(
                    attempts >= 50
                ){

                    clearInterval(timer);

                    console.error(
                        "PAPPRITO MENU: Firebase database unavailable."
                    );

                    showMenuError();

                }

            },
            200
        );

    }


/* ==========================================================
   MAIN INITIALIZATION
========================================================== */

async function initializeMenu(){

    if(menuInitialized){

        return;

    }


    menuInitialized = true;


    try{

        showMenuLoading();

        await loadMenuCategories();

        await loadMenuProducts();

        loadCart();

        initializeMenuEvents();

        updateCartUI();

        updateMenuResultCount();

        console.log(
            "PAPPRITO MENU V8 READY"
        );

    }catch(error){

        console.error(
            "PAPPRITO MENU ERROR:",
            error
        );

        showMenuError();

    }

}


/* ==========================================================
   DATABASE CHECK
========================================================== */

function checkDatabase(){

    if(
        typeof db === "undefined"
    ){

        throw new Error(
            "Firebase database 'db' is not available."
        );

    }

}


/* ==========================================================
   LOAD CATEGORIES
========================================================== */

async function loadMenuCategories(){

    checkDatabase();


    const snapshot =
        await db
        .ref("categories")
        .orderByChild("displayOrder")
        .once("value");


    menuCategories = [];


    snapshot.forEach(
        child => {

            const category =
                child.val() || {};


            category.id =
                child.key;


            if(
                category.status === "Active"
            ){

                menuCategories.push(
                    category
                );

            }

        }
    );


    renderMenuCategories();

}


/* ==========================================================
   LOAD PRODUCTS
========================================================== */

async function loadMenuProducts(){

    checkDatabase();


    const snapshot =
        await db
        .ref("products")
        .orderByChild("name")
        .once("value");


    menuProducts = [];


    snapshot.forEach(
        child => {

            const product =
                child.val() || {};


            product.id =
                child.key;


            if(
                product.status === "Active"
            ){

                menuProducts.push(
                    product
                );

            }

        }
    );


    renderMenuProducts();

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
   PRICE FORMAT
========================================================== */

function formatMenuPrice(
    amount
){

    return "₱" +
        Number(
            amount || 0
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

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /</g,
        "&lt;"
    )

    .replace(
        />/g,
        "&gt;"
    )

    .replace(
        /"/g,
        "&quot;"
    )

    .replace(
        /'/g,
        "&#039;"
    );

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

            <h3>
                Loading menu...
            </h3>

            <p>
                Please wait while we load our dishes.
            </p>

        </div>

    `;

}


/* ==========================================================
   ERROR
========================================================== */

function showMenuError(){

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
   PART 3
   PRODUCTS + SEARCH
========================================================== */


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


    let filtered =
        getFilteredMenuProducts();


    /* ======================================================
       SEARCH
    ====================================================== */

    const search =
        menuSearchValue
        .trim()
        .toLowerCase();


    if(search){

        filtered =
            filtered.filter(
                product => {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const category =
                        String(
                            product.categoryName || ""
                        ).toLowerCase();


                    const description =
                        String(
                            product.description || ""
                        ).toLowerCase();


                    return (
                        name.includes(search) ||
                        category.includes(search) ||
                        description.includes(search)
                    );

                }
            );

    }


    container.innerHTML = "";


    /* ======================================================
       EMPTY
    ====================================================== */

    if(
        filtered.length === 0
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


    /* ======================================================
       CARDS
    ====================================================== */

    filtered.forEach(
        product => {

            container.insertAdjacentHTML(
                "beforeend",
                createMenuProductCard(
                    product
                )
            );

        }
    );


    updateMenuResultCount(
        filtered.length
    );

}


/* ==========================================================
   CREATE PRODUCT CARD
========================================================== */

function createMenuProductCard(
    product
){

    const image =
        escapeHTML(
            getMenuProductImage(
                product
            )
        );


    const name =
        escapeHTML(
            product.name ||
            "Unnamed Product"
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


    const price =
        formatMenuPrice(
            product.sellingPrice
        );


    const productId =
        escapeHTML(
            product.id
        );


    return `

        <article
            class="menu-card"
            data-product-id="${productId}">

            <button
                type="button"
                class="menu-image"
                onclick="openProductModal('${productId}')"
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
                        onclick="event.stopPropagation(); openProductModal('${productId}')">

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
        event => {

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


            const productId =
                card.dataset.productId;


            if(productId){

                openProductModal(
                    productId
                );

            }

        }
    );

}


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
            () => {

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
            () => {

                if(input){

                    input.value = "";

                }


                menuSearchValue =
                    "";


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
   SEARCH FUNCTION
========================================================== */

function searchMenuProducts(
    value
){

    menuSearchValue =
        String(
            value || ""
        );


    renderMenuProducts();

}


/* ==========================================================
   RESULT COUNT
========================================================== */

function updateMenuResultCount(
    count = null
){

    const element =
        document.getElementById(
            "menu-result-count"
        );


    if(!element){

        return;

    }


    if(count === null){

        let products =
            getFilteredMenuProducts();


        if(menuSearchValue.trim()){

            const search =
                menuSearchValue
                .trim()
                .toLowerCase();


            products =
                products.filter(
                    product =>
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


        count =
            products.length;

    }


    element.innerHTML = `

        <i class="fa-solid fa-utensils"></i>

        <span>
            ${count} ${count === 1 ? "item" : "items"}
        </span>

    `;

}


/* ==========================================================
   EMPTY STATE
========================================================== */

function showMenuEmpty(
    isSearch = false
){

    const container =
        document.getElementById(
            "menu-products"
        );


    if(!container){

        return;

    }


    const message =
        isSearch
        ? "Try another search."
        : "There are currently no available items in this category.";


    container.innerHTML = `

        <div class="menu-empty">

            <div class="menu-empty-icon">

                <i class="fa-solid ${
                    isSearch
                    ? "fa-magnifying-glass"
                    : "fa-utensils"
                }"></i>

            </div>

            <h3>

                ${
                    isSearch
                    ? "No matching products"
                    : "No products found"
                }

            </h3>

            <p>

                ${message}

            </p>

            <button
                type="button"
                class="reset-menu-btn"
                onclick="resetMenuFilters()">

                <i class="fa-solid fa-rotate-left"></i>

                View All

            </button>

        </div>

    `;

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
   RESET FILTERS
========================================================== */

function resetMenuFilters(){

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


    const clear =
        document.getElementById(
            "clearMenuSearch"
        );


    if(clear){

        clear.classList.remove(
            "show"
        );

    }


    updateActiveCategoryButton();

    renderMenuProducts();

}
/* ==========================================================
   PART 4
   PRODUCT MODAL
========================================================== */


/* ==========================================================
   OPEN MODAL
========================================================== */

function openProductModal(
    productId
){

    const product =
        menuProducts.find(
            item =>
                String(item.id) ===
                String(productId)
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
        1;


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
            selectedQuantity;

    }


    updateModalTotal();


    if(modal){

        modal.classList.add(
            "active"
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

    }


    document.body.classList.remove(
        "product-modal-open"
    );


    selectedProduct =
        null;


    selectedQuantity =
        1;

}


/* ==========================================================
   UPDATE MODAL TOTAL
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
            "modalTotal"
        );


    const price =
        Number(
            selectedProduct.sellingPrice ||
            0
        );


    const calculatedTotal =
        price *
        selectedQuantity;


    if(quantity){

        quantity.textContent =
            selectedQuantity;

    }


    if(total){

        total.textContent =
            formatMenuPrice(
                calculatedTotal
            );

    }

}


/* ==========================================================
   DECREASE MODAL QTY
========================================================== */

function decreaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    if(
        selectedQuantity > 1
    ){

        selectedQuantity--;

    }


    updateModalTotal();

}


/* ==========================================================
   INCREASE MODAL QTY
========================================================== */

function increaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    selectedQuantity++;

    updateModalTotal();

}


/* ==========================================================
   ADD SELECTED PRODUCT
========================================================== */

function addSelectedProductToCart(){

    if(!selectedProduct){

        return;

    }


    addProductToCart(
        selectedProduct,
        selectedQuantity
    );


    showCartNotification(
        selectedProduct.name
    );


    closeProductModal();


    setTimeout(
        () => {

            openCart();

        },
        200
    );

}


/* ==========================================================
   MODAL EVENTS
========================================================== */

function initializeProductModalEvents(){

    const closeButton =
        document.getElementById(
            "closeProductModal"
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


    const modal =
        document.getElementById(
            "productModal"
        );


    if(closeButton){

        closeButton.addEventListener(
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


    if(modal){

        modal.addEventListener(
            "click",
            event => {

                if(
                    event.target === modal
                ){

                    closeProductModal();

                }

            }
        );

    }

}


/* ==========================================================
   MODAL ESCAPE
========================================================== */

function initializeModalKeyboard(){

    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Escape"
            ){

                closeProductModal();

            }

        }
    );

}
/* ==========================================================
   PART 5
   CART ENGINE
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
                item =>
                    item &&
                    item.id
            )
            .map(
                item => ({

                    id:
                        item.id,

                    name:
                        item.name ||
                        "Product",

                    categoryName:
                        item.categoryName ||
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

                })
            );

    }catch(error){

        console.error(
            "Cart load error:",
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
            "Cart save error:",
            error
        );

    }

}


/* ==========================================================
   CART QUANTITY
========================================================== */

function getCartQuantity(){

    return menuCart.reduce(
        (
            total,
            item
        ) => {

            return total +
                Number(
                    item.quantity || 0
                );

        },
        0
    );

}


/* ==========================================================
   CART SUBTOTAL
========================================================== */

function getCartSubtotal(){

    return menuCart.reduce(
        (
            total,
            item
        ) => {

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
   CART TOTALS
========================================================== */

function getCartTotals(){

    const subtotal =
        getCartSubtotal();


    const delivery =
        0;


    return {

        quantity:
            getCartQuantity(),

        subtotal:
            subtotal,

        delivery:
            delivery,

        total:
            subtotal +
            delivery

    };

}


/* ==========================================================
   FIND ITEM
========================================================== */

function findCartItem(
    productId
){

    return menuCart.find(
        item =>
            String(item.id) ===
            String(productId)
    );

}


/* ==========================================================
   ADD PRODUCT
========================================================== */

function addProductToCart(
    product,
    quantity = 1
){

    if(!product){

        return;

    }


    const id =
        String(
            product.id
        );


    const addQuantity =
        Math.max(
            1,
            Math.floor(
                Number(quantity)
            )
        );


    const existing =
        findCartItem(
            id
        );


    if(existing){

        existing.quantity +=
            addQuantity;

    }else{

        menuCart.push({

            id:
                product.id,

            name:
                product.name ||
                "Product",

            categoryName:
                product.categoryName ||
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
                addQuantity

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
        ) + 1;


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
            item.quantity
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
            item =>
                String(item.id) !==
                String(productId)
        );


    saveCart();

    updateCartUI();

}


/* ==========================================================
   CLEAR CART
========================================================== */

function clearCart(){

    menuCart = [];

    saveCart();

    updateCartUI();

}


/* ==========================================================
   VALIDATE CART
========================================================== */

function validateCart(){

    menuCart =
        menuCart.filter(
            item =>
                item &&
                item.id &&
                Number(
                    item.quantity || 0
                ) > 0
        );


    saveCart();

}
/* ==========================================================
   PART 6
   CART RENDERING
========================================================== */


/* ==========================================================
   RENDER CART
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


        return;

    }


    if(empty){

        empty.style.display =
            "none";

    }


    container.innerHTML = "";


    menuCart.forEach(
        item => {

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
   CREATE CART ITEM
========================================================== */

function createCartItemHTML(
    item
){

    const image =
        escapeHTML(
            getMenuProductImage(
                item
            )
        );


    const name =
        escapeHTML(
            item.name ||
            "Product"
        );


    const id =
        escapeHTML(
            item.id
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


    const itemTotal =
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
                            onclick="decreaseCartItem('${id}')"
                            aria-label="Decrease quantity">

                            <i class="fa-solid fa-minus"></i>

                        </button>


                        <span class="cart-item-qty">

                            ${quantity}

                        </span>


                        <button
                            type="button"
                            class="cart-quantity-btn"
                            onclick="increaseCartItem('${id}')"
                            aria-label="Increase quantity">

                            <i class="fa-solid fa-plus"></i>

                        </button>

                    </div>


                    <div class="cart-item-total">

                        ${formatMenuPrice(itemTotal)}

                    </div>

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

    validateCart();


    const totals =
        getCartTotals();


    /* ======================================================
       BADGES
    ====================================================== */

    document
        .querySelectorAll(
            ".cart-count"
        )
        .forEach(
            badge => {

                badge.textContent =
                    totals.quantity;

                badge.classList.toggle(
                    "show",
                    totals.quantity > 0
                );

            }
        );


    /* ======================================================
       FLOATING TOTAL
    ====================================================== */

    const floatingTotal =
        document.getElementById(
            "cartTotal"
        );


    if(floatingTotal){

        floatingTotal.textContent =
            formatMenuPrice(
                totals.total
            );

    }


    /* ======================================================
       SUBTOTAL
    ====================================================== */

    const subtotal =
        document.getElementById(
            "cartSubtotal"
        );


    if(subtotal){

        subtotal.textContent =
            formatMenuPrice(
                totals.subtotal
            );

    }


    /* ======================================================
       DELIVERY
    ====================================================== */

    const delivery =
        document.getElementById(
            "cartDelivery"
        );


    if(delivery){

        delivery.textContent =
            formatMenuPrice(
                totals.delivery
            );

    }


    /* ======================================================
       GRAND TOTAL
    ====================================================== */

    const grandTotal =
        document.getElementById(
            "cartGrandTotal"
        );


    if(grandTotal){

        grandTotal.textContent =
            formatMenuPrice(
                totals.total
            );

    }


    /* ======================================================
       CHECKOUT TOTAL
    ====================================================== */

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );


    if(checkoutTotal){

        checkoutTotal.textContent =
            formatMenuPrice(
                totals.total
            );

    }


    /* ======================================================
       ITEM COUNT TEXT
    ====================================================== */

    document
        .querySelectorAll(
            ".cart-total-quantity"
        )
        .forEach(
            element => {

                element.textContent =
                    totals.quantity;

            }
        );


    /* ======================================================
       CART ITEMS
    ====================================================== */

    renderCartItems();


    /* ======================================================
       CHECKOUT BUTTON
    ====================================================== */

    const checkout =
        document.getElementById(
            "checkoutBtn"
        );


    if(checkout){

        checkout.disabled =
            totals.quantity === 0;

    }

}


/* ==========================================================
   CART NOTIFICATION
========================================================== */

function showCartNotification(
    productName
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
            ${escapeHTML(productName)}
            added to cart
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
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}
/* ==========================================================
   PART 7
   CART DRAWER
========================================================== */


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
   TOGGLE CART
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

function initializeCartDrawerEvents(){

    const viewCart =
        document.getElementById(
            "viewCartBtn"
        );


    const closeCartButton =
        document.getElementById(
            "closeCartBtn"
        );


    const overlay =
        document.getElementById(
            "cartOverlay"
        );


    if(viewCart){

        viewCart.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openCart();

            }
        );

    }


    if(closeCartButton){

        closeCartButton.addEventListener(
            "click",
            event => {

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

}


/* ==========================================================
   CART KEYBOARD
========================================================== */

function initializeCartKeyboard(){

    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Escape"
            ){

                closeCart();

            }

        }
    );

}


/* ==========================================================
   BODY SCROLL LOCK
========================================================== */

function updateBodyScrollLock(){

    const modal =
        document.getElementById(
            "productModal"
        );


    const cart =
        document.getElementById(
            "cartDrawer"
        );


    const modalOpen =
        modal &&
        modal.classList.contains(
            "active"
        );


    const cartOpen =
        cart &&
        cart.classList.contains(
            "active"
        );


    document.body.classList.toggle(
        "product-modal-open",
        !!modalOpen
    );


    document.body.classList.toggle(
        "cart-open",
        !!cartOpen
    );

}
/* ==========================================================
   PART 8
   CHECKOUT + GLOBAL EVENTS
========================================================== */


/* ==========================================================
   CHECKOUT
========================================================== */

function proceedToCheckout(){

    if(
        menuCart.length === 0
    ){

        showCartNotification(
            "Your cart is empty"
        );

        return;

    }


    /*
     * TEMPORARY CHECKOUT
     *
     * The actual checkout/payment system
     * can be connected later.
     */


    console.log(
        "PAPPRITO CHECKOUT:",
        menuCart
    );


    showCartNotification(
        "Checkout system coming soon"
    );

}


/* ==========================================================
   CHECKOUT EVENT
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
        event => {

            event.preventDefault();

            proceedToCheckout();

        }
    );

}


/* ==========================================================
   RESET BUTTON
========================================================== */

function initializeResetButton(){

    const button =
        document.getElementById(
            "resetMenuBtn"
        );


    if(button){

        button.addEventListener(
            "click",
            resetMenuFilters
        );

    }

}


/* ==========================================================
   IMAGE FALLBACK
========================================================== */

document.addEventListener(
    "error",
    event => {

        const target =
            event.target;


        if(
            !target ||
            target.tagName !== "IMG"
        ){

            return;

        }


        if(
            target.dataset.fallbackApplied
        ){

            return;

        }


        target.dataset.fallbackApplied =
            "true";


        target.src =
            MENU_DEFAULT_IMAGE;

    },
    true
);


/* ==========================================================
   STORAGE SYNC
========================================================== */

window.addEventListener(
    "storage",
    event => {

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
   PAGE VISIBILITY
========================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if(
            document.visibilityState ===
            "visible"
        ){

            loadCart();

            updateCartUI();

        }

    }
);


/* ==========================================================
   BEFORE UNLOAD
========================================================== */

window.addEventListener(
    "beforeunload",
    () => {

        saveCart();

    }
);


/* ==========================================================
   UPDATE SCROLL LOCK
========================================================== */

document.addEventListener(
    "click",
    () => {

        setTimeout(
            updateBodyScrollLock,
            0
        );

    }
);


/* ==========================================================
   GLOBAL CART BUTTONS
========================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-open-cart]"
            );


        if(!button){

            return;

        }


        event.preventDefault();

        openCart();

    }
);


/* ==========================================================
   GLOBAL CLOSE CART
========================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-close-cart]"
            );


        if(!button){

            return;

        }


        event.preventDefault();

        closeCart();

    }
);


/* ==========================================================
   INITIALIZE ALL EVENTS
========================================================== */

function initializeMenuEvents(){

    initializeCategoryEvents();

    initializeCategoryScroll();

    initializeProductEvents();

    initializeMenuSearch();

    initializeProductModalEvents();

    initializeModalKeyboard();

    initializeCartDrawerEvents();

    initializeCartKeyboard();

    initializeCheckout();

    initializeResetButton();

}


/* ==========================================================
   REFRESH MENU
========================================================== */

async function refreshMenu(){

    try{

        showMenuLoading();


        await loadMenuCategories();


        await loadMenuProducts();


        loadCart();


        updateCartUI();


        updateActiveCategoryButton();


        updateMenuResultCount();


    }catch(error){

        console.error(
            "Menu refresh error:",
            error
        );


        showMenuError();

    }

}


/* ==========================================================
   REFRESH CART
========================================================== */

function refreshCart(){

    loadCart();

    updateCartUI();

}
/* ==========================================================
   PART 8
   CHECKOUT + GLOBAL EVENTS
========================================================== */


/* ==========================================================
   CHECKOUT
========================================================== */

function proceedToCheckout(){

    if(
        menuCart.length === 0
    ){

        showCartNotification(
            "Your cart is empty"
        );

        return;

    }


    /*
     * TEMPORARY CHECKOUT
     *
     * The actual checkout/payment system
     * can be connected later.
     */


    console.log(
        "PAPPRITO CHECKOUT:",
        menuCart
    );


    showCartNotification(
        "Checkout system coming soon"
    );

}


/* ==========================================================
   CHECKOUT EVENT
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
        event => {

            event.preventDefault();

            proceedToCheckout();

        }
    );

}


/* ==========================================================
   RESET BUTTON
========================================================== */

function initializeResetButton(){

    const button =
        document.getElementById(
            "resetMenuBtn"
        );


    if(button){

        button.addEventListener(
            "click",
            resetMenuFilters
        );

    }

}


/* ==========================================================
   IMAGE FALLBACK
========================================================== */

document.addEventListener(
    "error",
    event => {

        const target =
            event.target;


        if(
            !target ||
            target.tagName !== "IMG"
        ){

            return;

        }


        if(
            target.dataset.fallbackApplied
        ){

            return;

        }


        target.dataset.fallbackApplied =
            "true";


        target.src =
            MENU_DEFAULT_IMAGE;

    },
    true
);


/* ==========================================================
   STORAGE SYNC
========================================================== */

window.addEventListener(
    "storage",
    event => {

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
   PAGE VISIBILITY
========================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if(
            document.visibilityState ===
            "visible"
        ){

            loadCart();

            updateCartUI();

        }

    }
);


/* ==========================================================
   BEFORE UNLOAD
========================================================== */

window.addEventListener(
    "beforeunload",
    () => {

        saveCart();

    }
);


/* ==========================================================
   UPDATE SCROLL LOCK
========================================================== */

document.addEventListener(
    "click",
    () => {

        setTimeout(
            updateBodyScrollLock,
            0
        );

    }
);


/* ==========================================================
   GLOBAL CART BUTTONS
========================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-open-cart]"
            );


        if(!button){

            return;

        }


        event.preventDefault();

        openCart();

    }
);


/* ==========================================================
   GLOBAL CLOSE CART
========================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-close-cart]"
            );


        if(!button){

            return;

        }


        event.preventDefault();

        closeCart();

    }
);


/* ==========================================================
   INITIALIZE ALL EVENTS
========================================================== */

function initializeMenuEvents(){

    initializeCategoryEvents();

    initializeCategoryScroll();

    initializeProductEvents();

    initializeMenuSearch();

    initializeProductModalEvents();

    initializeModalKeyboard();

    initializeCartDrawerEvents();

    initializeCartKeyboard();

    initializeCheckout();

    initializeResetButton();

}


/* ==========================================================
   REFRESH MENU
========================================================== */

async function refreshMenu(){

    try{

        showMenuLoading();


        await loadMenuCategories();


        await loadMenuProducts();


        loadCart();


        updateCartUI();


        updateActiveCategoryButton();


        updateMenuResultCount();


    }catch(error){

        console.error(
            "Menu refresh error:",
            error
        );


        showMenuError();

    }

}


/* ==========================================================
   REFRESH CART
========================================================== */

function refreshCart(){

    loadCart();

    updateCartUI();

}
