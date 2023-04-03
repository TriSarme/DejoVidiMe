import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";

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
const db = getDatabase();

// const mainHeader = document.querySelector(".main-header");

// const getHeadingData = function () {
//   const dbRef = ref(db);

//   get(dbRef, "heading/")
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         mainHeader.innerHTML = snapshot.val().heading.Header;
//       } else {
//         alert("No data found");
//       }
//     })
//     .catch((error) => {
//       alert(error);
//     });
// };

// getHeadingData();

const text = document.querySelector(".card__read-more");
const cardHolder = document.querySelector(".card-holder");
const inputText = document.querySelector(".input-text");

cardHolder.addEventListener("click", (e) => {
  const current = e.target;
  const isReadMoreBtn = current.className.includes("read-more-btn");

  if (!isReadMoreBtn) return;
  const currentText = e.target.parentNode.querySelector(".card__read-more");
  currentText.classList.toggle("card__read-more--open");
  current.textContent = current.textContent.includes("Read More...")
    ? "Read Less..."
    : "Read More...";
});

const getPictureTextData = function () {
  const dbRef = ref(db);

  get(dbRef, "pictureText/")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const snap = snapshot.val().pictureText.Text;
        const snap1 = snap.slice(0, 150);
        const snap2 = snap.slice(150, -1);
        if (snap.length > 150) inputText.innerHTML = snap1;
        text.innerHTML = snap2;
      } else {
        alert("No data found");
      }
    })
    .catch((error) => {
      alert(error);
    });
};

getPictureTextData();

var myImg = document.getElementById("myimg");

async function getURLfromRealtimeDB() {
  // var name = namebox.value;
  var dbRef = ref(db, "imagesLinks/");

  get(dbRef).then((snapshot) => {
    if (snapshot.exists()) {
      myImg.src = snapshot.val().img1.ImgUrl;
    }
  });
}
getURLfromRealtimeDB();
