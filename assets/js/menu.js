/* ==========================================================
   PAPPRITO WEBSITE V7
   MENU SYSTEM
   PART 1
   CORE MENU + FIREBASE
========================================================== */


/* ==========================================================
   GLOBAL MENU DATA
========================================================== */

let menuCategories = [];

let menuProducts = [];

let selectedCategory = "all";

let selectedProduct = null;

let selectedQuantity = 1;

let menuCart = [];


/* ==========================================================
   CONSTANTS
========================================================== */

const MENU_CART_STORAGE =
    "pappritoMenuCart";


const MENU_DEFAULT_IMAGE =
    "../assets/images/no-product.png";


/* ==========================================================
   MENU INITIALIZATION
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

        loadCart();

        initializeMenuEvents();

        updateCartUI();

    }catch(error){

        console.error(
            "PAPPRITO MENU ERROR:",
            error
        );

        showMenuError();

    }

}


/* ==========================================================
   CHECK FIREBASE DATABASE
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
        String(product.image).trim() !== ""
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
   MENU LOADING
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
   MENU ERROR
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
                Please refresh the page and try again.
            </p>

        </div>

    `;

}
/* ==========================================================
   PAPPRITO WEBSITE V7
   MENU SYSTEM
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
        document.createElement("button");


    allButton.type =
        "button";


    allButton.className =
        "category-btn active";


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
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "category-btn";


            button.dataset.category =
                category.name || "";


            button.textContent =
                category.name || "Category";


            wrapper.appendChild(
                button
            );

        }
    );


    updateActiveCategoryButton();

}


/* ==========================================================
   CATEGORY BUTTON EVENTS
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
        event => {

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


            updateActiveCategoryButton();

            renderMenuProducts();

            scrollToMenuProducts();

        }
    );

}


/* ==========================================================
   UPDATE ACTIVE CATEGORY
========================================================== */

function updateActiveCategoryButton(){

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(
        button => {

            const isActive =
                button.dataset.category ===
                selectedCategory;


            button.classList.toggle(
                "active",
                isActive
            );

        }
    );

}


/* ==========================================================
   FILTER PRODUCTS BY CATEGORY
========================================================== */

function getFilteredMenuProducts(){

    if(
        selectedCategory === "all"
    ){

        return [
            ...menuProducts
        ];

    }


    return menuProducts.filter(
        product => {

            return (
                String(
                    product.categoryName || ""
                ).trim()
                ===
                String(
                    selectedCategory
                ).trim()
            );

        }
    );

}


/* ==========================================================
   CATEGORY SCROLL
========================================================== */

function scrollCategoryLeft(){

    const wrapper =
        document.getElementById(
            "menu-category-wrapper"
        );


    if(!wrapper){

        return;

    }


    wrapper.scrollBy({

        left:-250,

        behavior:"smooth"

    });

}


/* ==========================================================
   CATEGORY SCROLL RIGHT
========================================================== */

function scrollCategoryRight(){

    const wrapper =
        document.getElementById(
            "menu-category-wrapper"
        );


    if(!wrapper){

        return;

    }


    wrapper.scrollBy({

        left:250,

        behavior:"smooth"

    });

}


/* ==========================================================
   CATEGORY SCROLL BUTTON EVENTS
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
            scrollCategoryLeft
        );

    }


    if(rightButton){

        rightButton.addEventListener(
            "click",
            scrollCategoryRight
        );

    }

}


/* ==========================================================
   SCROLL TO PRODUCTS
========================================================== */

function scrollToMenuProducts(){

    const products =
        document.getElementById(
            "menu-items"
        );


    if(!products){

        return;

    }


    const headerOffset =
        110;


    const position =
        products.getBoundingClientRect().top
        +
        window.scrollY
        -
        headerOffset;


    window.scrollTo({

        top:position,

        behavior:"smooth"

    });

}
/* ==========================================================
   PAPPRITO WEBSITE V7
   MENU SYSTEM
   PART 3
   PRODUCT CARDS
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


    const filteredProducts =
        getFilteredMenuProducts();


    container.innerHTML = "";


    /* ======================================================
       NO PRODUCTS
    ====================================================== */

    if(filteredProducts.length === 0){

        container.innerHTML = `

            <div class="menu-empty">

                <i class="fa-solid fa-utensils"></i>

                <h3>
                    No products found
                </h3>

                <p>
                    There are currently no available
                    items in this category.
                </p>

            </div>

        `;

        return;

    }


    /* ======================================================
       PRODUCT CARDS
    ====================================================== */

    filteredProducts.forEach(
        product => {

            container.insertAdjacentHTML(
                "beforeend",
                createMenuProductCard(product)
            );

        }
    );

}


