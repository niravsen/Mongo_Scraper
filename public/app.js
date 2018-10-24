$.getJSON("/articles", function(data){
    for(var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<a href='http://www.huffingtonpost.ca" + data[i].link + "' target='_blank'>" + " (Visit this news article)" + "</a></p>");
  }
});

$(document).on("click", "p", function() {
    // Empty the news from the news section
    $("#note").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })

.then(function(data){
    console.log(data);
    $("#note").append("<p><strong>" + data.title + "</strong></p>" + "<br/><h3>" + "Comment" + "</h3>");
    $("#note").append("<input id='titleinput' name='title' >");
    $("#note").append("<textarea id='bodyinput' name='body'></textarea>");
    $("#note").append("<br/><button class='btn btn-primary' data-id='" + data._id + "' id='savenews'>Save news article & comment</button>");

if (data.note){
    $("#titleinput").val(data.note.title);
    $("#bodyinput").val(data.note.body);
  }
 });
});

$(document).on("click", "#savesnews", function(){
    var thisId = $(this).attr("data-id");

$.ajax({
    method: "POST",
    url: "/aricles/save/" + thisId
}) .done(function(data){
    window.location = "/"
})

$("#titleinput").val("");
$("#bodyinput").val("");

});

$(".delete").on("click", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete" + thisId
    }).done(function(data){
        window.location = "/saved"
    })
});