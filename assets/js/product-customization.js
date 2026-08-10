/* ==========================================================
   PAPPRITO WEB V5
   PRODUCT CUSTOMIZATION MODULE
   File : product-customization.js
   PART : 4
========================================================== */


/* ==========================================================
   CUSTOMIZATION STATE
========================================================== */

let customizationProduct = null;

let customizationQuantity = 1;

let selectedDrink = null;

let selectedAddons = [];

let customizationInitialized = false;


/* ==========================================================
   DEFAULT CONFIGURATION
========================================================== */

const CUSTOMIZATION_CONFIG = {

    maxAddons: 6,

    defaultQuantity: 1,

    maxQuantity: 99,

    visibleOptions: 4

};


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        initializeProductCustomization();

    }
);


/* ==========================================================
   INITIALIZE
========================================================== */

function initializeProductCustomization(){

    if(customizationInitialized){

        return;

    }


    const modal =
        document.getElementById(
            "productCustomization"
        );


    if(!modal){

        console.warn(
            "Product customization modal not found."
        );

        return;

    }


    customizationInitialized =
        true;


    setupCustomizationEvents();

    updateCustomizationQuantity();

}


/* ==========================================================
   SETUP EVENTS
========================================================== */

function setupCustomizationEvents(){

    /* ==============================================
       CLOSE
    =============================================== */

    const closeButton =
        document.getElementById(
            "customizationClose"
        );


    if(closeButton){

        closeButton.addEventListener(
            "click",
            closeProductCustomization
        );

    }


    /* ==============================================
       QUANTITY MINUS
    =============================================== */

    const qtyMinus =
        document.getElementById(
            "customizationQtyMinus"
        );


    if(qtyMinus){

        qtyMinus.addEventListener(
            "click",
            decreaseCustomizationQuantity
        );

    }


    /* ==============================================
       QUANTITY PLUS
    =============================================== */

    const qtyPlus =
        document.getElementById(
            "customizationQtyPlus"
        );


    if(qtyPlus){

        qtyPlus.addEventListener(
            "click",
            increaseCustomizationQuantity
        );

    }


    /* ==============================================
       ADD TO CART
    =============================================== */

    const addButton =
        document.getElementById(
            "customizationAddBtn"
        );


    if(addButton){

        addButton.addEventListener(
            "click",
            addCustomizedProductToCart
        );

    }


    /* ==============================================
       DRINK VIEW MORE
    =============================================== */

    const drinkMore =
        document.getElementById(
            "drinkViewMore"
        );


    if(drinkMore){

        drinkMore.addEventListener(
            "click",
            function(){

                toggleCustomizationOptions(
                    "drinkCustomizationOptions",
                    drinkMore
                );

            }
        );

    }


    /* ==============================================
       ADDON VIEW MORE
    =============================================== */

    const addonMore =
        document.getElementById(
            "addonViewMore"
        );


    if(addonMore){

        addonMore.addEventListener(
            "click",
            function(){

                toggleCustomizationOptions(
                    "addonCustomizationOptions",
                    addonMore
                );

            }
        );

    }


    /* ==============================================
       BACKDROP
    =============================================== */

    const modal =
        document.getElementById(
            "productCustomization"
        );


    if(modal){

        modal.addEventListener(
            "click",
            function(event){

                if(
                    event.target === modal
                ){

                    closeProductCustomization();

                }

            }
        );

    }


    /* ==============================================
       ESCAPE KEY
    =============================================== */

    document.addEventListener(
        "keydown",
        function(event){

            if(
                event.key === "Escape" &&
                customizationProduct
            ){

                closeProductCustomization();

            }

        }
    );

}


/* ==========================================================
   OPEN CUSTOMIZATION
========================================================== */

function openProductCustomization(product){

    if(!product){

        return;

    }


    initializeProductCustomization();


    customizationProduct =
        product;


    customizationQuantity =
        CUSTOMIZATION_CONFIG.defaultQuantity;


    selectedDrink =
        null;


    selectedAddons =
        [];


    /* ==============================================
       UPDATE PRODUCT INFORMATION
    =============================================== */

    renderCustomizationProduct();


    /* ==============================================
       RESET OPTIONS
    =============================================== */

    renderDrinkOptions();

    renderAddonOptions();


    /* ==============================================
       RESET UI
    =============================================== */

    clearCustomizationErrors();

    updateCustomizationQuantity();

    updateCustomizationTotal();

    resetViewMoreButtons();


    /* ==============================================
       OPEN MODAL
    =============================================== */

    const modal =
        document.getElementById(
            "productCustomization"
        );


    if(!modal){

        return;

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "customization-open"
    );


    /* ==============================================
       FOCUS CLOSE BUTTON
    =============================================== */

    const closeButton =
        document.getElementById(
            "customizationClose"
        );


    if(closeButton){

        setTimeout(
            function(){

                closeButton.focus();

            },
            150
        );

    }

}


/* ==========================================================
   CLOSE CUSTOMIZATION
========================================================== */

function closeProductCustomization(){

    const modal =
        document.getElementById(
            "productCustomization"
        );


    if(!modal){

        return;

    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "customization-open"
    );


    customizationProduct =
        null;


    customizationQuantity =
        CUSTOMIZATION_CONFIG.defaultQuantity;


    selectedDrink =
        null;


    selectedAddons =
        [];

}


/* ==========================================================
   RENDER PRODUCT
========================================================== */