/* ==========================================================
   CREATE PRODUCT CARD
========================================================== */

function createMenuProductCard(
    product
){

    const image =
        getMenuProductImage(
            product
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
                    src="${escapeHTML(image)}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.src='${MENU_DEFAULT_IMAGE}'">

            </button>


            <div class="menu-card-body">


                <!-- ======================================
                     CATEGORY
                ======================================= -->

                <span class="menu-category">

                    ${category}

                </span>


                <!-- ======================================
                     PRODUCT NAME
                ======================================= -->

                <h3 class="menu-product-name">

                    ${name}

                </h3>


                <!-- ======================================
                     DESCRIPTION
                ======================================= -->

                <p class="menu-product-description">

                    ${description}

                </p>


                <!-- ======================================
                     FOOTER
                ======================================= -->

                <div class="menu-footer">


                    <div class="menu-price">

                        ${price}

                    </div>


                    <button
                        type="button"
                        class="menu-order-btn"
                        onclick="openProductModal('${productId}')">

                        <i class="fa-solid fa-plus"></i>

                        Add

                    </button>


                </div>

            </div>

        </article>

    `;

}


/* ==========================================================
   PRODUCT CLICK EVENT
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
   SEARCH PRODUCTS
========================================================== */

function searchMenuProducts(
    searchValue
){

    const search =
        String(
            searchValue || ""
        )
        .trim()
        .toLowerCase();


    if(search === ""){

        renderMenuProducts();

        return;

    }


    const container =
        document.getElementById(
            "menu-products"
        );


    if(!container){

        return;

    }


    const filtered =
        getFilteredMenuProducts()
        .filter(
            product => {

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


    container.innerHTML = "";


    if(filtered.length === 0){

        container.innerHTML = `

            <div class="menu-empty">

                <i class="fa-solid fa-magnifying-glass"></i>

                <h3>
                    No matching products
                </h3>

                <p>
                    Try another search.
                </p>

            </div>

        `;

        return;

    }


    filtered.forEach(
        product => {

            container.insertAdjacentHTML(
                "beforeend",
                createMenuProductCard(product)
            );

        }
    );

}


/* ==========================================================
   SEARCH EVENTS
========================================================== */

function initializeMenuSearch(){

    const searchInput =
        document.getElementById(
            "menuSearch"
        );


    const clearButton =
        document.getElementById(
            "clearMenuSearch"
        );


    if(searchInput){

        searchInput.addEventListener(
            "input",
            () => {

                searchMenuProducts(
                    searchInput.value
                );

                if(clearButton){

                    clearButton.classList.toggle(
                        "show",
                        searchInput.value.trim() !== ""
                    );

                }

            }
        );

    }


    if(clearButton){

        clearButton.addEventListener(
            "click",
            () => {

                if(searchInput){

                    searchInput.value = "";

                }


                clearButton.classList.remove(
                    "show"
                );


                renderMenuProducts();


                if(searchInput){

                    searchInput.focus();

                }

            }
        );

    }

}
/* ==========================================================
   PAPPRITO WEBSITE V7
   MENU SYSTEM
   PART 4
   PRODUCT MODAL
========================================================== */


/* ==========================================================
   OPEN PRODUCT MODAL
========================================================== */

function openProductModal(productId){

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


    const quantity =
        document.getElementById(
            "modalQty"
        );


    const total =
        document.getElementById(
            "modalTotal"
        );


    /* ======================================================
       IMAGE
    ====================================================== */

    if(image){

        image.src =
            getMenuProductImage(
                product
            );

        image.alt =
            product.name ||
            "Product";

    }


    /* ======================================================
       CATEGORY
    ====================================================== */

    if(category){

        category.textContent =
            product.categoryName ||
            "Menu";

    }


    /* ======================================================
       NAME
    ====================================================== */

    if(name){

        name.textContent =
            product.name ||
            "Product";

    }


    /* ======================================================
       DESCRIPTION
    ====================================================== */

    if(description){

        description.textContent =
            product.description ||
            "Freshly prepared with quality ingredients.";

    }


    /* ======================================================
       PRICE
    ====================================================== */

    if(price){

        price.textContent =
            formatMenuPrice(
                product.sellingPrice
            );

    }


    /* ======================================================
       QUANTITY
    ====================================================== */

    if(quantity){

        quantity.textContent =
            selectedQuantity;

    }


    /* ======================================================
       TOTAL
    ====================================================== */

    updateModalTotal();


    /* ======================================================
       OPEN
    ====================================================== */

    if(modal){

        modal.classList.add(
            "active"
        );

       document.body.classList.remove(
    "product-modal-open"
);
    }

}


/* ==========================================================
   CLOSE PRODUCT MODAL
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


   document.body.classList.add(
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
           "modalTotalPrice"
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
   MODAL QUANTITY MINUS
========================================================== */

function decreaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    if(
        selectedQuantity <= 1
    ){

        selectedQuantity = 1;

    }else{

        selectedQuantity--;

    }


    updateModalTotal();

}


/* ==========================================================
   MODAL QUANTITY PLUS
========================================================== */

function increaseModalQuantity(){

    if(!selectedProduct){

        return;

    }


    selectedQuantity++;


    updateModalTotal();

}


/* ==========================================================
   ADD PRODUCT TO CART
========================================================== */

function addSelectedProductToCart(){

    if(!selectedProduct){

        return;

    }


    const product =
        selectedProduct;


    const productId =
        String(
            product.id
        );


    const existingItem =
        menuCart.find(
            item =>
                String(item.id) ===
                productId
        );


    if(existingItem){

        existingItem.quantity +=
            selectedQuantity;

    }else{

        menuCart.push({

            id:product.id,

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
                selectedQuantity

        });

    }


    saveCart();


    updateCartUI();


    showCartNotification(
        product.name ||
        "Product"
    );


    closeProductModal();


    /* ======================================================
       OPEN CART AFTER ADD
    ====================================================== */

    setTimeout(
        () => {

            openCart();

        },
        250
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


    /* ======================================================
       CLOSE
    ====================================================== */

    if(closeButton){

        closeButton.addEventListener(
            "click",
            closeProductModal
        );

    }


    /* ======================================================
       MINUS
    ====================================================== */

    if(minusButton){

        minusButton.addEventListener(
            "click",
            decreaseModalQuantity
        );

    }


    /* ======================================================
       PLUS
    ====================================================== */

    if(plusButton){

        plusButton.addEventListener(
            "click",
            increaseModalQuantity
        );

    }


    /* ======================================================
       ADD TO CART
    ====================================================== */

    if(orderButton){

        orderButton.addEventListener(
            "click",
            addSelectedProductToCart
        );

    }


    /* ======================================================
       CLICK OUTSIDE
    ====================================================== */

    if(modal){

        modal.addEventListener(
            "click",
            event => {

                if(
                    event.target ===
                    modal
                ){

                    closeProductModal();

                }

            }
        );

    }

}


/* ==========================================================
   ESC KEY
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
   PAPPRITO WEBSITE V7
   MENU SYSTEM
   PART 5
   CART ENGINE + LOCALSTORAGE
========================================================== */


/* ==========================================================
   LOAD CART
========================================================== */

function loadCart(){

    try{

        const savedCart =
            localStorage.getItem(
                MENU_CART_STORAGE
            );


        if(!savedCart){

            menuCart = [];

            return;

        }


        const parsedCart =
            JSON.parse(
                savedCart
            );


        if(
            !Array.isArray(
                parsedCart
            )
        ){

            menuCart = [];

            return;

        }


        menuCart =
            parsedCart
            .filter(
                item =>
                    item &&
                    item.id
            )
            .map(
                item => ({

                    id:item.id,

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
            "Cart loading error:",
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
            "Cart saving error:",
            error
        );

    }

}


/* ==========================================================
   GET CART QUANTITY
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
   GET CART SUBTOTAL
========================================================== */

function getCartSubtotal(){

    return menuCart.reduce(
        (
            total,
            item
        ) => {

            const price =
                Number(
                    item.sellingPrice ||
                    0
                );


            const quantity =
                Number(
                    item.quantity ||
                    0
                );


            return total +
                (
                    price *
                    quantity
                );

        },
        0
    );

}


/* ==========================================================
   FIND CART ITEM
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


    const currentQuantity =
        Number(
            item.quantity || 0
        );


    if(
        currentQuantity <= 1
    ){

        removeFromCart(
            productId
        );

        return;

    }


    item.quantity =
        currentQuantity - 1;


    saveCart();

    updateCartUI();

}


/* ==========================================================
   REMOVE FROM CART
========================================================== */

function removeFromCart(
    productId
){

    const item =
        findCartItem(
            productId
        );


    if(!item){

        return;

    }


    menuCart =
        menuCart.filter(
            cartItem =>
                String(
                    cartItem.id
                ) !==
                String(
                    productId
                )
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
   CART ITEM QUANTITY LIMIT
========================================================== */

function setCartItemQuantity(
    productId,
    quantity
){

    const item =
        findCartItem(
            productId
        );


    if(!item){

        return;

    }


    const newQuantity =
        Math.floor(
            Number(
                quantity
            )
        );


    if(
        !Number.isFinite(
            newQuantity
        ) ||
        newQuantity <= 0
    ){

        removeFromCart(
            productId
        );

        return;

    }


    item.quantity =
        newQuantity;


    saveCart();

    updateCartUI();

}


/* ==========================================================
   ADD PRODUCT DIRECTLY
========================================================== */

function addProductToCart(
    product,
    quantity = 1
){

    if(!product){

        return;

    }


    const productId =
        String(
            product.id
        );


    const addQuantity =
        Math.max(
            1,
            Math.floor(
                Number(
                    quantity
                )
            )
        );


    const existingItem =
        findCartItem(
            productId
        );


    if(existingItem){

        existingItem.quantity +=
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
   CART VALIDATION
========================================================== */

function validateCart(){

    menuCart =
        menuCart.filter(
            item => {

                if(
                    !item ||
                    !item.id
                ){

                    return false;

                }


                if(
                    Number(
                        item.quantity
                    ) <= 0
                ){

                    return false;

                }


                return true;

            }
        );


    saveCart();

}


/* ==========================================================
   CART TOTALS OBJECT
========================================================== */

function getCartTotals(){

    const subtotal =
        getCartSubtotal();


    /*
       Delivery is currently FREE / ZERO.
       We can change this later when
       delivery rules are added.
    */

    const delivery = 0;


    const total =
        subtotal +
        delivery;


    return {

        quantity:
            getCartQuantity(),

        subtotal:
            subtotal,

        delivery:
            delivery,

        total:
            total

    };

}


/* ==========================================================
   CART DATA RESET
========================================================== */

function resetCartData(){

    menuCart = [];

    try{

        localStorage.removeItem(
            MENU_CART_STORAGE
        );

    }catch(error){

        console.error(
            "Cart reset error:",
            error
        );

    }


    updateCartUI();

}
/* ==========================================================
   PAPPRITO WEBSITE V7
   MENU SYSTEM
   PART 6
   CART RENDERING
========================================================== */


/* ==========================================================
   RENDER CART ITEMS
========================================================== */

function renderCartItems(){

    const container =
        document.getElementById(
            "cartItems"
        );

    const emptyCart =
        document.getElementById(
            "cartEmpty"
        );


    if(!container){

        return;

    }


    /* ======================================================
       EMPTY CART
    ====================================================== */

    if(menuCart.length === 0){

        container.innerHTML = "";

        if(emptyCart){

            emptyCart.style.display =
                "flex";

        }

        return;

    }


    /* ======================================================
       CART HAS ITEMS
    ====================================================== */

    if(emptyCart){

        emptyCart.style.display =
            "none";

    }


    container.innerHTML = "";


    menuCart.forEach(
        item => {

            container.insertAdjacentHTML(
                "beforeend",
                createCartItemHTML(item)
            );

        }
    );

}


/* ==========================================================
   CREATE CART ITEM HTML
========================================================== */

function createCartItemHTML(
    item
){

    const image =
        getMenuProductImage(
            item
        );


    const name =
        escapeHTML(
            item.name ||
            "Product"
        );


    const price =
        Number(
            item.sellingPrice ||
            0
        );


    const quantity =
        Math.max(
            1,
            Number(
                item.quantity ||
                1
            )
        );


    const itemTotal =
        price *
        quantity;


    const productId =
        escapeHTML(
            item.id
        );


    return `

        <div
            class="cart-item"
            data-cart-id="${productId}">


            <!-- ==========================================
                 IMAGE
            =========================================== -->

            <div class="cart-item-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${name}"
                    loading="lazy"
                    onerror="this.src='${MENU_DEFAULT_IMAGE}'">

            </div>


            <!-- ==========================================
                 PRODUCT INFORMATION
            =========================================== -->

          <div class="cart-item-body">

                <div class="cart-item-name">

                    ${name}

                </div>


                <div class="cart-item-price">

                    ${formatMenuPrice(price)}

                </div>


                <!-- ======================================
                     QUANTITY
                ======================================= -->

                <div class="cart-item-controls">


                   <button
    type="button"
    class="cart-quantity-btn"
    onclick="decreaseCartItem('${productId}')"
    aria-label="Decrease quantity">

    <i class="fa-solid fa-minus"></i>

</button>

                   <span class="cart-item-qty">

                        ${quantity}

                    </span>


                 <button
    type="button"
    class="cart-quantity-btn"
    onclick="increaseCartItem('${productId}')"
    aria-label="Increase quantity">

    <i class="fa-solid fa-plus"></i>

</button>


                </div>

            </div>


            <!-- ==========================================
                 RIGHT SIDE
            =========================================== -->

            <div class="cart-item-right">


                <div class="cart-item-total">

                    ${formatMenuPrice(itemTotal)}

                </div>


                <button
                    type="button"
                    class="cart-item-remove"
                    onclick="removeFromCart('${productId}')"
                    aria-label="Remove ${name}">

                    <i class="fa-solid fa-trash"></i>

                </button>


            </div>

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
       CART COUNT
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
       FLOATING CART TOTAL
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
       CART SUBTOTAL
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
       CART ITEM COUNT TEXT
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
       RENDER ITEMS
    ====================================================== */

    renderCartItems();


    /* ======================================================
       EMPTY CART STATE
    ====================================================== */

    const checkoutButton =
        document.getElementById(
            "checkoutBtn"
        );


    if(checkoutButton){

        checkoutButton.disabled =
            totals.quantity === 0;

    }

}
/* ==========================================================
   PAPPRITO WEBSITE V7
   MENU SYSTEM
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


    /* ======================================================
       UPDATE CART BEFORE OPENING
    ====================================================== */

    updateCartUI();


    /* ======================================================
       SHOW DRAWER
    ====================================================== */

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


    /* ======================================================
       ACCESSIBILITY
    ====================================================== */

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
   INITIALIZE CART DRAWER EVENTS
========================================================== */

function initializeCartDrawerEvents(){

    const viewCartButton =
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


    /* ======================================================
       VIEW CART
    ====================================================== */

    if(viewCartButton){

        viewCartButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                openCart();

            }
        );

    }


    /* ======================================================
       CLOSE BUTTON
    ====================================================== */

    if(closeCartButton){

        closeCartButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                closeCart();

            }
        );

    }


    /* ======================================================
       OVERLAY
    ====================================================== */

    if(overlay){

        overlay.addEventListener(
            "click",
            closeCart
        );

    }


    /* ======================================================
       ESC KEY
    ====================================================== */

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
   PREVENT BACKGROUND SCROLL
