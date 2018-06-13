// Initialize Firebase Starts
var config = {
    apiKey: "AIzaSyAH24oE91EfPlB1u4fIRMbaq_T48fgJ-kY",
    authDomain: "manal-liaquat.firebaseapp.com",
    databaseURL: "https://manal-liaquat.firebaseio.com",
    projectId: "manal-liaquat",
    storageBucket: "manal-liaquat.appspot.com",
    messagingSenderId: "174271760047"
};
firebase.initializeApp(config);
// Initialize Firebase Ends

/* Check user is signed in or not */
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
/* Check user is signed in or not */

/* Logout button Starts */
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
/* Logout button Ends */


/* Ad Posting Starts here */
var adsTitle = document.getElementById("adTitle");
var adsDetail = document.getElementById("adDetail");
var AdOwnerName = document.getElementById("AdOwnerName");
var adsPrice = document.getElementById("adPrice");
var usersNumber = document.getElementById("userNumber");

// File
var fileBtn = document.getElementById("adImage");
var progressBar = document.getElementById("progressBar");

fileBtn.addEventListener("change", async function (e) {
    //   get a file
    file = e.target.files[0];
});

function postMyAd() {

    //   create a storage ref
    var storageRef = firebase.storage().ref("RapydSellApp/" + file.name);
    //   upload a file
    var uploadTask = storageRef.put(file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
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
                    console.log(error, "User doesn't have permission to access the object");
                    break;

                case 'storage/canceled':
                    console.log(error, "User canceled the upload");
                    break;

                case 'storage/unknown':
                    console.log(error, "Unknown error occurred, inspect error.serverResponse");
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
                ownerName: AdOwnerName.value,
                adPrice: adsPrice.value,
                phoneNumber: usersNumber.value,
                imgUrl: downloadURL,
                user: firebase.auth().currentUser.uid
            };
            updates["/RapydSell App/" + "Posts Data/" + postKey] = postData;
            firebase.database().ref().update(updates);
            swal({
                title: "Your ad is live now",
                text: "Click OK to see your advertise",
                icon: "success",
            })
                .then((willOK) => {
                    if (willOK) {
                        window.location = 'home.html';
                        adsTitle.value = "";
                        adsDetail.value = "";
                        adsPrice.value = "";
                        AdOwnerName.value = "";
                        usersNumber.value = "";
                    }
                });
            // console.log(downloadURL);
        });
}
/* Ad Posting Ends here */