function renderCustomizationProduct(){

    if(!customizationProduct){

        return;

    }


    const image =
        document.getElementById(
            "customizationProductImage"
        );


    const category =
        document.getElementById(
            "customizationProductCategory"
        );


    const name =
        document.getElementById(
            "customizationProductName"
        );


    const description =
        document.getElementById(
            "customizationProductDescription"
        );


    const price =
        document.getElementById(
            "customizationProductPrice"
        );


    const headerTitle =
        document.getElementById(
            "customizationHeaderTitle"
        );


    const productName =
        getProductName(
            customizationProduct
        );


    const productCategory =
        getProductCategory(
            customizationProduct
        );


    const productDescription =
        getProductDescription(
            customizationProduct
        );


    const productPrice =
        getProductPrice(
            customizationProduct
        );


    if(image){

        image.src =
            getProductImage(
                customizationProduct
            );

        image.alt =
            productName;

    }


    if(category){

        category.textContent =
            productCategory;

    }


    if(name){

        name.textContent =
            productName;

    }


    if(description){

        description.textContent =
            productDescription;

    }


    if(price){

        price.textContent =
            formatPeso(
                productPrice
            );

    }


    if(headerTitle){

        headerTitle.textContent =
            "Customize " +
            productName;

    }

}


/* ==========================================================
   PRODUCT DATA HELPERS
========================================================== */

function getProductName(product){

    return (
        product.name ||
        product.productName ||
        product.title ||
        "Product"
    );

}


function getProductCategory(product){

    return (
        product.categoryName ||
        product.category ||
        ""
    );

}


function getProductDescription(product){

    return (
        product.description ||
        product.desc ||
        "Customize your order."
    );

}


function getProductPrice(product){

    const value =
        product.price ??
        product.sellingPrice ??
        product.amount ??
        0;


    const number =
        Number(value);


    return Number.isFinite(number)
        ? number
        : 0;

}


function getProductImage(product){

    return (
        product.image ||
        product.imageUrl ||
        product.photo ||
        "../assets/images/no-product.png"
    );

}


/* ==========================================================
   FORMAT PESO
========================================================== */

function formatPeso(amount){

    const number =
        Number(amount) || 0;


    return (
        "₱" +
        number.toLocaleString(
            "en-PH",
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        )
    );

}


/* ==========================================================
   QUANTITY MINUS
========================================================== */

function decreaseCustomizationQuantity(){

    if(
        customizationQuantity <= 1
    ){

        customizationQuantity =
            1;

    }else{

        customizationQuantity--;

    }


    updateCustomizationQuantity();

    updateCustomizationTotal();

}


/* ==========================================================
   QUANTITY PLUS
========================================================== */

function increaseCustomizationQuantity(){

    if(
        customizationQuantity >=
        CUSTOMIZATION_CONFIG.maxQuantity
    ){

        return;

    }


    customizationQuantity++;

    updateCustomizationQuantity();

    updateCustomizationTotal();

}


/* ==========================================================
   UPDATE QUANTITY UI
========================================================== */

function updateCustomizationQuantity(){

    const quantity =
        document.getElementById(
            "customizationQty"
        );


    const minus =
        document.getElementById(
            "customizationQtyMinus"
        );


    const plus =
        document.getElementById(
            "customizationQtyPlus"
        );


    if(quantity){

        quantity.textContent =
            customizationQuantity;

    }


    if(minus){

        minus.disabled =
            customizationQuantity <= 1;

    }


    if(plus){

        plus.disabled =
            customizationQuantity >=
            CUSTOMIZATION_CONFIG.maxQuantity;

    }

}


/* ==========================================================
   UPDATE TOTAL
========================================================== */

function updateCustomizationTotal(){

    if(!customizationProduct){

        return;

    }


    const basePrice =
        getProductPrice(
            customizationProduct
        );


    const drinkPrice =
        selectedDrink
            ? Number(
                selectedDrink.price
            ) || 0
            : 0;


    const addonPrice =
        selectedAddons.reduce(
            function(total, addon){

                return (
                    total +
                    (
                        Number(addon.price) ||
                        0
                    )
                );

            },
            0
        );


    const unitPrice =
        basePrice +
        drinkPrice +
        addonPrice;


    const total =
        unitPrice *
        customizationQuantity;


    const totalElement =
        document.getElementById(
            "customizationAddTotal"
        );


    if(totalElement){

        totalElement.textContent =
            formatPeso(total);

    }


    const priceElement =
        document.getElementById(
            "customizationProductPrice"
        );


    if(priceElement){

        priceElement.textContent =
            formatPeso(basePrice);

    }


    updateAddButtonState();

}


/* ==========================================================
   UPDATE ADD BUTTON STATE
========================================================== */

function updateAddButtonState(){

    const addButton =
        document.getElementById(
            "customizationAddBtn"
        );


    if(!addButton){

        return;

    }


    const valid =
        Boolean(
            selectedDrink
        );


    addButton.disabled =
        !valid;

}


/* ==========================================================
   CLEAR ERRORS
========================================================== */

function clearCustomizationErrors(){

    const drinkGroup =
        document.getElementById(
            "drinkCustomizationGroup"
        );


    const drinkError =
        document.getElementById(
            "drinkCustomizationError"
        );


    const addonError =
        document.getElementById(
            "addonCustomizationError"
        );


    const success =
        document.getElementById(
            "customizationSuccess"
        );


    if(drinkGroup){

        drinkGroup.classList.remove(
            "required-error"
        );

    }


    if(drinkError){

        drinkError.classList.remove(
            "show"
        );

    }


    if(addonError){

        addonError.classList.remove(
            "show"
        );

    }


    if(success){

        success.classList.remove(
            "show"
        );

    }

}


/* ==========================================================
   SHOW DRINK ERROR
========================================================== */

function showDrinkError(){

    const group =
        document.getElementById(
            "drinkCustomizationGroup"
        );


    const error =
        document.getElementById(
            "drinkCustomizationError"
        );


    if(group){

        group.classList.add(
            "required-error"
        );

    }


    if(error){

        error.classList.add(
            "show"
        );

    }

}


