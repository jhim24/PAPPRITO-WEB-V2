/* ==========================================================
   PAPPRITO WEBSITE V8
   FILE        : menu.js
   DESCRIPTION : Foodpanda-Style Menu System
   VERSION     : 8.0.0

   PART 1
   CORE + FIREBASE + INITIALIZATION
========================================================== */


/* ==========================================================
   GLOBAL DATA
========================================================== */

let menuCategories = [];

let menuProducts = [];

let selectedCategory = "all";

let menuSearchValue = "";

let selectedProduct = null;

let selectedQuantity = 1;

let menuCart = [];

let menuInitialized = false;


/* ==========================================================
   STORAGE
========================================================== */

const MENU_CART_STORAGE =
    "pappritoMenuCart";


/* ==========================================================
   DEFAULT IMAGE
========================================================== */

const MENU_DEFAULT_IMAGE =
    "../assets/images/no-product.png";


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        waitForFirebase();

    }
);


/* ==========================================================
   WAIT FOR FIREBASE
========================================================== */

function waitForFirebase(){

    if(
        typeof db !== "undefined"
    ){

        initializeMenu();

        return;

    }


    let attempts = 0;


    const firebaseTimer =
        setInterval(
            function(){

                attempts++;


                if(
                    typeof db !== "undefined"
                ){

                    clearInterval(
                        firebaseTimer
                    );

                    initializeMenu();

                    return;

                }


                if(
                    attempts >= 50
                ){

                    clearInterval(
                        firebaseTimer
                    );

                    console.error(
                        "PAPPRITO MENU: Firebase database not available."
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
            "PAPPRITO MENU V8 INITIALIZED"
        );


    }catch(error){

        console.error(
            "PAPPRITO MENU INITIALIZATION ERROR:",
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
        function(child){

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
        function(child){

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
   PRODUCT IMAGE
========================================================== */

function getProductImage(
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
   ESCAPE HTML
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
   LOADING STATE
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
   ERROR STATE
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
   FILE        : menu.js
   DESCRIPTION : Foodpanda-Style Menu System
   VERSION     : 8.0.0

   PART 1
   CORE + FIREBASE + INITIALIZATION
========================================================== */


/* ==========================================================
   GLOBAL DATA
========================================================== */

let menuCategories = [];

let menuProducts = [];

let selectedCategory = "all";

let menuSearchValue = "";

let selectedProduct = null;

let selectedQuantity = 1;

let menuCart = [];

let menuInitialized = false;


/* ==========================================================
   STORAGE
========================================================== */

const MENU_CART_STORAGE =
    "pappritoMenuCart";


/* ==========================================================
   DEFAULT IMAGE
========================================================== */

const MENU_DEFAULT_IMAGE =
    "../assets/images/no-product.png";


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        waitForFirebase();

    }
);


/* ==========================================================
   WAIT FOR FIREBASE
========================================================== */

function waitForFirebase(){

    if(
        typeof db !== "undefined"
    ){

        initializeMenu();

        return;

    }


    let attempts = 0;


    const firebaseTimer =
        setInterval(
            function(){

                attempts++;


                if(
                    typeof db !== "undefined"
                ){

                    clearInterval(
                        firebaseTimer
                    );

                    initializeMenu();

                    return;

                }


                if(
                    attempts >= 50
                ){

                    clearInterval(
                        firebaseTimer
                    );

                    console.error(
                        "PAPPRITO MENU: Firebase database not available."
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
            "PAPPRITO MENU V8 INITIALIZED"
        );


    }catch(error){

        console.error(
            "PAPPRITO MENU INITIALIZATION ERROR:",
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
        function(child){

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
        function(child){

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
   PRODUCT IMAGE
========================================================== */

function getProductImage(
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
   ESCAPE HTML
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
   LOADING STATE
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
   ERROR STATE
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
   PART 2
   CATEGORY SYSTEM
========================================================== */


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


    /* ======================================================
       ALL CATEGORY
    ====================================================== */

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

    allButton.textContent =
        "All";


    wrapper.appendChild(
        allButton
    );


    /* ======================================================
       FIREBASE CATEGORIES
    ====================================================== */

    menuCategories.forEach(
        function(category){

            const categoryName =
                String(
                    category.name || ""
                ).trim();


            if(!categoryName){

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
                categoryName;

            button.textContent =
                categoryName;


            wrapper.appendChild(
                button
            );

        }
    );


    updateActiveCategory();

}


/* ==========================================================
   CATEGORY CLICK
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


            const category =
                button.dataset.category;


            if(!category){

                return;

            }


            selectedCategory =
                category;


            updateActiveCategory();


            renderMenuProducts();


            updateMenuResultCount();


            scrollToProducts();

        }
    );

}


/* ==========================================================
   ACTIVE CATEGORY
========================================================== */

function updateActiveCategory(){

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(
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
   FILTER CATEGORY
========================================================== */

function getCategoryProducts(){

    if(
        selectedCategory === "all"
    ){

        return [
            ...menuProducts
        ];

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
   CATEGORY SCROLL LEFT
========================================================== */

function scrollCategoriesLeft(){

    const wrapper =
        document.getElementById(
            "menu-category-wrapper"
        );


    if(!wrapper){

        return;

    }


    wrapper.scrollBy({

        left:-280,

        behavior:"smooth"

    });

}


/* ==========================================================
   CATEGORY SCROLL RIGHT
========================================================== */

function scrollCategoriesRight(){

    const wrapper =
        document.getElementById(
            "menu-category-wrapper"
        );


    if(!wrapper){

        return;

    }


    wrapper.scrollBy({

        left:280,

        behavior:"smooth"

    });

}


/* ==========================================================
   CATEGORY SCROLL BUTTONS
========================================================== */

function initializeCategoryScroll(){

    const leftButton =
        document.getElementById(
            "categoryScrollLeft"
        );


    const rightButton =
        document.getElementById(
            "categoryScrollRight"
        );


    if(leftButton){

        leftButton.addEventListener(
            "click",
            scrollCategoriesLeft
        );

    }


    if(rightButton){

        rightButton.addEventListener(
            "click",
            scrollCategoriesRight
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
        100;


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
   PART 4
   PRODUCT MODAL
========================================================== */


/* ==========================================================
   OPEN PRODUCT MODAL
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
            getProductImage(
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
        1;

}


/* ==========================================================
   MODAL TOTAL
========================================================== */

function updateModalTotal(){

    if(!selectedProduct){

        return;

    }


    const totalElement =
        document.getElementById(
            "modalTotalPrice"
        );


    const quantityElement =
        document.getElementById(
            "modalQty"
        );


    const price =
        Number(
            selectedProduct.sellingPrice ||
            0
        );


    const total =
        price *
        selectedQuantity;


    if(quantityElement){

        quantityElement.textContent =
            selectedQuantity;

    }


    if(totalElement){

        totalElement.textContent =
            formatMenuPrice(
                total
            );

    }

}


/* ==========================================================
   DECREASE MODAL QUANTITY
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
   INCREASE MODAL QUANTITY
========================================================== */

function increaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    selectedQuantity++;


    updateModalTotal();

}


/* ==========================================================
   ADD MODAL PRODUCT
========================================================== */

function addModalProductToCart(){

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

function initializeModalEvents(){

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
            addModalProductToCart
        );

    }

}


/* ==========================================================
   MODAL KEYBOARD
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
            parsed.filter(
                function(item){

                    return (
                        item &&
                        item.id &&
                        Number(
                            item.quantity
                        ) > 0
                    );

                }
            );


    }catch(error){

        console.error(
            "PAPPRITO CART LOAD ERROR:",
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
            "PAPPRITO CART SAVE ERROR:",
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
            Number(
                quantity || 1
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
            ) +
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
   INCREASE CART ITEM
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
   DECREASE CART ITEM
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
   REMOVE ITEM
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
   CLEAR CART
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
   CART SUBTOTAL
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
   CART TOTAL
========================================================== */

function getCartTotal(){

    return getCartSubtotal();

}


/* ==========================================================
   CART DATA CLEANUP
========================================================== */

function validateCart(){

    menuCart =
        menuCart.filter(
            function(item){

                return (
                    item &&
                    item.id &&
                    Number(
                        item.quantity || 0
                    ) > 0
                );

            }
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

function renderCart(){

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
        function(item){

            container.insertAdjacentHTML(
                "beforeend",
                createCartItem(
                    item
                )
            );

        }
    );

}


/* ==========================================================
   CART ITEM HTML
========================================================== */

function createCartItem(
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
            getProductImage(
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

    validateCart();


    const quantity =
        getCartQuantity();


    const subtotal =
        getCartSubtotal();


    const total =
        getCartTotal();


    /* ======================================================
       CART COUNT
    ====================================================== */

    const count =
        document.getElementById(
            "cartCount"
        );


    if(count){

        count.textContent =
            quantity;

        count.classList.toggle(
            "show",
            quantity > 0
        );

    }


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
                total
            );

    }


    /* ======================================================
       SUBTOTAL
    ====================================================== */

    const subtotalElement =
        document.getElementById(
            "cartSubtotal"
        );


    if(subtotalElement){

        subtotalElement.textContent =
            formatMenuPrice(
                subtotal
            );

    }


    /* ======================================================
       DELIVERY
    ====================================================== */

    const deliveryElement =
        document.getElementById(
            "cartDelivery"
        );


    if(deliveryElement){

        deliveryElement.textContent =
            "₱0.00";

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
                total
            );

    }


    /* ======================================================
       RENDER ITEMS
    ====================================================== */

    renderCart();


    /* ======================================================
       CHECKOUT
    ====================================================== */

    const checkout =
        document.getElementById(
            "checkoutBtn"
        );


    if(checkout){

        checkout.disabled =
            quantity === 0;

    }

}


/* ==========================================================
   CART TOAST
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
        toast.menuTimer
    );


    toast.menuTimer =
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

function initializeCartEvents(){

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


    const startOrdering =
        document.getElementById(
            "startOrderingBtn"
        );


    if(viewCart){

        viewCart.addEventListener(
            "click",
            function(event){

                event.preventDefault();

                openCart();

            }
        );

    }


    if(closeCartButton){

        closeCartButton.addEventListener(
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
   CART ESCAPE
========================================================== */

function initializeCartKeyboard(){

    document.addEventListener(
        "keydown",
        function(event){

            if(
                event.key === "Escape"
            ){

                closeCart();

            }

        }
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

function initializeCartEvents(){

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


    const startOrdering =
        document.getElementById(
            "startOrderingBtn"
        );


    if(viewCart){

        viewCart.addEventListener(
            "click",
            function(event){

                event.preventDefault();

                openCart();

            }
        );

    }


    if(closeCartButton){

        closeCartButton.addEventListener(
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
   CART ESCAPE
========================================================== */

function initializeCartKeyboard(){

    document.addEventListener(
        "keydown",
        function(event){

            if(
                event.key === "Escape"
            ){

                closeCart();

            }

        }
    );

}