========================================================== */

function initializeCartScrollLock(){

    const drawer =
        document.getElementById(
            "cartDrawer"
        );


    if(!drawer){

        return;

    }


    const observer =
        new MutationObserver(
            () => {

                const isOpen =
                    drawer.classList.contains(
                        "active"
                    );


                document.body.classList.toggle(
                    "cart-open",
                    isOpen
                );

            }
        );


    observer.observe(
        drawer,
        {
            attributes:true,
            attributeFilter:[
                "class"
            ]
        }
    );

}
/* ==========================================================
   PAPPRITO WEBSITE V7
   MENU SYSTEM
   PART 8
   EVENTS + INITIALIZATION
========================================================== */


/* ==========================================================
   INITIALIZE ALL MENU EVENTS
========================================================== */

function initializeMenuEvents(){

    /* ======================================================
       CATEGORY EVENTS
    ====================================================== */

    initializeCategoryEvents();


    /* ======================================================
       CATEGORY SCROLL
    ====================================================== */

    initializeCategoryScroll();


    /* ======================================================
       PRODUCT EVENTS
    ====================================================== */

    initializeProductEvents();


    /* ======================================================
       PRODUCT MODAL
    ====================================================== */

    initializeProductModalEvents();


    /* ======================================================
       MODAL KEYBOARD
    ====================================================== */

    initializeModalKeyboard();


    /* ======================================================
       SEARCH
    ====================================================== */

    initializeMenuSearch();


    /* ======================================================
       CART DRAWER
    ====================================================== */

    initializeCartDrawerEvents();


    /* ======================================================
       CART SCROLL LOCK
    ====================================================== */

    initializeCartScrollLock();


    console.log(
        "PAPPRITO MENU EVENTS READY"
    );

}


