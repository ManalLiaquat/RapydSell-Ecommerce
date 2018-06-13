// Initialize Firebase
var config = {
    apiKey: "AIzaSyAH24oE91EfPlB1u4fIRMbaq_T48fgJ-kY",
    authDomain: "manal-liaquat.firebaseapp.com",
    databaseURL: "https://manal-liaquat.firebaseio.com",
    projectId: "manal-liaquat",
    storageBucket: "manal-liaquat.appspot.com",
    messagingSenderId: "174271760047"
};
firebase.initializeApp(config);


/* Registration Process */

var msg1 = document.getElementById("msg1");
var msg2 = document.getElementById("msg2");

function register() {
    var name = document.getElementById("name");
    var number = document.getElementById("number");
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    if (
        name.value === "" &&
        email.value === "" &&
        password.value === "" &&
        number.value === ""
    ) {
        msg1.innerHTML = "Please fill the form first";
        msg1.style.textShadow = "0px 0px 2px red";
        msg1.style.color = "red";
    }

    firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then(function (result) {
            var obj = {
                username: name.value,
                email: result.email,
                phoneNumber: number.value,
                uid: result.uid
                // emailVerified: result.emailVerified
            };


            firebase
                .database()
                .ref("RapydSell App")
                .child("Registration Data/" + result.uid)
                .set(obj);
            console.log(result);
            setTimeout(() => {
                name.value = "";
                number.value = "";
                email.value = "";
                password.value = "";
                msg1.innerHTML = "You are signed in successfully"
                msg1.style.textShadow = "0px 0px 2px green";
                msg1.style.color = "green";
            }, 1500);
        })
        .catch(function (error) {
            console.log(error);
            if (
                !(
                    name.value === "" &&
                    email.value === "" &&
                    password.value === "" &&
                    number.value === ""
                )
            ) {
                msg1.innerHTML = error.message;
                msg1.style.textShadow = "0px 0px 2px red";
                msg1.style.color = "red";
            }
        });

}

function login() {
    var userEmail = document.getElementById("userEmail");
    var userPass = document.getElementById("userPassword");

    firebase
        .auth()
        .signInWithEmailAndPassword(userEmail.value, userPass.value)
        .then(function (result) {
            msg2.style.textShadow = "0px 0px 2px green";
            msg2.style.color = "green";
            msg2.innerHTML = "You're logged in successfully";

            console.log(result.uid);
            setTimeout(() => {
                window.location = "home.html";
            }, 1000);
        })
        .catch(function (error) {
            console.log(error);
            msg2.style.color = "red";
            msg2.style.textShadow = "0px 0px 2px red";
            msg2.innerHTML = error.message;
        });
}

function sendVerificationLink() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {
        swal('Done', `Email Verifcation Link has been sent to ${user.email}`, 'success');
    }).catch(function (error) {
        swal('Error!', `${error.message}`, "error");
    })
}


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var uid = user.uid;
        console.log(uid);
        console.log(user.email);
        if (user.emailVerified === false) {
            document.getElementById("postBtn").style.display = "none";
            document.getElementById("verifyBtn").style.display = "inline";
        }
    } else {
        document.getElementById("verifyBtn").style.display = "none";
        document.getElementById("signinBtn").style.display = "inline";
        document.getElementById("profileBtn").style.display = "none";
        document.getElementById("postBtn").style.display = "none";
        console.log("Please login to see posts and post your ad too.");
    }

});

function logOut() {
    firebase.auth().signOut()
        .then(function (resolve) {
            window.location.replace("index.html");
            console.log("Succesfully Signed-Out", resolve);
        })
        .catch(function (err) {
            console.log("Error", err);
        })
}

/* Registration End */






/* Ad-Post  Start*/


