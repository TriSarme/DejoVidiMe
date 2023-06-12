"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onValue,
  equalTo,
  orderByChild,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getRedirectResult,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyAM6i40yksJqZPECQTaO3j2ME2JJkvDwGk",
  authDomain: "react-99aff.firebaseapp.com",
  databaseURL: "https://react-99aff-default-rtdb.firebaseio.com",
  projectId: "react-99aff",
  storageBucket: "react-99aff.appspot.com",
  messagingSenderId: "737666992143",
  appId: "1:737666992143:web:9b4b0049f913dbae84fb7a",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const addAdminRole = httpsCallable(functions, "addAdminRole");

// AUTHENTICATION //

const signUpBtn = document.querySelector(".sign-up-button");
const signInBtn = document.querySelector(".sign-in-button");
const signOutBtn = document.querySelector(".sign-out-btn");
const mainContent = document.querySelector(".main-content");
const list = document.querySelector(".list");
const signupContainer = document.querySelector(".signup-container");
const registerBtn = document.querySelector(".register");
const form = document.querySelector(".authForm");

const makeAdmin = document.querySelector(".make-admin");
const adminContainer = document.querySelector(".make-admin_container");
const adminForm = document.querySelector(".admin-actions");
const lookAtPage = document.querySelector(".look-at_page");
const newFeature = document.querySelector(".add-new_feature");
const mainContentAdd = document.querySelector(".main-content_add");

mainContent.style.display = "none";
list.style.display = "none";

signUpBtn.addEventListener("click", function () {
  list.style.display = "none";
  mainContent.style.display = "none";
  signupContainer.style.display = "block";
});

const register = function () {
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;
  const fullName = document.querySelector(".full_name").value;

  if (validateEmail(email) === false || validatePassword(password) === false) {
    alert("Email or Password is invalid!");
    return;
  }
  if (validateField(fullName) === false) {
    alert("Full Name field is invalid!");
    return;
  }

  const databaseRef = ref(db, "users/" + Date.now());

  const userData = {
    email: email,
    full_name: fullName,
    last_login: Date.now(),
    password: password,
  };

  set(databaseRef, userData);

  signupContainer.style.display = "none";

  alert("User created");
};

const login = function (e) {
  e.preventDefault();
  let email = document.querySelector(".user-email").value;
  let password = document.querySelector(".user-password").value;

  const databaseRef = ref(db, "users/");
  let foundUser = false; // Variable to track if a matching user has been found

  get(databaseRef)
    .then((snapshot) => {
      const users = snapshot.val();

      const userFound = Object.entries(users).some(([userId, userData]) => {
        if (userData.email === email && userData.password === password) {
          const userRef = ref(db, "users/" + userId);

          const updates = {
            last_login: Date.now(),
          };

          update(userRef, updates)
            .then(() => {
              // Store user authentication state
              localStorage.setItem("userLoggedIn", "true");

              if (userData.admin === true) {
                makeAdmin.style.display = "flex";
              } else {
                makeAdmin.style.display = "none";
              }
              form.style.display = "none";
              mainContent.style.display = "flex";
              list.style.display = "flex";
              signOutBtn.style.display = "block";

              foundUser = true;
              alert("User logged in");
            })
            .catch((error) => {
              alert("Failed to update last login: " + error.message);
            });

          return true;
        }

        return false;
      });

      if (!userFound) {
        alert("Email or password incorrect");
      }
    })
    .catch((error) => {
      alert("Failed to retrieve user data: " + error.message);
    });
};

const logout = function (e) {
  e.preventDefault();
  form.style.display = "flex";
  mainContent.style.display = "none";
  list.style.display = "none";
  signOutBtn.style.display = "none";
  alert("Logout successful!");

  localStorage.removeItem("userLoggedIn");
};

// Check if user is logged in on page load
window.addEventListener("load", () => {
  // Check if user was previously logged in
  const userLoggedIn = localStorage.getItem("userLoggedIn");

  if (userLoggedIn) {
    form.style.display = "none";
    mainContent.style.display = "flex";
    list.style.display = "flex";
    signOutBtn.style.display = "block";
  } else {
    form.style.display = "flex";
    mainContent.style.display = "none";
    list.style.display = "none";
    signOutBtn.style.display = "none";
  }
});

signOutBtn.addEventListener("click", logout);
registerBtn.addEventListener("click", register);
signInBtn.addEventListener("click", login);
// login();

// Helper functions for validation

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateField(field) {
  return field.trim() !== "";
}

// MAIN CONTENT //
const container = document.querySelector(".container-read");

const rootRef = ref(db, "project/");
get(rootRef).then(function (snapshot) {
  let newsIndex = 0;
  snapshot.forEach(function (childSnapshot) {
    const render = function () {
      const snap = childSnapshot.val();
      const snap1 = snap.Text.slice(0, 150);
      const snap2 = snap.Text.slice(150, -1);

      const html = `
      <div>
      <div class="card">
        <h1>${snap.Header}</h1>
        <img src=${snap.ImgUrl} class="myimg">
        <div class="card-body">
          <p>
            ${snap1} <span class="dots">...</span>
            <div class="more" id="${newsIndex}"></p>
          <p>${snap2}
            </p>
          </div>
        </p>
       ${
         snap.Text.length > 150
           ? '<button class="btn" id="btnReadMore' +
             newsIndex +
             '" onclick="onReadMoreClicks(' +
             newsIndex +
             ')">Read more</button>'
           : ""
       }
        </div>
      </div>
      </div>
        `;

      container.insertAdjacentHTML("afterbegin", html);
    };
    newsIndex++;
    render();
  });
});

// Make admin //

mainContentAdd.style.display = "none";

makeAdmin.addEventListener("click", function () {
  mainContent.style.display = "none";
  adminContainer.style.display = "flex";
  mainContentAdd.style.display = "none";
});

lookAtPage.addEventListener("click", function () {
  mainContent.style.display = "flex";
  adminContainer.style.display = "none";
  mainContentAdd.style.display = "none";
});

newFeature.addEventListener("click", function () {
  mainContent.style.display = "none";
  adminContainer.style.display = "none";
  mainContentAdd.style.display = "flex";
});

adminForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const adminEmail = document.querySelector("#admin-email").value;

  const databaseRef = ref(db, "users/");

  get(databaseRef)
    .then((snapshot) => {
      const users = snapshot.val();

      const userFound = Object.entries(users).some(([userId, userData]) => {
        if (userData.email === adminEmail) {
          const userRef = ref(db, "users/" + userId);

          const updates = {
            admin: true,
          };

          update(userRef, updates)
            .then(() => {
              console.log("User is now an admin");
              alert("User is now an admin");
            })
            .catch((error) => {
              console.log("Failed to make user an admin: " + error.message);
              alert("Failed to make user an admin: " + error.message);
            });

          return true;
        }

        return false;
      });

      if (!userFound) {
        console.log("User not found");
        alert("User not found");
      }
    })
    .catch((error) => {
      console.log("Failed to retrieve user data: " + error.message);
      alert("Failed to retrieve user data: " + error.message);
    });
});
