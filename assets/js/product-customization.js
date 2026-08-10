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