/* ==========================================================
   HIDE DRINK ERROR
========================================================== */

function hideDrinkError(){

    const group =
        document.getElementById(
            "drinkCustomizationGroup"
        );


    const error =
        document.getElementById(
            "drinkCustomizationError"
        );


    if(group){

        group.classList.remove(
            "required-error"
        );

    }


    if(error){

        error.classList.remove(
            "show"
        );

    }

}


/* ==========================================================
   RESET VIEW MORE
========================================================== */

function resetViewMoreButtons(){

    const buttons = [

        document.getElementById(
            "drinkViewMore"
        ),

        document.getElementById(
            "addonViewMore"
        )

    ];


    buttons.forEach(
        function(button){

            if(!button){

                return;

            }


            button.classList.remove(
                "expanded"
            );


            const span =
                button.querySelector(
                    "span"
                );


            if(span){

                span.textContent =
                    "View more";

            }

        }
    );

}


/* ==========================================================
   TOGGLE VIEW MORE
========================================================== */

function toggleCustomizationOptions(
    containerId,
    button
){

    const container =
        document.getElementById(
            containerId
        );


    if(!container){

        return;

    }


    const hiddenOptions =
        container.querySelectorAll(
            ".hidden-option"
        );


    if(
        hiddenOptions.length === 0
    ){

        return;

    }


    const expanded =
        button.classList.contains(
            "expanded"
        );


    hiddenOptions.forEach(
        function(option){

            option.style.display =
                expanded
                    ? "none"
                    : "flex";

        }
    );


    button.classList.toggle(
        "expanded"
    );


    const span =
        button.querySelector(
            "span"
        );


    if(span){

        span.textContent =
            expanded
                ? "View more"
                : "View less";

    }

}


/* ==========================================================
   GLOBAL ACCESS
========================================================== */

window.openProductCustomization =
    openProductCustomization;


window.closeProductCustomization =
    closeProductCustomization;


/* ==========================================================
   PAPPRITO WEB V5
   PRODUCT CUSTOMIZATION MODULE
   PART : 5
   OPTIONS RENDERING
========================================================== */


/* ==========================================================
   GET CUSTOMIZATION DATA
========================================================== */

function getCustomizationData(product){

    if(!product){

        return {

            drinks: [],

            addons: []

        };

    }


    const customization =
        product.customizations ||
        product.customization ||
        product.options ||
        {};


    let drinks =
        customization.drinks ||
        customization.drink ||
        product.drinks ||
        [];


    let addons =
        customization.addOns ||
        customization.addons ||
        customization.sides ||
        product.addOns ||
        product.addons ||
        [];


    /* ==============================================
       ENSURE ARRAYS
    =============================================== */

    if(!Array.isArray(drinks)){

        drinks =
            Object.values(drinks);

    }


    if(!Array.isArray(addons)){

        addons =
            Object.values(addons);

    }


    return {

        drinks: normalizeCustomizationOptions(
            drinks
        ),

        addons: normalizeCustomizationOptions(
            addons
        )

    };

}


/* ==========================================================
   NORMALIZE OPTIONS
========================================================== */

function normalizeCustomizationOptions(
    options
){

    if(!Array.isArray(options)){

        return [];

    }


    return options
        .map(
            function(option, index){

                if(
                    typeof option === "string"
                ){

                    return {

                        id:
                            "option-" +
                            index,

                        name:
                            option,

                        price:0,

                        popular:false

                    };

                }


                return {

                    id:
                        option.id ||
                        option.key ||
                        "option-" +
                        index,

                    name:
                        option.name ||
                        option.title ||
                        option.label ||
                        "Option",

                    price:
                        Number(
                            option.price ||
                            option.amount ||
                            0
                        ) || 0,

                    popular:
                        Boolean(
                            option.popular ||
                            option.isPopular
                        ),

                    description:
                        option.description ||
                        "",

                    available:
                        option.available !== false

                };

            }
        )
        .filter(
            function(option){

                return option.available !== false;

            }
        );

}


/* ==========================================================
   RENDER DRINK OPTIONS
========================================================== */

function renderDrinkOptions(){

    const container =
        document.getElementById(
            "drinkCustomizationOptions"
        );


    if(!container){

        return;

    }


    container.innerHTML = "";


    const data =
        getCustomizationData(
            customizationProduct
        );


    const drinks =
        data.drinks;


    if(
        !drinks.length
    ){

        container.innerHTML = `

            <div class="customization-no-options">

                No drink options available.

            </div>

        `;


        selectedDrink =
            {

                id:"default",

                name:"No Drink",

                price:0

            };


        updateCustomizationTotal();

        return;

    }


    drinks.forEach(
        function(drink, index){

            const option =
                createDrinkOption(
                    drink,
                    index
                );


            container.appendChild(
                option
            );

        }
    );


    setupDrinkSelection();

    setupViewMore(
        "drinkCustomizationOptions",
        "drinkViewMore"
    );

}


/* ==========================================================
   CREATE DRINK OPTION
========================================================== */

