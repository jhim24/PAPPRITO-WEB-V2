/* ==========================================================
   PAPPRITO WEB V2
   Version : 1.5.2
   File : assets/js/firebase-config.js
   Description : Firebase Configuration
========================================================== */

/* ==========================================================
   FIREBASE CONFIG
========================================================== */

const firebaseConfig = {

    apiKey: "",

    authDomain: "",

    databaseURL: "",

    projectId: "",

    storageBucket: "",

    messagingSenderId: "",

    appId: ""

};

/* ==========================================================
   INITIALIZE FIREBASE
========================================================== */

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const auth = firebase.auth();

const storage = firebase.storage();
