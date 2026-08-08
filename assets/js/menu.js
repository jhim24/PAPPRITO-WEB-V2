/* ==========================================================
   PAPPRITO WEBSITE V6
   MENU MODULE
   STEP 3 — PART 1
   File : menu.js

   FEATURES
   - Firebase Products
   - Firebase Categories
   - Active Categories
   - Product Loading
   - Category Filtering
   - Safe Rendering
========================================================== */


/* ==========================================================
   GLOBAL DATA
========================================================== */

let menuCategories = [];

let menuProducts = [];

let selectedCategory = "all";


/* ==========================================================
   DEFAULT IMAGE
========================================================== */

const MENU_DEFAULT_IMAGE =
    "../assets/images/no-product.png";


/* ==========================================================
   START MENU
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeMenu();

    }
);


/* ==========================================================
   INITIALIZE MENU
========================================================== */

async function initializeMenu(){

    try{

        showMenuLoading();

        await loadMenuCategories();

        await loadMenuProducts();

    }catch(error){

        console.error(
            "Menu initialization error:",
            error
        );

        showMenuError();

    }

}


/* ==========================================================
   LOAD CATEGORIES
========================================================== */

async function loadMenuCategories(){

    if(typeof db === "undefined"){

        throw new Error(
            "Firebase database 'db' is not available."
        );

    }

    const snapshot = await db
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
   RENDER CATEGORIES
========================================================== */

function renderMenuCategories(){

    const wrapper =
        document.getElementById(
            "menu-category-wrapper"
        );


    if(!wrapper){

        console.warn(
            "menu-category-wrapper not found."
        );

        return;

    }


    wrapper.innerHTML = "";


    /* ======================================================
       ALL CATEGORY
    ====================================================== */

    wrapper.insertAdjacentHTML(
        "beforeend",
        `
        <button
            type="button"
            class="category-btn active"
            data-category="all">

            <i class="fa-solid fa-border-all"></i>

            All

        </button>
        `
    );


    /* ======================================================
       DATABASE CATEGORIES
    ====================================================== */

    menuCategories.forEach(
        category => {

            if(!category.name){

                return;

            }


            wrapper.insertAdjacentHTML(
                "beforeend",
                `
                <button
                    type="button"
                    class="category-btn"
                    data-category="${escapeHTML(
                        category.name
                    )}">

                    ${escapeHTML(
                        category.name
                    )}

                </button>
                `
            );

        }
    );


    attachCategoryEvents();

}


/* ==========================================================
   CATEGORY EVENTS
========================================================== */

function attachCategoryEvents(){

    const buttons =
        document.querySelectorAll(
            "#menu-category-wrapper .category-btn"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        btn => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedCategory =
                        button.dataset.category
                        || "all";


                    renderMenuProducts();


                    /* ======================================
                       MOBILE AUTO CENTER ACTIVE CATEGORY
                    ====================================== */

                    button.scrollIntoView({

                        behavior:"smooth",

                        block:"nearest",

                        inline:"center"

                    });

                }
            );

        }
    );

}


/* ==========================================================
   LOAD PRODUCTS
========================================================== */

