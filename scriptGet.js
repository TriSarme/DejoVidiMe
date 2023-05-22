"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

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

// AUTHENTIFICATION //

const userEmail = document.querySelector(".userEmail");
const userPassword = document.querySelector(".userPassword");
const authForm = document.querySelector(".authForm");
const mainContent = document.querySelector(".main-content");
const list = document.querySelector(".list");
const signInButton = document.querySelector(".signInButton");
const signUpButton = document.querySelector(".signUpButton");
const signOutButton = document.querySelector(".signOutBtn");

mainContent.style.display = "none";
list.style.display = "none";

const userSignUp = async () => {
  const signUpEmail = userEmail.value;
  const signUpPassword = userPassword.value;
  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      alert("Your account has been created");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

const userSignIn = async () => {
  const signinEmail = userEmail.value;
  const signinPassword = userPassword.value;
  signInWithEmailAndPassword(auth, signinEmail, signinPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("You have signed in succsessfully");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

const checkAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authForm.style.display = "none";
      mainContent.style.display = "flex";
      list.style.display = "flex";
      signOutButton.style.display = "block";
    } else {
      authForm.style.display = "block";
      mainContent.style.display = "none";
      list.style.display = "none";
      signOutButton.style.display = "none";
    }
  });
};

const userSignOut = async () => {
  await signOut(auth);
};

checkAuthState();

signUpButton.addEventListener("click", userSignUp);
signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);

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
            ${snap1} <span class="dots">....</span>
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
