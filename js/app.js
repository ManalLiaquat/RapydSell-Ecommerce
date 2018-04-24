/* Registration Process */

function register() {
    var name = document.getElementById("name");
    var number = document.getElementById("number");
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    localStorage.setItem("Name", name.value);
    localStorage.setItem("Email", email.value);
    localStorage.setItem("Number", number.value);
    localStorage.setItem("Password", password.value);

    if (name.value === "" && email.value === "" && password.value === "" && number.value === "") {
        alert("Please fill the form first");
        window.location = "index.html"
    }
}

function login() {
    var userEmail = document.getElementById("userEmail");
    var userPass = document.getElementById("userPassword");
    var storageEmail = localStorage.getItem("Email");
    var storagePass = localStorage.getItem("Password");

    if (storageEmail === "" && storagePass === "") {
        alert("You're not signed-up");
        window.location = "index.html";
    }
    else if (userEmail.value === storageEmail && userPass.value === storagePass) {
        window.location = "rapydsell.html";
    }
    else {
        alert("Incorrect Details");
    }

}

/* Registration End */



let i = 0;

var adsImage = document.getElementById("adImage");
/* image uploader */
var reader = new FileReader();
reader.onload = function (e) {
    adsImage = e.target.result;
}

function readURL(input) {
    if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
    }
}

document.getElementById("adImage").onchange = function () {
    readURL(this);
}




/* Ad-Post  Start*/

var adsTitle = document.getElementById("adTitle");
var adsDetail = document.getElementById("adDetail");
var adsPrice = document.getElementById("adPrice");
var usersNumber = document.getElementById("userNumber");


function postMyAd() {
    localStorage.setItem("AdTitle" + i, adsTitle.value);
    localStorage.setItem("AdDetail" + i, adsDetail.value);
    localStorage.setItem("AdPrice" + i, adsPrice.value);
    localStorage.setItem("UserNumber" + i, usersNumber.value);
    localStorage.setItem("AdImage"+i, adsImage);
}

function getAdItems() {
    var getAdTitle = localStorage.getItem("AdTitle" + i);
    var getAdDetail = localStorage.getItem("AdDetail" + i);
    var getAdPrice = localStorage.getItem("AdPrice" + i);
    var getUserNumber = localStorage.getItem("UserNumber" + i);
    var getAdImage = localStorage.getItem("AdImage" + i);


    var adContainer = document.getElementById("adContainer");

    var cardDeck = document.createElement("DIV");
    cardDeck.setAttribute("class", "card-deck");
    adContainer.appendChild(cardDeck);


    var cardMb3Hoverable = document.createElement("DIV");
    cardMb3Hoverable.setAttribute("class", "card col-md-3 mb-3 hoverable");
    cardDeck.appendChild(cardMb3Hoverable);

    var viewOverlayZoom = document.createElement("DIV");
    viewOverlayZoom.setAttribute("class", "view overlay zoom");
    cardMb3Hoverable.appendChild(viewOverlayZoom);

    var cardImgTop = document.createElement("IMG");
    cardImgTop.setAttribute("class", "card-img-top");
    cardImgTop.setAttribute("id", "adImg");
    cardImgTop.setAttribute("src", getAdImage);
    viewOverlayZoom.appendChild(cardImgTop);

    var cardBody = document.createElement("DIV");
    cardBody.setAttribute("class", "card-body");
    cardMb3Hoverable.appendChild(cardBody);
    var cardMb3HoverableCounter = 1;

    var cardTitle = document.createElement("H4");
    cardTitle.setAttribute("class", "card-title")
    cardTitle.innerHTML = getAdTitle;
    cardBody.appendChild(cardTitle);

    var cardText = document.createElement("P");
    cardText.setAttribute("class", "card-text")
    cardText.innerHTML = getAdDetail;
    cardBody.appendChild(cardText);

    var cardPrice = document.createElement("H2");
    cardPrice.setAttribute("class", "red-text")
    cardPrice.innerHTML = getAdPrice;
    cardBody.appendChild(cardPrice);

    cardMb3HoverableCounter++;

    if (cardMb3HoverableCounter === 4) {
        var newline = document.createElement("BR");
        cardDeck.appendChild(newline);
    }

}




/* Ad-Post  End*/