async function loadMenuProducts(){

    if(typeof db === "undefined"){

        throw new Error(
            "Firebase database 'db' is not available."
        );

    }


    const snapshot = await db
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
   FILTER PRODUCTS
========================================================== */

function getFilteredMenuProducts(){

    if(
        selectedCategory === "all"
    ){

        return menuProducts;

    }


    return menuProducts.filter(
        product => {

            return (
                product.categoryName
                === selectedCategory
            );

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

        console.warn(
            "menu-products not found."
        );

        return;

    }


    const filteredProducts =
        getFilteredMenuProducts();


    container.innerHTML = "";


    /* ======================================================
       EMPTY
    ====================================================== */

    if(
        filteredProducts.length === 0
    ){

        container.innerHTML = `

            <div class="menu-empty">

                <i class="fa-solid fa-utensils"></i>

                <h3>
                    No dishes available
                </h3>

                <p>
                    There are currently no available
                    products in this category.
                </p>

            </div>

        `;

        return;

    }


    /* ======================================================
       PRODUCTS
    ====================================================== */

    filteredProducts.forEach(
        product => {

            container.insertAdjacentHTML(
                "beforeend",
                createMenuProductCard(
                    product
                )
            );

        }
    );

}


/* ==========================================================
   CREATE PRODUCT CARD
========================================================== */

function createMenuProductCard(product){

    const image =
        product.image &&
        product.image.trim() !== ""
            ? product.image
            : MENU_DEFAULT_IMAGE;


    const name =
        product.name ||
        "Untitled Product";


    const category =
        product.categoryName ||
        "Menu";


    const description =
        product.description ||
        "Freshly prepared with quality ingredients.";


    const price =
        Number(
            product.sellingPrice || 0
        );


    return `

        <article
            class="menu-card"
            data-product-id="${escapeHTML(
                product.id
            )}">

            <div class="menu-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    loading="lazy"
                    onerror="this.onerror=null;this.src='${MENU_DEFAULT_IMAGE}'">

            </div>


            <div class="menu-card-body">

                <span class="menu-category">

                    ${escapeHTML(category)}

                </span>


                <h3>

                    ${escapeHTML(name)}

                </h3>


                <p>

                    ${escapeHTML(description)}

                </p>


                <div class="menu-footer">

                    <div class="menu-price">

                        ₱${price.toFixed(2)}

                    </div>


                    <button
                        type="button"
                        class="menu-order-btn"
                        data-product-id="${escapeHTML(
                            product.id
                        )}">

                        <i class="fa-solid fa-plus"></i>

                        Add

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* ==========================================================
   PRODUCT CARD EVENTS
========================================================== */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".menu-order-btn"
            );


        if(button){

            event.preventDefault();

            event.stopPropagation();


            const productId =
                button.dataset.productId;


            if(
                typeof openProductModal
                === "function"
            ){

                openProductModal(
                    productId
                );

            }

            return;

        }


        const card =
            event.target.closest(
                ".menu-card"
            );


        if(
            card &&
            !event.target.closest(
                "button"
            )
        ){

            const productId =
                card.dataset.productId;


            if(
                typeof openProductModal
                === "function"
            ){

                openProductModal(
                    productId
                );

            }

        }

    }
);


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

            Loading menu...

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

            <i class="fa-solid fa-triangle-exclamation"></i>

            <h3>
                Menu temporarily unavailable
            </h3>

            <p>
                Please try refreshing the page.
            </p>

        </div>

    `;

}


/* ==========================================================
   ESCAPE HTML
========================================================== */

function escapeHTML(value){

    return String(value ?? "")
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
   PAPPRITO WEBSITE V6
   MENU MODULE
   STEP 3 — PART 2
   PRODUCT MODAL + QUANTITY + ADD TO CART
========================================================== */


/* ==========================================================
   MODAL DATA
========================================================== */

let selectedProduct = null;

let selectedQuantity = 1;


/* ==========================================================
   OPEN PRODUCT MODAL
========================================================== */

function openProductModal(productId){

    const product =
        menuProducts.find(
            item => item.id === productId
        );


    if(!product){

        console.warn(
            "Product not found:",
            productId
        );

        return;

    }


    selectedProduct = product;

    selectedQuantity = 1;


    /* ======================================================
       MODAL ELEMENTS
    ====================================================== */

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


    if(!modal){

        console.warn(
            "productModal not found."
        );

        return;

    }


    /* ======================================================
       PRODUCT DATA
    ====================================================== */

    const productImage =
        product.image &&
        product.image.trim() !== ""
            ? product.image
            : MENU_DEFAULT_IMAGE;


    const productPrice =
        Number(
            product.sellingPrice || 0
        );


    image.src =
        productImage;

    image.alt =
        product.name || "Product";


    image.onerror = function(){

        this.onerror = null;

        this.src =
            MENU_DEFAULT_IMAGE;

    };


    category.textContent =
        product.categoryName || "Menu";


    name.textContent =
        product.name || "Product";


    description.textContent =
        product.description ||
        "Freshly prepared with quality ingredients.";


    price.textContent =
        "₱" +
        productPrice.toFixed(2);


    /* ======================================================
       UPDATE QUANTITY UI
    ====================================================== */

    updateModalQuantity();


    /* ======================================================
       SHOW MODAL
    ====================================================== */

    modal.classList.add(
        "active"
    );


    document.body.classList.add(
        "menu-modal-open"
    );


    /* ======================================================
       ACCESSIBILITY
    ====================================================== */

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* ==========================================================
   CLOSE PRODUCT MODAL
========================================================== */

function closeProductModal(){

    const modal =
        document.getElementById(
            "productModal"
        );


    if(!modal){

        return;

    }


    modal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "menu-modal-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    selectedProduct = null;

    selectedQuantity = 1;

}


/* ==========================================================
   MODAL QUANTITY
========================================================== */

function updateModalQuantity(){

    const quantity =
        document.getElementById("modalQty");

    const total =
        document.getElementById("modalTotal");


    if(quantity){

        quantity.textContent =
            selectedQuantity;

    }


    if(total && selectedProduct){

        const price =
            Number(
                selectedProduct.sellingPrice || 0
            );


        total.textContent =
            "₱" +
            (
                price * selectedQuantity
            ).toFixed(2);

    }

}
/* ==========================================================
   INCREASE QUANTITY
========================================================== */

function increaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    selectedQuantity++;


    updateModalQuantity();

}


/* ==========================================================
   DECREASE QUANTITY
========================================================== */

function decreaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    if(selectedQuantity <= 1){

        return;

    }


    selectedQuantity--;


    updateModalQuantity();

}


/* ==========================================================
   ADD TO CART
========================================================== */

function addSelectedProductToCart(){

    if(!selectedProduct){

        return;

    }


    const quantity =
        selectedQuantity;


    /* ======================================================
       CHECK CART
    ====================================================== */

    if(
        typeof addToCart ===
        "function"
    ){

        addToCart(
            selectedProduct,
            quantity
        );

    }else{

        /*
         * Temporary fallback.
         * STEP 3 PART 3 will replace
         * this with the complete cart.
         */

        console.log(
            "Add to cart:",
            selectedProduct.name,
            quantity
        );

    }


    closeProductModal();

}


/* ==========================================================
   MODAL EVENTS
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const closeButton =
            document.getElementById(
                "closeProductModal"
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


        /* ==================================================
           QUANTITY MINUS
        ================================================== */

      const minusButton =
    document.getElementById(
        "modalQtyMinus"
    );

        if(minusButton){

            minusButton.addEventListener(
                "click",
                decreaseModalQuantity
            );

        }


        /* ==================================================
           QUANTITY PLUS
        ================================================== */

      const plusButton =
    document.getElementById(
        "modalQtyPlus"
    );

        if(plusButton){

            plusButton.addEventListener(
                "click",
                increaseModalQuantity
            );

        }


        /* ==================================================
           ADD TO CART BUTTON
        ================================================== */

      const addButton =
    document.getElementById(
        "modalOrderBtn"
    );

        if(addButton){

            addButton.addEventListener(
                "click",
                addSelectedProductToCart
            );

        }


        /* ==================================================
           ESCAPE KEY
        ================================================== */

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
);
/* ==========================================================
   PAPPRITO WEBSITE V6
   MENU MODULE
   STEP 3 — PART 3
   FOODPANDA-STYLE CART SYSTEM
========================================================== */


/* ==========================================================
   CART DATA
========================================================== */

let menuCart = [];


/* ==========================================================
   CART STORAGE KEY
========================================================== */

const MENU_CART_STORAGE =
    "pappritoMenuCart";


/* ==========================================================
   LOAD CART FROM LOCAL STORAGE
========================================================== */

function loadCart(){

    try{

        const savedCart =
            localStorage.getItem(
                MENU_CART_STORAGE
            );


        if(savedCart){

            const parsedCart =
                JSON.parse(savedCart);


            if(Array.isArray(parsedCart)){

                menuCart =
                    parsedCart;

            }

        }

    }catch(error){

        console.error(
            "Unable to load cart:",
            error
        );

        menuCart = [];

    }


    updateCartUI();

}


/* ==========================================================
   SAVE CART
========================================================== */

function saveCart(){

    try{

        localStorage.setItem(
            MENU_CART_STORAGE,
            JSON.stringify(menuCart)
        );

    }catch(error){

        console.error(
            "Unable to save cart:",
            error
        );

    }

}


/* ==========================================================
   ADD TO CART
========================================================== */

function addToCart(
    product,
    quantity = 1
){

    if(!product){

        return;

    }


    quantity =
        Math.max(
            1,
            Number(quantity) || 1
        );


    const existingItem =
        menuCart.find(
            item =>
                item.id === product.id
        );


    if(existingItem){

        existingItem.quantity +=
            quantity;

    }else{

        menuCart.push({

            id:
                product.id,

            name:
                product.name || "Product",

            categoryName:
                product.categoryName || "Menu",

            description:
                product.description || "",

            image:
                product.image ||
                MENU_DEFAULT_IMAGE,

            price:
                Number(
                    product.sellingPrice || 0
                ),

            quantity:
                quantity

        });

    }


    saveCart();

    updateCartUI();

    showCartAddedNotification(
        product.name,
        quantity
    );

}


/* ==========================================================
   REMOVE CART ITEM
========================================================== */

function removeFromCart(productId){

    menuCart =
        menuCart.filter(
            item =>
                item.id !== productId
        );


    saveCart();

    updateCartUI();

}


/* ==========================================================
   INCREASE CART ITEM
========================================================== */

function increaseCartItem(productId){

    const item =
        menuCart.find(
            product =>
                product.id === productId
        );


    if(!item){

        return;

    }


    item.quantity++;


    saveCart();

    updateCartUI();

}


/* ==========================================================
   DECREASE CART ITEM
========================================================== */

function decreaseCartItem(productId){

    const item =
        menuCart.find(
            product =>
                product.id === productId
        );


    if(!item){

        return;

    }


    if(item.quantity <= 1){

        removeFromCart(productId);

        return;

    }


    item.quantity--;


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
   CART TOTAL QUANTITY
========================================================== */

function getCartQuantity(){

    return menuCart.reduce(
        (total, item) => {

            return total +
                Number(item.quantity || 0);

        },
        0
    );

}


/* ==========================================================
   CART SUBTOTAL
========================================================== */

function getCartSubtotal(){

    return menuCart.reduce(
        (total, item) => {

            return total +
                (
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                );

        },
        0
    );

}


/* ==========================================================
   FORMAT PRICE
========================================================== */

function formatMenuPrice(amount){

    return "₱" +
        Number(amount || 0)
        .toLocaleString(
            "en-PH",
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        );

}


/* ==========================================================
   UPDATE CART UI
========================================================== */

function updateCartUI(){

    const quantity =
        getCartQuantity();

    const subtotal =
        getCartSubtotal();


    /* ======================================================
       CART COUNT
    ====================================================== */

    document
        .querySelectorAll(".cart-count")
        .forEach(badge => {

            badge.textContent =
                quantity;

            badge.classList.toggle(
                "show",
                quantity > 0
            );

        });


    /* ======================================================
       CART QUANTITY TEXT
    ====================================================== */

    document
        .querySelectorAll(".cart-total-quantity")
        .forEach(element => {

            element.textContent =
                quantity;

        });


    /* ======================================================
       CART SUBTOTAL
    ====================================================== */

    document
        .querySelectorAll(".cart-subtotal")
        .forEach(element => {

            element.textContent =
                formatMenuPrice(subtotal);

        });


    /* ======================================================
       FLOATING CART TOTAL
    ====================================================== */

    const cartTotal =
        document.getElementById("cartTotal");

    if(cartTotal){

        cartTotal.textContent =
            formatMenuPrice(subtotal);

    }


    /* ======================================================
       CART SUMMARY
    ====================================================== */

    const cartSubtotal =
        document.getElementById("cartSubtotal");

    if(cartSubtotal){

        cartSubtotal.textContent =
            formatMenuPrice(subtotal);

    }


    /* ======================================================
       DELIVERY
    ====================================================== */

    const cartDelivery =
        document.getElementById("cartDelivery");

    if(cartDelivery){

        cartDelivery.textContent =
            formatMenuPrice(0);

    }


    /* ======================================================
       GRAND TOTAL
    ====================================================== */

    const cartGrandTotal =
        document.getElementById("cartGrandTotal");

    if(cartGrandTotal){

        cartGrandTotal.textContent =
            formatMenuPrice(subtotal);

    }


    /* ======================================================
       CHECKOUT TOTAL
    ====================================================== */

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    if(checkoutTotal){

        checkoutTotal.textContent =
            formatMenuPrice(subtotal);

    }


    /* ======================================================
       RENDER ITEMS
    ====================================================== */

    renderCartItems();

}

    /* ======================================================
       EMPTY CART
    ====================================================== */

    if(menuCart.length === 0){

        container.innerHTML = "";

        if(emptyCart){

            emptyCart.style.display = "flex";

        }

        return;

    }


    /* ======================================================
       CART HAS ITEMS
    ====================================================== */

    if(emptyCart){

        emptyCart.style.display = "none";

    }


    container.innerHTML = "";


    menuCart.forEach(item => {

        container.insertAdjacentHTML(
            "beforeend",
            createCartItemHTML(item)
        );

    });

}

/* ==========================================================
   CREATE CART ITEM HTML
========================================================== */

function createCartItemHTML(item){

    const image =
        item.image &&
        item.image.trim() !== ""
            ? item.image
            : MENU_DEFAULT_IMAGE;


    const itemTotal =
        Number(item.price || 0) *
        Number(item.quantity || 0);


    return `

        <div
            class="cart-item"
            data-cart-id="${escapeHTML(
                item.id
            )}">

            <div class="cart-item-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(item.name)}"
                    onerror="this.onerror=null;this.src='${MENU_DEFAULT_IMAGE}'">

            </div>


            <div class="cart-item-details">

                <h4>

                    ${escapeHTML(
                        item.name
                    )}

                </h4>


                <span class="cart-item-price">

                    ${formatMenuPrice(
                        item.price
                    )}

                </span>


                <div class="cart-item-bottom">

                    <div class="cart-quantity">

                        <button
                            type="button"
                            class="cart-quantity-btn"
                            onclick="decreaseCartItem('${escapeHTML(item.id)}')">

                            <i class="fa-solid fa-minus"></i>

                        </button>


                        <span>

                            ${item.quantity}

                        </span>


                        <button
                            type="button"
                            class="cart-quantity-btn"
                            onclick="increaseCartItem('${escapeHTML(item.id)}')">

                            <i class="fa-solid fa-plus"></i>

                        </button>

                    </div>


                    <strong class="cart-item-total">

                        ${formatMenuPrice(
                            itemTotal
                        )}

                    </strong>

                </div>

            </div>


            <button
                type="button"
                class="cart-delete-btn"
                aria-label="Remove ${escapeHTML(item.name)}"
                onclick="removeFromCart('${escapeHTML(item.id)}')">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;

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


    drawer.classList.add(
        "active"
    );


    if(overlay){

        overlay.classList.add(
            "active"
        );

    }


    document.body.classList.add(
        "cart-open"
    );


    drawer.setAttribute(
        "aria-hidden",
        "false"
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


    if(
        drawer &&
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
   CART ADDED NOTIFICATION
========================================================== */

function showCartAddedNotification(
    productName,
    quantity
){

    let notification =
        document.getElementById(
            "cartNotification"
        );


    if(!notification){

        notification =
            document.createElement(
                "div"
            );

        notification.id =
            "cartNotification";

        notification.className =
            "cart-notification";


        document.body.appendChild(
            notification
        );

    }


    notification.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <div>

            <strong>
                Added to cart
            </strong>

            <span>
                ${quantity} ×
                ${escapeHTML(
                    productName || "Item"
                )}
            </span>

        </div>

    `;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notification._timer
    );


    notification._timer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* ==========================================================
   CART EVENT LISTENERS
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ================================================
           LOAD SAVED CART
        ================================================= */

        loadCart();


        /* ================================================
           CART BUTTON
        ================================================= */

      const cartButton =
    document.getElementById(
        "viewCartBtn"
    );


        if(cartButton){

            cartButton.addEventListener(
                "click",
                toggleCart
            );

        }


        /* ================================================
           CART CLOSE BUTTON
        ================================================= */

     const cartClose =
    document.getElementById(
        "closeCartBtn"
    );


        if(cartClose){

            cartClose.addEventListener(
                "click",
                closeCart
            );

        }


        /* ================================================
           CART OVERLAY
        ================================================= */

        const cartOverlay =
            document.getElementById(
                "cartOverlay"
            );


        if(cartOverlay){

            cartOverlay.addEventListener(
                "click",
                closeCart
            );

        }


        /* ================================================
           ESCAPE
        ================================================= */

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
);