/* ==========================================================
   PRODUCT IMAGE ERROR HANDLER
========================================================== */

document.addEventListener(
    "error",
    event => {

        const target =
            event.target;


        if(
            target &&
            target.tagName === "IMG"
        ){

            if(
                target.dataset.fallbackApplied
            ){

                return;

            }


            target.dataset.fallbackApplied =
                "true";


            target.src =
                MENU_DEFAULT_IMAGE;

        }

    },
    true
);


/* ==========================================================
   CART BUTTON DELEGATION
========================================================== */

document.addEventListener(
    "click",
    event => {

        const cartButton =
            event.target.closest(
                "[data-cart-action]"
            );


        if(!cartButton){

            return;

        }


        const action =
            cartButton.dataset.cartAction;


        const productId =
            cartButton.dataset.productId;


        if(
            action === "increase" &&
            productId
        ){

            increaseCartItem(
                productId
            );

        }


        if(
            action === "decrease" &&
            productId
        ){

            decreaseCartItem(
                productId
            );

        }


        if(
            action === "remove" &&
            productId
        ){

            removeFromCart(
                productId
            );

        }

    }
);


/* ==========================================================
   GLOBAL CART OPEN BUTTONS
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
   GLOBAL CART CLOSE BUTTONS
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
   CART STORAGE SYNC
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
   BEFORE PAGE LEAVE
========================================================== */

