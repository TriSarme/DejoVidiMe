import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getDatabase,
  set,
  get,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

const container = document.querySelector(".container-read");

const rootRef = ref(db, "project/");
get(rootRef).then(function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    const render = function () {
      const snap = childSnapshot.val();
      const snap1 = snap.Text.slice(0, 150);
      const snap2 = snap.Text.slice(150, -1);

      // const image = (myImg.src = snap.ImgUrl);
      // const headers = (header.innerHTML = snap.Header);
      // const texts = (text.innerHTML = snap.Text);

      const html = `
      <div class="card">
      <h1>${snap.Header}</h1>
      <img src=${snap.ImgUrl} class="myimg">
      <div class="card-body">
        <p>
          ${snap1} <span class="dots">....</span>
          <div class="more">
            <p>${snap2}
            </p>
          </div>
        </p>
        ${
          snap.Text.length > 150
            ? '<button class="btn">Read more...</button>'
            : ""
        }
      </div>
    </div>
        `;
      container.insertAdjacentHTML("afterbegin", html);
    };
    render();
  });
});

parent.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn")) {
    const dots = document.querySelector(".dots");
    const moretext = document.querySelector(".more");
    const btn = document.querySelector(".btn");

    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btn.innerHTML = "Read more";
      moretext.style.display = "none";
    } else {
      dots.style.display = "none";
      btn.innerHTML = "Read less";
      moretext.style.display = "inline";
    }
  }
});
