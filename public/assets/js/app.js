// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<b>" + data[i].title + "</b>" + "<br />" + data[i].description + "</p>" + "<a href='" + data[i].link + "' target = '_blank'>" + data[i].link + "</a>" + "<hr>" + "<br />");
    $("#articles").append("<br>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<b>" + "Comment Title" + "</b>");
      $("#notes").append("<input id='titleInput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<b>" + "Comment Body" + "</b>");
      $("#notes").append("<textarea id='bodyInput' name='body'></textarea>");
      // An input for user to add name
      $("#notes").append("<b>" + "User" + "</b>");
      $("#notes").append("<input id='userInput' name='User' >");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' class='btn btn-primary' id='saveNote'>Save Comment</button>");

      $("#comments").empty();
      for (let i = 0; i < data.comment.length; i++) {
        $("#comments").append("<hr>")
        $("#comments").append("<p>" + "Title: " + data.comment[i].title + "</p>");
        $("#comments").append("<p>" + "Body: " + data.comment[i].body + "</p>");
        $("#comments").append("<p>" + "User: " + data.comment[i].user + "</p>");
        $("#comments").append("<button data-id='" + data.comment[i]._id + "' class='deleteNote btn btn-danger'>Delete Comment</button>");
        $("#comments").append("<br>");
      };
      $(".deleteNote").on("click", function () {
        var id = $(this).attr("data-id")
        $.ajax({
          url: "/api/comments/" + id,
          method: "DELETE"
        })
          .then(function (data) {
            console.log("delete")
          });
      });
    });
});

// When you click the save note button
$(document).on("click", "#saveNote", function () {
  // Grab the id associated with the article from the submit button
  console.log("clicked saveNote")
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleInput").val(),
      // Value taken from note textarea
      body: $("#bodyInput").val(),
      //value taken from user text area
      user: $("#userInput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      //$("#notes").empty();
      $("#titleInput").val("");
      $("#bodyInput").val("");
      $("#userInput").val("");

    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleInput").val("");
  $("#bodyInput").val("");
  $("#userInput").val("");
});
