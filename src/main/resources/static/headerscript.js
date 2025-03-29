// Loads the header and footer for each file on page load.
// Requires the use of jQuery. Not a costly requirement as our database requires jQuery calls.
$(function() {
    $("#header").load("header.html"); 
    $("#footer").load("footer.html");
});