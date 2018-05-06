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
                uid: result.uid,
                emailVerified: result.emailVerified
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
                window.location = "rapydsell.html";
            }, 2000);
        })
        .catch(function (error) {
            console.log(error);
            msg2.style.color = "red";
            msg2.style.textShadow = "0px 0px 2px red";
            msg2.innerHTML = error.message;
        });
}




firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var uid = user.uid;
        console.log(uid);
        var token = firebase.auth().currentUser.uid;
        queryDatabase(token);
    } else {
        // window.location = "index.html";
        console.log("Please login to see posts and post your ad too.");
        msg2.innerHTML = "User is signed out.";
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



var adsTitle = document.getElementById("adTitle");
var adsDetail = document.getElementById("adDetail");
var adsPrice = document.getElementById("adPrice");
var usersNumber = document.getElementById("userNumber");

window.onload =
    function postMyAd() {
        // File
        var fileBtn = document.getElementById("adImage");
        var progressBar = document.getElementById("progressBar");


        fileBtn.addEventListener("change", function (e) {
            //   get a file
            var file = e.target.files[0];
            //   create a storage ref
            var storageRef = firebase.storage().ref("RapydSellApp/" + file.name);
            //   upload a file
            var uploadTask = storageRef.put(file);

            // var uploadTask = firebase.storage().ref('RapydSellApp/' + file.name).put(file);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on("state_changed", // or 'state_changed'
                function (snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.value = percentage;
                    console.log('Upload is ' + percentage + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {

                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            console.log(error);
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            console.log(error);
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            console.log(error);
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function () {
                    // Upload completed successfully, now we can get the download URL
                    var postKey = firebase.database().ref("RapydSell App/" + "Posts Data/").push().key;
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    var updates = {};
                    var postData = {
                        adTitle: adsTitle.value,
                        adDetail: adsDetail.value,
                        adPrice: adsPrice.value,
                        phoneNumber: usersNumber.value,
                        imgUrl: downloadURL,
                        user: firebase.auth().currentUser.uid
                    };
                    updates["/RapydSell App/" + "Posts Data/" + postKey] = postData;
                    firebase.database().ref().update(updates);
                    console.log(downloadURL);
                });
        });
    }



/* Ad-Post  Start*/


function queryDatabase(token) {
    firebase.database().ref("/RapydSell App/" + "Posts Data/").once("value").then(function (data) {
        var postObject = data.val();
        console.log(postObject);
        var keys = Object.keys(postObject);

        var adContainer = document.getElementById("adContainer");

        var cardDeck;
        for (var i = 0; i < keys.length; i++) {
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
            cardImgTop.setAttribute("class", "card-img-top");
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

            var us3rKey = currentObj.user;
            firebase.database().ref("RapydSell App").child("Registration Data/" + us3rKey).on("value", (data) => {
                adPosterName.innerHTML = data.val().username;
            });
            adPostBy.appendChild(adPosterName);

            var adPosterNum = document.createElement("P");
            adPosterNum.innerHTML = "Contact Number: ";

            var adPosterNumber = document.createElement("SPAN");
            adPosterNumber.innerHTML = currentObj.phoneNumber;
            adPosterNumber.className = "text-secondary"
            adPosterNum.appendChild(adPosterNumber);
            cardBody.appendChild(adPosterNum);

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