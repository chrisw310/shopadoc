var page = 1;


$(document).ready(function() {
    
    // hide pages that aren't the first page
    for (i=2; $("#page"+i).length === 1; i++) {
        $("#page"+i).hide();
    }
    
    // next button
    $("#btnNext").click(function() {
        page++;
        if ($("#page"+page).length === 1) {
            var v = page-1;
            $("#page"+v).hide();
            $("#page"+page).show();
        } else {
            // move to confirm page
            //alert("move to confirm page");
            sendToConfirm();

        }
        
    });
    
    // previous button
    $("#btnPrev").click(function() {
        if(page > 1) {
            $("#page" + page).hide();
            page--;
            $("#page" + page).show();
        }
    });
});


function sendToConfirm(){
    var docName = decodeURI(window.location.pathname.split('/')[2]);
    var preExisting = '&preExisting=' + document.getElementById('preExisting').value;
    var lastDoctor = '&lastDoctor=' + document.getElementById('myForm').doctor.value;
    var symptom = '&symptom=' + document.getElementById('myForm').symptom.value;
    var additional = '&additional=' + document.getElementById('additional').value;
    window.location = window.location.origin + '/confirm/' + docName + window.location.hash +
        preExisting + lastDoctor + symptom + additional;
}


var profile = null; // Google Sign-In profile

/**
 * Retrieve profile information on user signin
 */
function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    //console.log(profile.getEmail());

    if (socket.connected) {
        console.log("User logged in");
        var dataToEmit = {
            token: googleUser.getAuthResponse().id_token
        };
        socket.emit('clientSignIn', dataToEmit, function(data) {
            console.log("User login confirmed on server");
            console.log(data);

            if (typeof data.err === "undefined") {
                profile.name = data.name;
                profile.pictureUrl = data.pictureUrl;
                //profile.email = data.email;
                //console.log(data);
                $("#welcomeMsg").text("Welcome, " + profile.name);
                $("#welcomeMsg, #signout").css("display","flex")
            }
        });
    }
}

/**
 * Sign out of website (does not sign user out of Google)
 */
function signOut() {
    profile = null;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out');
        $("#welcomeMsg, #signout").hide();
    });
}