function createDrinkOption(
    drink,
    index
){

    const label =
        document.createElement(
            "label"
        );


    label.className =
        "customization-option";


    if(
        index >=
        CUSTOMIZATION_CONFIG.visibleOptions
    ){

        label.classList.add(
            "hidden-option"
        );

        label.style.display =
            "none";

    }


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "radio";


    input.name =
        "pappritoDrink";


    input.value =
        drink.id;


    input.dataset.index =
        index;


    input.dataset.price =
        drink.price;


    const left =
        document.createElement(
            "div"
        );


    left.className =
        "customization-option-left";


    const radio =
        document.createElement(
            "span"
        );


    radio.className =
        "customization-radio";


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "customization-option-info";


    const name =
        document.createElement(
            "span"
        );


    name.className =
        "customization-option-name";


    name.textContent =
        drink.name;


    info.appendChild(
        name
    );


    if(
        drink.popular
    ){

        const popular =
            document.createElement(
                "span"
            );


        popular.className =
            "customization-option-popular";


        popular.innerHTML = `

            <i class="fa-solid fa-fire"></i>

            Popular

        `;


        info.appendChild(
            popular
        );

    }


    left.appendChild(
        radio
    );


    left.appendChild(
        info
    );


    const right =
        document.createElement(
            "div"
        );


    right.className =
        "customization-option-right";


    const price =
        document.createElement(
            "span"
        );


    price.className =
        "customization-option-price";


    price.textContent =
        getOptionPriceText(
            drink.price
        );


    right.appendChild(
        price
    );


    label.appendChild(
        input
    );


    label.appendChild(
        left
    );


    label.appendChild(
        right
    );


    return label;

}


/* ==========================================================
   SETUP DRINK SELECTION
========================================================== */

function setupDrinkSelection(){

    const container =
        document.getElementById(
            "drinkCustomizationOptions"
        );


    if(!container){

        return;

    }


    const inputs =
        container.querySelectorAll(
            'input[name="pappritoDrink"]'
        );


    const data =
        getCustomizationData(
            customizationProduct
        );


    inputs.forEach(
        function(input){

            input.addEventListener(
                "change",
                function(){

                    const index =
                        Number(
                            input.dataset.index
                        );


                    selectedDrink =
                        data.drinks[index] ||
                        null;


                    updateSelectedDrinkUI();

                    hideDrinkError();

                    updateCustomizationTotal();

                }
            );

        }
    );

}


/* ==========================================================
   SELECTED DRINK UI
========================================================== */

function updateSelectedDrinkUI(){

    const container =
        document.getElementById(
            "drinkCustomizationOptions"
        );


    if(!container){

        return;

    }


    const options =
        container.querySelectorAll(
            ".customization-option"
        );


    options.forEach(
        function(option){

            const input =
                option.querySelector(
                    "input"
                );


            if(
                input &&
                input.checked
            ){

                option.classList.add(
                    "selected"
                );

            }else{

                option.classList.remove(
                    "selected"
                );

            }

        }
    );

}


/* ==========================================================
   RENDER ADD-ONS
========================================================== */

function renderAddonOptions(){

    const container =
        document.getElementById(
            "addonCustomizationOptions"
        );


    if(!container){

        return;

    }


    container.innerHTML = "";


    const data =
        getCustomizationData(
            customizationProduct
        );


    const addons =
        data.addons;


    const limit =
        document.getElementById(
            "addonSelectionLimit"
        );


    if(limit){

        limit.textContent =
            addons.length
                ? `(${addons.length} available)`
                : "";

    }


    if(
        !addons.length
    ){

        container.innerHTML = `

            <div class="customization-no-options">

                No add-on sides available.

            </div>

        `;


        return;

    }


    addons.forEach(
        function(addon, index){

            const option =
                createAddonOption(
                    addon,
                    index
                );


            container.appendChild(
                option
            );

        }
    );


    setupAddonSelection();

    setupViewMore(
        "addonCustomizationOptions",
        "addonViewMore"
    );

}


/* ==========================================================
   CREATE ADD-ON OPTION
========================================================== */

function createAddonOption(
    addon,
    index
){

    const label =
        document.createElement(
            "label"
        );


    label.className =
        "customization-option";


    if(
        index >=
        CUSTOMIZATION_CONFIG.visibleOptions
    ){

        label.classList.add(
            "hidden-option"
        );

        label.style.display =
            "none";

    }


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "checkbox";


    input.name =
        "pappritoAddon";


    input.value =
        addon.id;


    input.dataset.index =
        index;


    input.dataset.price =
        addon.price;


    const left =
        document.createElement(
            "div"
        );


    left.className =
        "customization-option-left";


    const checkbox =
        document.createElement(
            "span"
        );


    checkbox.className =
        "customization-checkbox";


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "customization-option-info";


    const name =
        document.createElement(
            "span"
        );


    name.className =
        "customization-option-name";


    name.textContent =
        addon.name;


    info.appendChild(
        name
    );


    left.appendChild(
        checkbox
    );


    left.appendChild(
        info
    );


    const right =
        document.createElement(
            "div"
        );


    right.className =
        "customization-option-right";


    const price =
        document.createElement(
            "span"
        );


    price.className =
        "customization-option-price";


    price.textContent =
        getOptionPriceText(
            addon.price
        );


    right.appendChild(
        price
    );


    label.appendChild(
        input
    );


    label.appendChild(
        left
    );


    label.appendChild(
        right
    );


    return label;

}


/* ==========================================================
   SETUP ADD-ON SELECTION
========================================================== */

function setupAddonSelection(){

    const container =
        document.getElementById(
            "addonCustomizationOptions"
        );


    if(!container){

        return;

    }


    const inputs =
        container.querySelectorAll(
            'input[name="pappritoAddon"]'
        );


    const data =
        getCustomizationData(
            customizationProduct
        );


    inputs.forEach(
        function(input){

            input.addEventListener(
                "change",
                function(){

                    const index =
                        Number(
                            input.dataset.index
                        );


                    const addon =
                        data.addons[index];


                    if(!addon){

                        return;

                    }


                    if(
                        input.checked
                    ){

                        if(
                            selectedAddons.length >=
                            CUSTOMIZATION_CONFIG.maxAddons
                        ){

                            input.checked =
                                false;


                            showAddonLimitError();

                            return;

                        }


                        selectedAddons.push(
                            addon
                        );

                    }else{

                        selectedAddons =
                            selectedAddons.filter(
                                function(item){

                                    return (
                                        item.id !==
                                        addon.id
                                    );

                                }
                            );

                    }


                    updateSelectedAddonUI();

                    updateCustomizationTotal();

                }
            );

        }
    );

}