window.addEventListener(
    "beforeunload",
    () => {

        saveCart();

    }
);


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


window.setCartItemQuantity =
    setCartItemQuantity;


window.openCart =
    openCart;


window.closeCart =
    closeCart;


window.toggleCart =
    toggleCart;


window.searchMenuProducts =
    searchMenuProducts;


/* ==========================================================
   DEBUG HELPER
========================================================== */

window.PAPPRITO_MENU = {

    categories:
        () => menuCategories,

    products:
        () => menuProducts,

    cart:
        () => menuCart,

    totals:
        () => getCartTotals(),

    refresh:
        () => updateCartUI()

};


/* ==========================================================
   FINAL READY MESSAGE
========================================================== */

console.log(
    "PAPPRITO MENU V7 READY"
);

/* ==========================================================
   PAPPRITO WEBSITE V7
   MENU SYSTEM
   PART 9
   FINAL SAFETY + INITIALIZATION
========================================================== */


/* ==========================================================
   SAFE EVENT LISTENER
========================================================== */

function safeAddEventListener(
    element,
    event,
    handler
){

    if(!element){

        return;

    }


    element.addEventListener(
        event,
        handler
    );

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


        console.log(
            "PAPPRITO MENU REFRESHED"
        );

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
   CHECK MENU ELEMENTS
========================================================== */

function checkMenuElements(){

    const elements = {

        categoryWrapper:
            document.getElementById(
                "menu-category-wrapper"
            ),

        products:
            document.getElementById(
                "menu-products"
            ),

        productModal:
            document.getElementById(
                "productModal"
            ),

        cartDrawer:
            document.getElementById(
                "cartDrawer"
            ),

        cartItems:
            document.getElementById(
                "cartItems"
            )

    };


    Object.entries(
        elements
    ).forEach(
        (
            [
                name,
                element
            ]
        ) => {

            if(!element){

                console.warn(
                    `PAPPRITO MENU: ${name} element not found.`
                );

            }

        }
    );


    return elements;

}


/* ==========================================================
   INITIALIZE FINAL MENU SYSTEM
========================================================== */

function initializeFinalMenu(){

    try{

        /* ==================================================
           CHECK HTML
        ================================================== */

        checkMenuElements();


        /* ==================================================
           INITIAL CART
        ================================================== */

        loadCart();


        validateCart();


        updateCartUI();


        /* ==================================================
           CATEGORY EVENTS
        ================================================== */

        initializeCategoryEvents();


        initializeCategoryScroll();


        /* ==================================================
           PRODUCT EVENTS
        ================================================== */

        initializeProductEvents();


        /* ==================================================
           SEARCH
        ================================================== */

        initializeMenuSearch();


        /* ==================================================
           MODAL
        ================================================== */

        initializeProductModalEvents();


        initializeModalKeyboard();


        /* ==================================================
           CART DRAWER
        ================================================== */

        initializeCartDrawerEvents();


        initializeCartScrollLock();


        /* ==================================================
           GLOBAL FUNCTIONS
        ================================================== */

        window.refreshMenu =
            refreshMenu;


        window.refreshCart =
            refreshCart;


        window.PAPPRITO_MENU_READY =
            true;


        console.log(
            "================================"
        );


        console.log(
            "PAPPRITO MENU V7 READY"
        );


        console.log(
            "Categories:",
            menuCategories.length
        );


        console.log(
            "Products:",
            menuProducts.length
        );


        console.log(
            "Cart Items:",
            menuCart.length
        );


        console.log(
            "================================"
        );

    }catch(error){

        console.error(
            "PAPPRITO MENU INITIALIZATION ERROR:",
            error
        );

    }

}


/* ==========================================================
   FINAL WINDOW LOAD
========================================================== */

window.addEventListener(
    "load",
    () => {

        /*
         * Small delay gives Firebase and
         * page components time to initialize.
         */

        setTimeout(
            () => {

                initializeFinalMenu();

            },
            100
        );

    }
);


/* ==========================================================
   FIREBASE READY CHECK
========================================================== */

function waitForFirebase(
    callback,
    attempts = 0
){

    const maxAttempts = 50;


    if(
        typeof db !== "undefined"
    ){

        callback();

        return;

    }


    if(
        attempts >= maxAttempts
    ){

        console.error(
            "PAPPRITO MENU: Firebase database was not found."
        );

        showMenuError();

        return;

    }


    setTimeout(
        () => {

            waitForFirebase(
                callback,
                attempts + 1
            );

        },
        200
    );

}


/* ==========================================================
   FIREBASE-SAFE START
========================================================== */

window.addEventListener(
    "load",
    () => {

        waitForFirebase(
            () => {

                /*
                 * Firebase is available.
                 * Load the actual menu data.
                 */

                initializeMenu();

            }
        );

    }
);


/* ==========================================================
   FINAL ERROR HANDLER
========================================================== */

window.addEventListener(
    "error",
    event => {

        console.error(
            "PAPPRITO MENU ERROR:",
            event.error ||
            event.message
        );

    }
);


/* ==========================================================
   FINAL PROMISE ERROR HANDLER
========================================================== */

window.addEventListener(
    "unhandledrejection",
    event => {

        console.error(
            "PAPPRITO MENU PROMISE ERROR:",
            event.reason
        );

    }
);


/* ==========================================================
   FINAL VERSION
========================================================== */

const PAPPRITO_MENU_VERSION =
    "V7.0.0";


console.log(
    `PAPPRITO MENU ${PAPPRITO_MENU_VERSION}`
);
