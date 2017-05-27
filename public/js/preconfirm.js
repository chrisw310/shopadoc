var page = 1;


$(document).ready(function() {
    
    // hide pages that aren't the first page
    for (i=2; $("#page"+i).length == 1; i++) {
        $("#page"+i).hide();
    }
    
    // next button
    $("#btnNext").click(function() {
        $("#page"+page).hide();
        page++;
        if ($("#page"+page).length == 1) {
            $("#page"+page).show();
        } else {
            // move to confirm page
            alert("move to confirm page");

        }
        
    });
    
    // previous button
    $("#btnPrev").click(function() {
        $("#page"+page).hide();
        page--;
        $("#page"+page).show();
    });
});