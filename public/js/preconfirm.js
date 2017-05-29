var page = 1;

var socket = io.connect();
var onSignIn;
var signOut;
var profile = null; // Google Sign-In profile
var loggedIn = null;

$.when(
    $.getScript("../js/util.js"),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
	if (loggedIn()) {
		profile = JSON.parse(sessionStorage.getItem("profile"));
		$("#welcomeMsg").text("Welcome, " + profile.name);
		$("#welcomeMsg, #signout").css("display","flex");
		$("#login").css("display","none");
	}

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