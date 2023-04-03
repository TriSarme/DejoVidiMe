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

const inputHeader = document.querySelector(".header-input");
const insertHeadBtn = document.querySelector(".insert-header-btn");
const inputPictureText = document.querySelector(".picture-text-input");
const insertBtn = document.querySelector(".insert-button");

const sendMainHeader = function () {
  set(ref(db, "heading/"), {
    Header: inputHeader.value,
  })
    .then(() => {
      alert("Data successfuly added!");
    })
    .catch((error) => {
      alert(error);
    });
};

insertHeadBtn.addEventListener("click", sendMainHeader);

const sendPictureText = function () {
  set(ref(db, "pictureText/"), {
    Text: inputPictureText.value,
  })
    .then(() => {
      alert("Data successfuly added!");
    })
    .catch((error) => {
      alert(error);
    });
};

insertBtn.addEventListener("click", sendPictureText);

var files = [];
var reader = new FileReader();

var extlab = document.getElementById("extlab");
var myimg = document.getElementById("myimg");
var proglab = document.getElementById("upprogress");
var selBtn = document.getElementById("selbtn");
var upBtn = document.getElementById("upbtn");

var input = document.createElement("input");
input.type = "file";

input.onchange = (e) => {
  files = e.target.files;

  var extention = GetFileExt(files[0]);
  var name = GetFileName(files[0]);

  extlab.innerHTML = extention;

  reader.readAsDataURL(files[0]);
};

reader.onload = function () {
  myimg.src = reader.result;
};

///////////////////////////////////////////////////
///////////////////////////////////////////////////

selBtn.onclick = function () {
  input.click();
};

function GetFileExt(file) {
  var temp = file.name.split(".");
  var ext = temp.slice(temp.length - 1, temp.length);
  return "." + ext[0];
}

function GetFileName(file) {
  var temp = file.name.split(".");
  var fname = temp.slice(0, -1).join(".");
  return fname;
}

/////////////////////////////////////////////////////
// UPLOAD //
/////////////////////////////////////////////////////

async function UploadProcess() {
  var ImgToUpload = files[0];

  // if (!validateName()) {
  //   alert('name cannot contain ".", "#", "$", "[", or "]"');
  //   return;
  // }

  const metaData = {
    contentType: ImgToUpload.type,
  };

  const storage = getStorage();

  const storageRef = sRef(storage, "Images/");

  const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

  UploadTask.on(
    "state-changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      proglab.innerHTML = "Upload" + progress + "%";
    },
    (error) => {
      alert(`${error} image not uploaded!`);
    },
    () => {
      getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
        saveURLtoRealtimeDB(downloadURL);
      });
    }
  );
}

/////////////////////////////////////////////
// FUNCTION FOR STORAGE//
/////////////////////////////////////////////

// async function saveURLtoFirestore(url) {
//   var name = namebox.value;
//   var ext = extlab.innerHTML;

//   var ref = doc(clouddb, "ImageLinks/" + name);

//   await setDoc(ref, {
//     ImageName: name + ext,
//     ImageURL: url,
//   });
// }

// async function getImagefromFirestore() {
//   var name = namebox.value;

//   var ref = doc(clouddb, "ImageLinks/" + name);

//   const docSnap = await getDoc(ref);

//   if (docSnap.exists()) {
//     myimg.src = docSnap.data().ImageURL;
//   }
// }
// upBtn.onclick = UploadProcess;
// downBtn.onclick = getImagefromFirestore;

////////////////////////////////////////////
// FUNCTIONS FOR REALTIME DATABASE//
////////////////////////////////////////////

async function saveURLtoRealtimeDB(URL) {
  var name = "img1";
  var ext = extlab.innerHTML;

  set(ref(db, "imagesLinks/" + name), {
    ImageName: name + ext,
    ImgUrl: URL,
  });
}

// async function getURLfromRealtimeDB() {
//   var name = namebox.value;
//   var dbRef = ref(db, "imagesLinks/" + name);

//   get(child(dbRef)).then((snapshot) => {
//     if (snapshot.exists()) {
//       myimg.src = snapshot.val().ImgUrl;
//     }
//   });
// }

// function validateName() {
//   var regex = /[\.#$\[\]]/;
//   return !regex.test(namebox.value);
// }

upBtn.onclick = UploadProcess;