/* ==========================================================
   SELECTED ADDON UI
========================================================== */

function updateSelectedAddonUI(){

    const container =
        document.getElementById(
            "addonCustomizationOptions"
        );


    if(!container){

        return;

    }


    const options =
        container.querySelectorAll(
            ".customization-option"
        );


    options.forEach(
        function(option){

            const input =
                option.querySelector(
                    "input"
                );


            if(
                input &&
                input.checked
            ){

                option.classList.add(
                    "selected"
                );

            }else{

                option.classList.remove(
                    "selected"
                );

            }

        }
    );

}


/* ==========================================================
   ADD-ON LIMIT ERROR
========================================================== */

function showAddonLimitError(){

    const error =
        document.getElementById(
            "addonCustomizationError"
        );


    if(!error){

        return;

    }


    error.classList.add(
        "show"
    );


    clearTimeout(
        showAddonLimitError.timeout
    );


    showAddonLimitError.timeout =
        setTimeout(
            function(){

                error.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* ==========================================================
   OPTION PRICE TEXT
========================================================== */

function getOptionPriceText(
    price
){

    const amount =
        Number(price) || 0;


    if(
        amount <= 0
    ){

        return "Free";

    }


    return (
        "+ " +
        formatPeso(amount)
    );

}


/* ==========================================================
   SETUP VIEW MORE
========================================================== */

function setupViewMore(
    containerId,
    buttonId
){

    const container =
        document.getElementById(
            containerId
        );


    const button =
        document.getElementById(
            buttonId
        );


    if(
        !container ||
        !button
    ){

        return;

    }


    const hidden =
        container.querySelectorAll(
            ".hidden-option"
        );


    if(
        hidden.length
    ){

        button.style.display =
            "flex";

    }else{

        button.style.display =
            "none";

    }

}


/* ==========================================================
   RESET VIEW MORE
========================================================== */

function resetCustomizationOptionsVisibility(){

    const containers = [

        "drinkCustomizationOptions",

        "addonCustomizationOptions"

    ];


    containers.forEach(
        function(id){

            const container =
                document.getElementById(
                    id
                );


            if(!container){

                return;

            }


            const hidden =
                container.querySelectorAll(
                    ".hidden-option"
                );


            hidden.forEach(
                function(option){

                    option.style.display =
                        "none";

                }
            );

        }
    );


    resetViewMoreButtons();

}


/* ==========================================================
   VIEW MORE INITIALIZER
========================================================== */

function initializeCustomizationViewMore(){

    setupViewMore(
        "drinkCustomizationOptions",
        "drinkViewMore"
    );


    setupViewMore(
        "addonCustomizationOptions",
        "addonViewMore"
    );

}


/* ==========================================================
   PATCH OPEN FUNCTION
========================================================== */

const originalOpenProductCustomization =
    window.openProductCustomization;


/*
   Keep the original function available,
   then refresh the option visibility after opening.
*/

window.openProductCustomization =
    function(product){

        if(
            typeof originalOpenProductCustomization ===
            "function"
        ){

            originalOpenProductCustomization(
                product
            );

        }


        setTimeout(
            function(){

                initializeCustomizationViewMore();

                updateSelectedDrinkUI();

                updateSelectedAddonUI();

            },
            50
        );

    };


/* ==========================================================
   END PART 5
========================================================== */

/* ==========================================================
   PAPPRITO WEB V5
   PRODUCT CUSTOMIZATION MODULE
   PART : 7
   PRODUCT CARD CONNECTION
========================================================== */


/* ==========================================================
   CHECK IF PRODUCT HAS CUSTOMIZATION
========================================================== */

function productHasCustomization(product){

    if(!product){

        return false;

    }


    const customization =
        product.customizations ||
        product.customization ||
        product.options;


    if(!customization){

        return false;

    }


    const drinks =
        customization.drinks ||
        customization.drink;


    const addons =
        customization.addOns ||
        customization.addons ||
        customization.sides;


    const hasDrinks =
        Array.isArray(drinks)
            ? drinks.length > 0
            : drinks &&
              Object.keys(drinks).length > 0;


    const hasAddons =
        Array.isArray(addons)
            ? addons.length > 0
            : addons &&
              Object.keys(addons).length > 0;


    return (
        hasDrinks ||
        hasAddons
    );

}


/* ==========================================================
   OPEN PRODUCT
========================================================== */

function handleProductSelection(product){

    if(!product){

        console.warn(
            "Product data is missing."
        );

        return;

    }


    /*
       If the product has customization,
       open the customization panel.
    */

    if(
        productHasCustomization(
            product
        )
    ){

        window.openProductCustomization(
            product
        );

        return;

    }


    /*
       If the product has no customization,
       keep the existing menu/cart behavior.
    */

    if(
        typeof window.addToCart ===
        "function"
    ){

        window.addToCart(
            product
        );

        return;

    }


    if(
        typeof window.addProductToCart ===
        "function"
    ){

        window.addProductToCart(
            product
        );

        return;

    }


    console.warn(
        "Existing cart function was not found.",
        product
    );

}


/* ==========================================================
   GLOBAL PRODUCT SELECTION
========================================================== */

window.handleProductSelection =
    handleProductSelection;


/* ==========================================================
   GLOBAL CUSTOMIZATION CHECK
========================================================== */

window.productHasCustomization =
    productHasCustomization;


/* ==========================================================
   PRODUCT CARD HELPER
========================================================== */

function connectProductCard(
    card,
    product
){

    if(
        !card ||
        !product
    ){

        return;

    }


    /*
       Store the product object on the card.
    */

    card.__pappritoProduct =
        product;


    /*
       Mark card as customizable.
    */

    if(
        productHasCustomization(
            product
        )
    ){

        card.dataset.hasCustomization =
            "true";

    }else{

        card.dataset.hasCustomization =
            "false";

    }


    /*
       Find common product buttons.
    */

    const buttons =
        card.querySelectorAll(
            `
            .add-to-cart,
            .add-cart-btn,
            .product-add-btn,
            .menu-add-btn,
            [data-add-cart],
            [data-action="add-cart"]
            `
        );


    buttons.forEach(
        function(button){

            /*
               Prevent duplicate listeners.
            */

            if(
                button.dataset.customizationConnected ===
                "true"
            ){

                return;

            }


            button.dataset.customizationConnected =
                "true";


            button.addEventListener(
                "click",
                function(event){

                    /*
                       Only intercept products
                       that actually have options.
                    */

                    if(
                        !productHasCustomization(
                            product
                        )
                    ){

                        return;

                    }


                    event.preventDefault();

                    event.stopPropagation();


                    handleProductSelection(
                        product
                    );

                },
                true
            );

        }
    );

}


/* ==========================================================
   CONNECT ALL PRODUCT CARDS
========================================================== */

function connectAllProductCards(){

    const cards =
        document.querySelectorAll(
            `
            .product-card,
            .menu-product-card,
            .menu-card,
            [data-product-card]
            `
        );


    cards.forEach(
        function(card){

            /*
               If menu.js placed the product
               object on the card, use it.
            */

            if(
                card.__pappritoProduct
            ){

                connectProductCard(
                    card,
                    card.__pappritoProduct
                );

            }

        }
    );

}


/* ==========================================================
   OBSERVE NEW PRODUCT CARDS
========================================================== */

function observeProductCards(){

    const container =
        document.getElementById(
            "menu-products"
        );


    if(!container){

        return;

    }


    const observer =
        new MutationObserver(
            function(){

                connectAllProductCards();

            }
        );


    observer.observe(
        container,
        {
            childList:true,
            subtree:true
        }
    );

}


/* ==========================================================
   INITIALIZE CARD CONNECTION
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        setTimeout(
            function(){

                connectAllProductCards();

                observeProductCards();

            },
            300
        );

    }
);


/* ==========================================================
   MANUAL CARD CONNECTION API
========================================================== */

window.connectProductCard =
    connectProductCard;


window.connectAllProductCards =
    connectAllProductCards;


/* ==========================================================
   OPTIONAL DIRECT BUTTON API
========================================================== */

window.openProductForCustomization =
    function(product){

        if(!product){

            return;

        }


        handleProductSelection(
            product
        );

    };


/* ==========================================================
   END PART 7
========================================================== */

/* ==========================================================
   PAPPRITO WEB V5
   PRODUCT CUSTOMIZATION MODULE
   PART : 8
   CART INTEGRATION
========================================================== */


/* ==========================================================
   BUILD CUSTOMIZED CART ITEM
========================================================== */

function buildCustomizedCartItem(){

    if(!customizationProduct){

        return null;

    }


    const basePrice =
        getProductPrice(
            customizationProduct
        );


    const drink =
        selectedDrink
            ? {
                id:
                    selectedDrink.id || null,

                name:
                    selectedDrink.name || "",

                price:
                    Number(
                        selectedDrink.price
                    ) || 0
            }
            : null;


    const addons =
        selectedAddons.map(
            function(addon){

                return {

                    id:
                        addon.id || null,

                    name:
                        addon.name || "",

                    price:
                        Number(
                            addon.price
                        ) || 0

                };

            }
        );


    const drinkPrice =
        drink
            ? drink.price
            : 0;


    const addonPrice =
        addons.reduce(
            function(total, addon){

                return (
                    total +
                    addon.price
                );

            },
            0
        );


    const unitPrice =
        basePrice +
        drinkPrice +
        addonPrice;


    const totalPrice =
        unitPrice *
        customizationQuantity;


    return {

        /* ==============================================
           PRODUCT
        =============================================== */

        productId:
            customizationProduct.id ||
            customizationProduct.productId ||
            customizationProduct.key ||
            null,

        name:
            getProductName(
                customizationProduct
            ),

        image:
            getProductImage(
                customizationProduct
            ),

        category:
            getProductCategory(
                customizationProduct
            ),

        description:
            getProductDescription(
                customizationProduct
            ),


        /* ==============================================
           PRICING
        =============================================== */

        basePrice:
            basePrice,

        unitPrice:
            unitPrice,

        price:
            unitPrice,

        total:
            totalPrice,


        /* ==============================================
           QUANTITY
        =============================================== */

        quantity:
            customizationQuantity,


        /* ==============================================
           CUSTOMIZATION
        =============================================== */

        customization: {

            drink:
                drink,

            addons:
                addons

        },


        /* ==============================================
           ADD-ON SUMMARY
        =============================================== */

        selectedDrink:
            drink,

        selectedAddons:
            addons,


        /* ==============================================
           TIMESTAMP
        =============================================== */

        addedAt:
            new Date().toISOString()

    };

}


/* ==========================================================
   ADD CUSTOMIZED PRODUCT TO CART
========================================================== */

function addCustomizedProductToCart(){

    if(!customizationProduct){

        return;

    }


    /* ==============================================
       REQUIRED DRINK VALIDATION
    =============================================== */

    if(
        !selectedDrink
    ){

        showDrinkError();

        const drinkGroup =
            document.getElementById(
                "drinkCustomizationGroup"
            );


        if(drinkGroup){

            drinkGroup.scrollIntoView({
                behavior:"smooth",
                block:"center"
            });

        }

        return;

    }


    /* ==============================================
       BUILD CART ITEM
    =============================================== */

    const cartItem =
        buildCustomizedCartItem();


    if(!cartItem){

        return;

    }


    /* ==============================================
       SEND TO EXISTING CART
    =============================================== */

    let added = false;


    /*
       Existing global cart functions
       are checked first.
    */

    if(
        typeof window.addCustomizedItemToCart ===
        "function"
    ){

        window.addCustomizedItemToCart(
            cartItem
        );

        added = true;

    }


    else if(
        typeof window.addToCart ===
        "function"
    ){

        /*
           Existing cart function receives
           the complete customized object.
        */

        window.addToCart(
            cartItem
        );

        added = true;

    }


    else if(
        typeof window.addProductToCart ===
        "function"
    ){

        window.addProductToCart(
            cartItem
        );

        added = true;

    }


    else{

        /*
           Temporary fallback.
           This keeps the customized cart item
           available even if the existing cart
           function has not been connected yet.
        */

        saveCustomizedCartFallback(
            cartItem
        );

        added = true;

    }


    if(!added){

        return;

    }


    /* ==============================================
       SUCCESS UI
    =============================================== */

    showCustomizationSuccess();


    /* ==============================================
       BUTTON STATE
    =============================================== */

    setCustomizationButtonSuccess();


    /* ==============================================
       CLOSE AFTER SHORT DELAY
    =============================================== */

    setTimeout(
        function(){

            closeProductCustomization();

        },
        650
    );

}


/* ==========================================================
   CUSTOMIZED CART FALLBACK
========================================================== */

function saveCustomizedCartFallback(
    cartItem
){

    const storageKey =
        "pappritoCart";


    let cart = [];


    try{

        const saved =
            localStorage.getItem(
                storageKey
            );


        if(saved){

            const parsed =
                JSON.parse(
                    saved
                );


            if(
                Array.isArray(parsed)
            ){

                cart =
                    parsed;

            }

        }

    }catch(error){

        console.warn(
            "Unable to read PAPPRITO cart.",
            error
        );

    }


    /*
       Create a unique cart line.
    */

    cartItem.cartItemId =
        createCustomizedCartId(
            cartItem
        );


    cart.push(
        cartItem
    );


    try{

        localStorage.setItem(
            storageKey,
            JSON.stringify(cart)
        );

    }catch(error){

        console.error(
            "Unable to save PAPPRITO cart.",
            error
        );

    }

}


/* ==========================================================
   CREATE CART ITEM ID
========================================================== */

function createCustomizedCartId(
    item
){

    const productId =
        item.productId ||
        "product";


    const drinkId =
        item.selectedDrink
            ? item.selectedDrink.id
            : "nodrink";


    const addonIds =
        item.selectedAddons
            .map(
                function(addon){

                    return addon.id;

                }
            )
            .sort()
            .join("-") ||
        "noaddons";


    return (

        productId +
        "-" +
        drinkId +
        "-" +
        addonIds +
        "-" +
        Date.now()

    );

}


/* ==========================================================
   SUCCESS MESSAGE
========================================================== */

function showCustomizationSuccess(){

    const success =
        document.getElementById(
            "customizationSuccess"
        );


    if(!success){

        return;

    }


    success.classList.add(
        "show"
    );

}


/* ==========================================================
   SUCCESS BUTTON STATE
========================================================== */

function setCustomizationButtonSuccess(){

    const button =
        document.getElementById(
            "customizationAddBtn"
        );


    if(!button){

        return;

    }


    button.classList.remove(
        "loading"
    );


    button.classList.add(
        "added"
    );


    button.disabled =
        true;


    button.innerHTML = `

        <i class="fa-solid fa-check"></i>

        <span>
            Added to cart
        </span>

    `;

}


/* ==========================================================
   RESET ADD BUTTON
========================================================== */

function resetCustomizationAddButton(){

    const button =
        document.getElementById(
            "customizationAddBtn"
        );


    if(!button){

        return;

    }


    button.classList.remove(
        "loading",
        "added"
    );


    button.innerHTML = `

        <span>
            Add to cart
        </span>

        <strong
            id="customizationAddTotal"
            class="customization-add-total">

            ₱0.00

        </strong>

    `;


    /*
       Recalculate because innerHTML
       recreated the total element.
    */

    updateCustomizationTotal();

}


/* ==========================================================
   PATCH OPEN FOR BUTTON RESET
========================================================== */

const previousCustomizationOpen =
    window.openProductCustomization;


window.openProductCustomization =
    function(product){

        if(
            typeof previousCustomizationOpen ===
            "function"
        ){

            previousCustomizationOpen(
                product
            );

        }


        setTimeout(
            function(){

                resetCustomizationAddButton();

                clearCustomizationErrors();

                updateCustomizationQuantity();

                updateCustomizationTotal();

            },
            60
        );

    };


/* ==========================================================
   GLOBAL CART FUNCTION
========================================================== */

window.addCustomizedProductToCart =
    addCustomizedProductToCart;


/* ==========================================================
   GET CURRENT CUSTOMIZATION
========================================================== */

window.getCurrentCustomization =
    function(){

        return {

            product:
                customizationProduct,

            quantity:
                customizationQuantity,

            drink:
                selectedDrink,

            addons:
                selectedAddons

        };

    };


/* ==========================================================
   END PART 8
========================================================== */

/* ==========================================================
   PAPPRITO WEB V5
   PRODUCT CUSTOMIZATION MODULE
   PART : 9
   FIREBASE CUSTOMIZATION SUPPORT
========================================================== */


/* ==========================================================
   FIREBASE CUSTOMIZATION PATH
========================================================== */

const CUSTOMIZATION_FIREBASE_PATH =
    "productCustomizations";


/* ==========================================================
   GET FIREBASE DATABASE
========================================================== */

function getCustomizationDatabase(){

    if(
        typeof firebase === "undefined"
    ){

        console.warn(
            "Firebase SDK is not loaded."
        );

        return null;

    }


    if(
        typeof firebase.database !==
        "function"
    ){

        console.warn(
            "Firebase Realtime Database is not available."
        );

        return null;

    }


    try{

        return firebase.database();

    }catch(error){

        console.error(
            "Unable to initialize Firebase Database.",
            error
        );

        return null;

    }

}


/* ==========================================================
   LOAD CUSTOMIZATION FROM FIREBASE
========================================================== */

async function loadFirebaseCustomization(
    product
){

    if(!product){

        return null;

    }


    const database =
        getCustomizationDatabase();


    if(!database){

        return null;

    }


    const productId =
        product.id ||
        product.productId ||
        product.key;


    if(!productId){

        console.warn(
            "Product ID is required for customization."
        );

        return null;

    }


    try{

        /*
           Primary path:

           productCustomizations/{productId}
        */

        const snapshot =
            await database
                .ref(
                    CUSTOMIZATION_FIREBASE_PATH +
                    "/" +
                    productId
                )
                .once("value");


        if(
            snapshot.exists()
        ){

            return snapshot.val();

        }


        /*
           If no separate customization
           record exists, use the data
           already stored inside the product.
        */

        return (
            product.customizations ||
            null
        );

    }catch(error){

        console.error(
            "Failed to load product customization.",
            error
        );

        return null;

    }

}


/* ==========================================================
   MERGE FIREBASE CUSTOMIZATION
========================================================== */

async function prepareProductCustomization(
    product
){

    if(!product){

        return product;

    }


    const firebaseData =
        await loadFirebaseCustomization(
            product
        );


    if(!firebaseData){

        return product;

    }


    return {

        ...product,

        customizations:
            firebaseData

    };

}


/* ==========================================================
   OPEN PRODUCT WITH FIREBASE DATA
========================================================== */

async function openProductWithCustomization(
    product
){

    if(!product){

        return;

    }


    /*
       Load customization data first.
    */

    const preparedProduct =
        await prepareProductCustomization(
            product
        );


    /*
       Then open the existing modal.
    */

    if(
        typeof window.openProductCustomization ===
        "function"
    ){

        window.openProductCustomization(
            preparedProduct
        );

    }

}


/* ==========================================================
   LOAD CUSTOMIZATION OPTIONS
========================================================== */

async function refreshProductCustomizationOptions(){

    if(!customizationProduct){

        return;

    }


    const preparedProduct =
        await prepareProductCustomization(
            customizationProduct
        );


    customizationProduct =
        preparedProduct;


    renderDrinkOptions();

    renderAddonOptions();

    updateCustomizationTotal();

}


/* ==========================================================
   FIREBASE AVAILABILITY CHECK
========================================================== */

function customizationFirebaseAvailable(){

    const database =
        getCustomizationDatabase();


    return Boolean(
        database
    );

}


/* ==========================================================
   SAVE CUSTOMIZATION
   ADMIN / ERP USE
========================================================== */

async function saveProductCustomization(
    productId,
    customizationData
){

    if(!productId){

        throw new Error(
            "Product ID is required."
        );

    }


    if(!customizationData){

        throw new Error(
            "Customization data is required."
        );

    }


    const database =
        getCustomizationDatabase();


    if(!database){

        throw new Error(
            "Firebase Database is not available."
        );

    }


    const path =
        CUSTOMIZATION_FIREBASE_PATH +
        "/" +
        productId;


    await database
        .ref(path)
        .set(
            customizationData
        );


    return true;

}


/* ==========================================================
   DELETE CUSTOMIZATION
   ADMIN / ERP USE
========================================================== */

async function deleteProductCustomization(
    productId
){

    if(!productId){

        throw new Error(
            "Product ID is required."
        );

    }


    const database =
        getCustomizationDatabase();


    if(!database){

        throw new Error(
            "Firebase Database is not available."
        );

    }


    await database
        .ref(
            CUSTOMIZATION_FIREBASE_PATH +
            "/" +
            productId
        )
        .remove();


    return true;

}


/* ==========================================================
   GET CUSTOMIZATION DIRECTLY
========================================================== */

async function getProductCustomization(
    productId
){

    if(!productId){

        return null;

    }


    const database =
        getCustomizationDatabase();


    if(!database){

        return null;

    }


    try{

        const snapshot =
            await database
                .ref(
                    CUSTOMIZATION_FIREBASE_PATH +
                    "/" +
                    productId
                )
                .once("value");


        return snapshot.exists()
            ? snapshot.val()
            : null;

    }catch(error){

        console.error(
            "Unable to get customization.",
            error
        );

        return null;

    }

}


/* ==========================================================
   GLOBAL API
========================================================== */

window.loadFirebaseCustomization =
    loadFirebaseCustomization;


window.prepareProductCustomization =
    prepareProductCustomization;


window.openProductWithCustomization =
    openProductWithCustomization;


window.refreshProductCustomizationOptions =
    refreshProductCustomizationOptions;


window.customizationFirebaseAvailable =
    customizationFirebaseAvailable;


window.saveProductCustomization =
    saveProductCustomization;


window.deleteProductCustomization =
    deleteProductCustomization;


window.getProductCustomization =
    getProductCustomization;


/* ==========================================================
   END PART 9
========================================================== */
