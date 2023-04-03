import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";
import {
  getDatabase,
  set,
  get,
  ref,
  child,
  update,
  remove,
  push,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

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
const clouddb = getFirestore();

const insertHeader = document.querySelector(".insert-header");
const myImg = document.querySelector(".myimg");
const selectImgBtn = document.querySelector(".select-image-btn");
const insertText = document.querySelector(".insert-text");
const finalButton = document.querySelector(".uppload-all");
const proglab = document.querySelector(".proglab");

////////////////////////////////////////////////////
// SELECT IMAGE
///////////////////////////////////////////////////

let files = [];
let reader = new FileReader();

const input = document.createElement("input");
input.type = "file";

input.onchange = (e) => {
  files = e.target.files;

  reader.readAsDataURL(files[0]);
};

reader.onload = function () {
  myImg.src = reader.result;
};

selectImgBtn.addEventListener("click", function () {
  input.click();
});

/////////////////////////////////////////////////////
// UPLOAD //
/////////////////////////////////////////////////////
const upploadProcess = async function () {
  const imgToUpload = files[0];

  const metaData = {
    contentType: imgToUpload.type,
  };

  const storage = getStorage();
  const storageRef = sRef(storage, "project/images/");
  const uploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);

  uploadTask.on(
    "state-changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      proglab.innerHTML = "Upload" + progress + "%";
    },
    (error) => {
      alert(`${error} image not uploaded!`);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          setDataToDB(downloadURL);
        })
        .catch((error) => {
          alert(error);
        });
    }
  );
};

/////////////////////////////////////////////////////

/////////////////////////////////////////////////////

/////////////////////////////////////////////////////

/////////////////////////////////////////////////////

////////////////////////////////////////////
// SET TO REALTIME DATABASE
////////////////////////////////////////////

const setDataToDB = function (URL) {
  const dbRef = ref(db, "project/");
  const newDataRef = push(dbRef);

  set(newDataRef, {
    Text: insertText.value,

    Header: insertHeader.value,
    ImgUrl: URL,
  })
    .then(() => {
      alert("Data successfuly added!");
    })
    .catch((error) => {
      alert(error);
    });
};

finalButton.addEventListener("click", function () {
  upploadProcess();
});

// function saveURLtoRealtimeDB(URL) {
//   set(ref(db, "imagesLinks/"), {
//     ImgUrl: URL,
//   });
// }
