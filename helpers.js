const onReadMoreClicks = function (newsIndex) {
  let textElement = document.getElementById(newsIndex);

  if (textElement.style.display === "none" || !textElement.style.display) {
    textElement.style.display = "inline";
    document.getElementById("btnReadMore" + newsIndex).innerHTML = "Read less";
    document.querySelector(".dots").style.display = "none";
  } else {
    textElement.style.display = "none";
    document.getElementById("btnReadMore" + newsIndex).innerHTML = "Read more";
    document.querySelector(".dots").style.display = "inline";
  }
  console.log("boom");
};