function queryDatabase() {

    // var imagesArray = []; /* for slider images */

    firebase.database().ref("/RapydSell App/" + "Posts Data/").once("value").then(function (data) {

        var postObject = data.val();
        // console.log(postObject);
        var keys = Object.keys(postObject);

        var adContainer = document.getElementById("adContainer");

        var cardDeck;
        for (var i = 0; i < keys.length; i++) {        /* also check this condition manal => for(var i = keys.length; i > 0 ; i--) */
            var currentObj = postObject[keys[i]];
            if (i % 3 == 0) {
                cardDeck = document.createElement("DIV");
                cardDeck.className = "card-deck";
                adContainer.appendChild(cardDeck);
            }

            var cardMb3Hoverable = document.createElement("DIV");
            cardMb3Hoverable.setAttribute("class", "card mb-4 hoverable");
            cardDeck.appendChild(cardMb3Hoverable);

            var viewOverlayZoom = document.createElement("DIV");
            viewOverlayZoom.setAttribute("class", "view overlay zoom");
            cardMb3Hoverable.appendChild(viewOverlayZoom);

            var cardImgTop = document.createElement("IMG");
            cardImgTop.className = "img-fluid card-img-top waves-effect waves-light";
            cardImgTop.setAttribute("id", "adImg");
            cardImgTop.setAttribute("src", currentObj.imgUrl);
            viewOverlayZoom.appendChild(cardImgTop);

            var cardBody = document.createElement("DIV");
            cardBody.setAttribute("class", "card-body");
            cardMb3Hoverable.appendChild(cardBody);

            var cardTitle = document.createElement("H4");
            cardTitle.setAttribute("class", "card-title");
            cardTitle.innerHTML = currentObj.adTitle;
            cardBody.appendChild(cardTitle);

            var cardText = document.createElement("P");
            cardText.setAttribute("class", "card-text");
            cardText.innerHTML = currentObj.adDetail;
            cardBody.appendChild(cardText);

            var cardPriceTag = document.createElement("H4");
            cardPriceTag.setAttribute("class", "red-text");
            cardPriceTag.innerHTML = "Rs.";

            var cardPrice = document.createElement("H4");
            cardPrice.setAttribute("class", "red-text");
            cardPrice.innerHTML = currentObj.adPrice;
            cardPrice.style.display = "inline";
            cardPriceTag.appendChild(cardPrice);

            cardBody.appendChild(cardPriceTag);

            var hr = document.createElement("HR");
            cardBody.appendChild(hr);

            var adPostBy = document.createElement("P");
            adPostBy.innerHTML = "AD Posted By: ";
            cardBody.appendChild(adPostBy);

            var adPosterName = document.createElement("SPAN");
            adPosterName.className = "text-secondary";
            adPosterName.innerHTML = currentObj.ownerName;
            adPostBy.appendChild(adPosterName);

            // var us3rKey = currentObj.user;
            // firebase.database().ref("RapydSell App").child("Registration Data/" + us3rKey).on("value", (data) => {
            //     adPosterName.innerHTML = data.val().username;
            // });

            var adPosterNum = document.createElement("P");
            adPosterNum.innerHTML = "Contact Number: ";

            var adPosterNumber = document.createElement("SPAN");
            adPosterNumber.innerHTML = currentObj.phoneNumber;
            adPosterNumber.className = "text-secondary"
            adPosterNum.appendChild(adPosterNumber);
            cardBody.appendChild(adPosterNum);

            // /* Slider Images */
            // imagesArray.push(currentObj.imgUrl); /* for slider images */

            // var flag = 0;
            // var timer;
            // // console.log(imagesArray);
            // document.getElementById('img').style.backgroundImage = "url(" + imagesArray[3] + ")";
            //  function images() {
            //      if (flag === imagesArray.length) {
            //          flag = 0
            //         console.log(flag);
            //         document.getElementById('img').style.backgroundImage = "url(" + imagesArray[flag] + ")";
            //     }
            //     else {
            //         document.getElementById('img').style.backgroundImage = "url(" + imagesArray[flag] + ")";
            //         console.log(flag)
            //     }
            // }
            // timer = setInterval(() => {
            //     flag++
            //     images()
            // }, 500)
            // /* Slider End */
        }
    });
}

/* image uploader */
// var adsImage = document.getElementById("adImage");
// var reader = new FileReader();
// reader.onload = function (e) {
//   adsImage = e.target.result;
// };

// function readURL(input) {
//   if (input.files && input.files[0]) {
//     reader.readAsDataURL(input.files[0]);
//   }
// }

// document.getElementById("adImage").onchange = function () {
//   readURL(this);
// };