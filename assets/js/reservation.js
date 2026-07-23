/* ==========================================================
   PAPPRITO WEB V3
   File        : reservation.js
   Description : Reservation Module
   Version     : 3.0.0
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) return;

    bookingForm.addEventListener("submit", reserveTable);

});

/* ==========================================================
   RESERVE TABLE
========================================================== */

function reserveTable(e){

    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();

    const mobile = document.getElementById("mobile").value.trim();

    const email = document.getElementById("email").value.trim();

    const branch = document.getElementById("branch").value;

    const date = document.getElementById("date").value;

    const time = document.getElementById("time").value;

    const guests = document.getElementById("guests").value;

    const occasion = document.getElementById("occasion").value;

    const request = document.getElementById("request").value.trim();

    /* ======================================================
       VALIDATION
    ====================================================== */

    if(fullname===""){

        alert("Please enter your Full Name.");

        return;

    }

    if(mobile===""){

        alert("Please enter your Mobile Number.");

        return;

    }

    if(branch===""){

        alert("Please select a Branch.");

        return;

    }

    if(date===""){

        alert("Please select a Reservation Date.");

        return;

    }

    if(time===""){

        alert("Please select a Reservation Time.");

        return;

    }

    if(Number(guests) < 1){

        alert("Invalid number of guests.");

        return;

    }

    /* ======================================================
       RESERVATION OBJECT
    ====================================================== */

    const reservation = {

        fullname,

        mobile,

        email,

        branch,

        date,

        time,

        guests,

        occasion,

        request,

        status: "Pending",

        createdAt: new Date().toISOString()

    };

    console.log("Reservation", reservation);

    /* ======================================================
       SUCCESS
    ====================================================== */

    alert(

`Thank you, ${fullname}!

Your reservation request has been received.

Branch : ${branch}

Date : ${date}

Time : ${time}

Guests : ${guests}

Our staff will contact you shortly to confirm your reservation.`

    );

    bookingForm.reset();

    document.getElementById("guests").value = 2;

}

/* ==========================================================
   END
========================================================== */
