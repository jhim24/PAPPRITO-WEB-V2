/* ==========================================================
   PAPPRITO WEB V5
   File        : reservation.js
   Description : Reservation Module
   Version     : 5.0.0
========================================================== */


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const bookingForm =
            document.getElementById(
                "bookingForm"
            );


        if(!bookingForm){

            return;

        }


        /* ==================================================
           SET MINIMUM DATE
        ================================================== */

        setMinimumReservationDate();


        /* ==================================================
           FORM SUBMIT
        ================================================== */

        bookingForm.addEventListener(
            "submit",
            reserveTable
        );

    }
);


/* ==========================================================
   SET MINIMUM RESERVATION DATE
========================================================== */

function setMinimumReservationDate(){

    const dateInput =
        document.getElementById(
            "date"
        );


    if(!dateInput){

        return;

    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    dateInput.min =
        `${year}-${month}-${day}`;

}


/* ==========================================================
   RESERVE TABLE
========================================================== */

async function reserveTable(e){

    e.preventDefault();


    /* ======================================================
       ELEMENTS
    ====================================================== */

    const bookingForm =
        document.getElementById(
            "bookingForm"
        );


    const sendButton =
        document.getElementById(
            "sendReservationBtn"
        );


    const statusBox =
        document.getElementById(
            "reservationStatus"
        );


    const fullnameInput =
        document.getElementById(
            "fullname"
        );


    const mobileInput =
        document.getElementById(
            "mobile"
        );


    const emailInput =
        document.getElementById(
            "email"
        );


    const branchInput =
        document.getElementById(
            "branch"
        );


    const dateInput =
        document.getElementById(
            "date"
        );


    const timeInput =
        document.getElementById(
            "time"
        );


    const guestsInput =
        document.getElementById(
            "guests"
        );


    const messageInput =
        document.getElementById(
            "message"
        );


    const agreeInput =
        document.getElementById(
            "reservationAgree"
        );


    /* ======================================================
       GET VALUES
    ====================================================== */

    const fullname =
        fullnameInput
            ? fullnameInput.value.trim()
            : "";


    const mobile =
        mobileInput
            ? mobileInput.value.trim()
            : "";


    const email =
        emailInput
            ? emailInput.value.trim()
            : "";


    const branch =
        branchInput
            ? branchInput.value
            : "";


    const date =
        dateInput
            ? dateInput.value
            : "";


    const time =
        timeInput
            ? timeInput.value
            : "";


    const guests =
        guestsInput
            ? guestsInput.value
            : "";


    const message =
        messageInput
            ? messageInput.value.trim()
            : "";


    /* ======================================================
       VALIDATION
    ====================================================== */

    if(fullname === ""){

        showReservationStatus(
            "error",
            "Please enter your full name."
        );

        fullnameInput?.focus();

        return;

    }


    if(mobile === ""){

        showReservationStatus(
            "error",
            "Please enter your mobile number."
        );

        mobileInput?.focus();

        return;

    }


    if(branch === ""){

        showReservationStatus(
            "error",
            "Please select a branch."
        );

        branchInput?.focus();

        return;

    }


    if(date === ""){

        showReservationStatus(
            "error",
            "Please select your reservation date."
        );

        dateInput?.focus();

        return;

    }


    if(time === ""){

        showReservationStatus(
            "error",
            "Please select your reservation time."
        );

        timeInput?.focus();

        return;

    }


    if(guests === ""){

        showReservationStatus(
            "error",
            "Please select the number of guests."
        );

        guestsInput?.focus();

        return;

    }


    if(
        agreeInput &&
        !agreeInput.checked
    ){

        showReservationStatus(
            "error",
            "Please confirm that the reservation information is correct."
        );

        agreeInput.focus();

        return;

    }


    /* ======================================================
       CHECK DATE
    ====================================================== */

    const selectedDate =
        new Date(
            `${date}T00:00:00`
        );


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    if(selectedDate < today){

        showReservationStatus(
            "error",
            "Please select today or a future reservation date."
        );

        dateInput?.focus();

        return;

    }


    /* ======================================================
       FIREBASE CHECK
    ====================================================== */

    if(
        typeof firebase ===
        "undefined"
    ){

        showReservationStatus(
            "error",
            "Reservation system is currently unavailable. Please try again later."
        );

        console.error(
            "Firebase SDK is not loaded."
        );

        return;

    }


    if(
        !firebase.apps ||
        firebase.apps.length === 0
    ){

        showReservationStatus(
            "error",
            "Reservation system is not connected to Firebase."
        );

        console.error(
            "Firebase has not been initialized."
        );

        return;

    }


    /* ======================================================
       BUTTON LOADING
    ====================================================== */

    const originalButtonHTML =
        sendButton
            ? sendButton.innerHTML
            : "";


    if(sendButton){

        sendButton.disabled =
            true;


        sendButton.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            <span>
                Sending Reservation...
            </span>

        `;

    }


    /* ======================================================
       RESERVATION ID
    ====================================================== */

    const reservationRef =
        firebase
            .database()
            .ref("reservations")
            .push();


    const reservationId =
        reservationRef.key;


    /* ======================================================
       RESERVATION OBJECT
    ====================================================== */

    const reservation = {

        reservationId:

            reservationId,

        fullname:

            fullname,

        mobile:

            mobile,

        email:

            email,

        branch:

            branch,

        date:

            date,

        time:

            time,

        guests:

            Number(guests),

        message:

            message,

        status:

            "Pending",

        createdAt:

            new Date()
                .toISOString(),

        timestamp:

            firebase
                .database
                .ServerValue
                .TIMESTAMP

    };


    /* ======================================================
       SAVE TO FIREBASE
    ====================================================== */

    try{

        await reservationRef.set(
            reservation
        );


        /* ==============================================
           SUCCESS
        =============================================== */

        showReservationStatus(
            "success",
            `
            <strong>Reservation Request Sent!</strong><br>
            Thank you, ${escapeHTML(fullname)}.
            Your reservation request has been received.
            Our staff will contact you to confirm your booking.
            `
        );


        /* ==============================================
           RESET FORM
        =============================================== */

        bookingForm.reset();


        /* ==============================================
           RESTORE DATE MINIMUM
        =============================================== */

        setMinimumReservationDate();


        /* ==============================================
           SCROLL STATUS INTO VIEW
        =============================================== */

        if(statusBox){

            statusBox.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "center"

            });

        }


    }catch(error){

        console.error(
            "Reservation save error:",
            error
        );


        showReservationStatus(
            "error",
            "We could not send your reservation. Please try again."
        );

    }


    /* ======================================================
       RESTORE BUTTON
    ====================================================== */

    if(sendButton){

        sendButton.disabled =
            false;

        sendButton.innerHTML =
            originalButtonHTML;

    }

}


/* ==========================================================
   SHOW RESERVATION STATUS
========================================================== */

function showReservationStatus(
    type,
    message
){

    const statusBox =
        document.getElementById(
            "reservationStatus"
        );


    if(!statusBox){

        alert(
            message.replace(
                /<[^>]*>/g,
                ""
            )
        );

        return;

    }


    statusBox.className =
        "reservation-status " +
        type;


    statusBox.innerHTML =
        message;


    statusBox.style.display =
        "block";

}


/* ==========================================================
   ESCAPE HTML
========================================================== */

function escapeHTML(value){

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* ==========================================================
   END RESERVATION MODULE
========================================================== */
