const onReadMoreClicks = function (newsIndex) {
  let textElement = document.getElementById(newsIndex);

  if (textElement.style.display === "none" || !textElement.style.display) {
    textElement.style.display = "inline";
    document.getElementById("btnReadMore" + newsIndex).innerHTML = "Read less";
  } else {
    textElement.style.display = "none";
    document.getElementById("btnReadMore" + newsIndex).innerHTML = "Read more";
  }
  console.log("boom");
};
